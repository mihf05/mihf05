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
import { getSalaries, getLoans, requestLoan } from '../../utils/api';

interface Salary {
  id: number;
  amount: number;
  status: string;
  payment_date: string;
}

interface Loan {
  id: number;
  amount: number;
  status: string;
  repayment_percentage?: number;
}

const EmployeeDashboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: salaries, isLoading: salariesLoading } = useQuery<Salary[]>({
    queryKey: ['salaries'],
    queryFn: getSalaries
  });

  const { data: loans, isLoading: loansLoading } = useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: getLoans
  });

  const loanMutation = useMutation<void, Error, number>({
    mutationFn: (amount: number) => requestLoan(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({
        title: 'Success',
        description: 'Loan request submitted successfully',
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
        description: 'Failed to submit loan request',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
  });

  const handleLoanRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = Number(formData.get('amount'));
    loanMutation.mutate(amount);
  };

  if (salariesLoading || loansLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Salary History</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Payment Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {salaries?.map((salary) => (
                <Tr key={salary.id}>
                  <Td>${salary.amount}</Td>
                  <Td>{salary.status}</Td>
                  <Td>{new Date(salary.payment_date).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>Loans</Heading>
          <Button colorScheme="blue" mb={4} onClick={onOpen}>
            Request Loan
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Repayment %</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loans?.map((loan) => (
                <Tr key={loan.id}>
                  <Td>${loan.amount}</Td>
                  <Td>{loan.status}</Td>
                  <Td>{loan.repayment_percentage}%</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Request Loan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleLoanRequest}>
                <FormControl isRequired>
                  <FormLabel>Amount</FormLabel>
                  <Input type="number" name="amount" min="0" step="0.01" />
                </FormControl>
                <Button type="submit" colorScheme="blue" mt={4}>
                  Submit Request
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default EmployeeDashboard;
