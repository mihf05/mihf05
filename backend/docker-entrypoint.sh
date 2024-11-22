#!/bin/bash
set -e

# Debug: Print environment variables
echo "DEBUG: Environment variables:"
echo "DATABASE_URL=$DATABASE_URL"
echo "SECRET_KEY=$SECRET_KEY"
echo "CORS_ORIGINS=$CORS_ORIGINS"

# Function to get database connection details from DATABASE_URL
get_db_details() {
    if [ -z "$DATABASE_URL" ]; then
        echo "ERROR: DATABASE_URL environment variable is not set"
        exit 1
    fi

    echo "DEBUG: Parsing DATABASE_URL: $DATABASE_URL"

    # Extract components using basic parameter substitution
    url=${DATABASE_URL#*://}
    userpass=${url%%@*}
    hostport=${url#*@}
    hostport=${hostport%%/*}

    export DB_USER=${userpass%%:*}
    export DB_PASS=${userpass#*:}
    export DB_HOST=${hostport%%:*}
    export DB_NAME=${url##*/}
    export DB_NAME=${DB_NAME%%\?*}

    # Handle optional port
    if [[ $hostport == *:* ]]; then
        export DB_PORT=${hostport#*:}
    else
        export DB_PORT="5432"
    fi

    echo "DEBUG: Parsed database details:"
    echo "DB_USER=$DB_USER"
    echo "DB_HOST=$DB_HOST"
    echo "DB_PORT=$DB_PORT"
    echo "DB_NAME=$DB_NAME"
}

# Get database details
get_db_details

# Wait for the database to be ready
echo "Waiting for database to be ready..."
python << END
import sys
import time
import psycopg2
while True:
    try:
        psycopg2.connect(
            dbname="${DB_NAME}",
            user="${DB_USER}",
            password="${DB_PASS}",
            host="${DB_HOST}",
            port="${DB_PORT}"
        )
        break
    except psycopg2.OperationalError as e:
        print("Database not ready. Waiting... Error:", str(e))
        time.sleep(2)
END

# Run migrations
echo "Running database migrations..."
MIGRATION_DIR="/app/alembic/versions"
mkdir -p "$MIGRATION_DIR"

if [ -z "$(ls -A $MIGRATION_DIR)" ]; then
    echo "No migrations found. Creating initial migration..."
    # Reset alembic state
    python << END
import psycopg2
conn = psycopg2.connect(dbname="${DB_NAME}", user="${DB_USER}", password="${DB_PASS}", host="${DB_HOST}", port="${DB_PORT}")
cur = conn.cursor()
cur.execute("DROP TABLE IF EXISTS alembic_version")
conn.commit()
conn.close()
END

    # Create and run initial migration
    alembic revision --autogenerate -m "initial_migration" || exit 1
    alembic upgrade head || exit 1
else
    echo "Existing migrations found. Running upgrade..."
    alembic upgrade head || exit 1
fi

# Create initial data
echo "Creating initial data..."
python -m app.initial_data

# Start the application with configurable workers
WORKERS=${WORKERS:-4}
PORT=8001
echo "Starting application with $WORKERS workers on port $PORT..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers $WORKERS
