import React, { useState } from 'react';
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  HStack,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TransactionTableRow from "components/Tables/TransactionTableRow";
import { useTransactions } from 'contexts/TransactionContext';
import { exportToExcel, exportToPDF, getExportSummary } from 'utils/exportUtils';

const CategoryManager = () => {
  const { transactions } = useTransactions();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  const handleExcelExport = async () => {
    if (transactions.length === 0) {
      toast({
        title: 'No Data',
        description: 'No transactions available to export',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsExporting(true);
    try {
      const result = exportToExcel(transactions, 'expense_categories');
      toast({
        title: 'Export Successful',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export Excel file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExport = async () => {
    if (transactions.length === 0) {
      toast({
        title: 'No Data',
        description: 'No transactions available to export',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsExporting(true);
    try {
      const result = exportToPDF(transactions, 'expense_categories');
      toast({
        title: 'Export Successful',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
      <CardHeader p="6px 0px 22px 0px">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Transaction Management
          </Text>
          <HStack spacing={3}>
            <Button
              leftIcon={isExporting ? <Spinner size="sm" /> : <DownloadIcon />}
              colorScheme="green"
              variant="outline"
              size="sm"
              onClick={handleExcelExport}
              isLoading={isExporting}
              loadingText="Exporting..."
            >
              Export Excel
            </Button>
            <Button
              leftIcon={isExporting ? <Spinner size="sm" /> : <DownloadIcon />}
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={handlePDFExport}
              isLoading={isExporting}
              loadingText="Exporting..."
            >
              Export PDF
            </Button>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {transactions.length}
            </Text>
          </HStack>
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
