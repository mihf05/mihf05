import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/table';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import { useToast } from '@chakra-ui/toast';
import { getEmployees, getAllLoans, createEmployee, updateLoanStatus } from '../../utils/api';

interface Employee {
  id: number;
  email: string;
  full_name: string;
}

interface LoanRequest {
  id: number;
  user_id: number;
  amount: number;
  status: string;
}

const HRDashboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: employees, isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getEmployees
  });

  const { data: loans, isLoading: loansLoading } = useQuery<LoanRequest[]>({
    queryKey: ['loans'],
    queryFn: getAllLoans
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (employeeData: { email: string; password: string; full_name: string }) =>
      createEmployee(employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Success',
        description: 'Employee added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
  });

  const updateLoanMutation = useMutation({
    mutationFn: ({ loanId, status }: { loanId: number; status: string }) =>
      updateLoanStatus(loanId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({
        title: 'Success',
        description: 'Loan status updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update loan status',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const employeeData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      full_name: formData.get('full_name') as string,
    };
    createEmployeeMutation.mutate(employeeData);
  };

  const handleLoanAction = (loanId: number, status: string) => {
    updateLoanMutation.mutate({ loanId, status });
  };

  if (employeesLoading || loansLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Employees</Heading>
          <Button colorScheme="blue" mb={4} onClick={onOpen}>
            Add Employee
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees?.map((employee) => (
                <Tr key={employee.id}>
                  <Td>{employee.full_name}</Td>
                  <Td>{employee.email}</Td>
                  <Td>
                    <Button size="sm" colorScheme="blue" mr={2}>
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>Loan Requests</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Employee</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loans?.map((loan) => (
                <Tr key={loan.id}>
                  <Td>{employees?.find(e => e.id === loan.user_id)?.full_name}</Td>
                  <Td>${loan.amount}</Td>
                  <Td>{loan.status}</Td>
                  <Td>
                    {loan.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          colorScheme="green"
                          mr={2}
                          onClick={() => handleLoanAction(loan.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleLoanAction(loan.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleAddEmployee}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input name="full_name" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" />
                  </FormControl>
                  <Button type="submit" colorScheme="blue" width="full">
                    Add Employee
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default HRDashboard;
