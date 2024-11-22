# Build stage
FROM python:3.12-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    python3-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.12-alpine

WORKDIR /app

# Install runtime dependencies and create user
RUN apk add --no-cache \
    libpq \
    curl \
    bash && \
    adduser -D appuser

# Copy Python packages and binaries
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/alembic /usr/local/bin/alembic
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn
RUN find /usr/local/lib/python3.12/site-packages/ -name "*.pyc" -delete && \
    find /usr/local/lib/python3.12/site-packages/ -name "__pycache__" -exec rm -r {} +

# Copy application files
COPY ./app ./app
COPY ./alembic.ini .
COPY ./alembic ./alembic
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

ENV PYTHONPATH=/app
ENV PORT=8001
ENV PYTHONOPTIMIZE=2

# Set permissions
RUN chmod +x /app/docker-entrypoint.sh && \
    mkdir -p /app/alembic/versions && \
    chown -R appuser:appuser /app && \
    find /app -type d -exec chmod 755 {} \; && \
    find /app -type f -exec chmod 644 {} \; && \
    chmod 755 /app/docker-entrypoint.sh && \
    ls -la /app/docker-entrypoint.sh

USER appuser

EXPOSE ${PORT}

ENTRYPOINT ["/app/docker-entrypoint.sh"]
