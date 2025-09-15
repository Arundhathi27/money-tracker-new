import React from 'react';
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react';
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TransactionTableRow from "components/Tables/TransactionTableRow";
import { useTransactions } from 'contexts/TransactionContext';

const CategoryManager = () => {
  const { transactions } = useTransactions();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
      <CardHeader p="6px 0px 22px 0px">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Transaction Management
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            {transactions.length}
          </Text>
        </Flex>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Total Transactions
        </Text>
      </CardHeader>
      <CardBody>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px" color="gray.400">
              <Th pl="0px" borderColor={borderColor} color="gray.400">
                Transaction
              </Th>
              <Th borderColor={borderColor} color="gray.400">Type</Th>
              <Th borderColor={borderColor} color="gray.400">Amount</Th>
              <Th borderColor={borderColor} color="gray.400">Category</Th>
              <Th borderColor={borderColor} color="gray.400">Date</Th>
              <Th borderColor={borderColor} color="gray.400">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" py={8} borderColor={borderColor}>
                  <Text color="gray.500">No transactions found. Add your first transaction!</Text>
                </Td>
              </Tr>
            ) : (
              transactions.map((transaction, index, arr) => {
                return (
                  <TransactionTableRow
                    transaction={transaction}
                    isLast={index === arr.length - 1 ? true : false}
                    key={transaction.id}
                  />
                );
              })
            )}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default CategoryManager;
