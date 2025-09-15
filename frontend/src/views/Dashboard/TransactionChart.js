// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import PieChart from "components/Charts/PieChart";
import React, { useMemo } from "react";
// Transaction context
import { useTransactions } from "contexts/TransactionContext";

export default function TransactionChart() {
  // Chakra Color Mode
  const textColor = useColorModeValue("gray.700", "white");
  const { colorMode } = useColorMode();
  
  // Get transactions from context
  const { transactions } = useTransactions();

  // Process transaction data for pie chart
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        series: [],
        options: {
          chart: {
            type: 'pie',
          },
          labels: [],
          colors: [],
          legend: {
            position: 'bottom',
            labels: {
              colors: colorMode === 'dark' ? '#fff' : '#000',
            },
          },
          dataLabels: {
            enabled: true,
            style: {
              colors: ['#fff']
            }
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total',
                    color: colorMode === 'dark' ? '#fff' : '#000',
                  }
                }
              }
            }
          },
          tooltip: {
            theme: colorMode,
            y: {
              formatter: function (val) {
                return "$" + val.toFixed(2);
              }
            }
          }
        }
      };
    }

    // Group transactions by category and calculate totals
    const categoryTotals = {};
    const categoryColors = {
      'food': '#FF6B6B',
      'rent': '#4ECDC4',
      'travel': '#45B7D1',
      'shopping': '#96CEB4',
      'bills': '#FFEAA7',
      'salary': '#DDA0DD',
      'others': '#98D8C8',
      'entertainment': '#F7DC6F',
      'healthcare': '#BB8FCE',
      'education': '#85C1E9'
    };

    transactions.forEach(transaction => {
      const category = transaction.category || 'others';
      const amount = parseFloat(transaction.amount) || 0;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
    });

    // Convert to arrays for ApexCharts
    const labels = Object.keys(categoryTotals);
    const series = Object.values(categoryTotals);
    const colors = labels.map(label => categoryColors[label] || '#95A5A6');

    return {
      series: series,
      options: {
        chart: {
          type: 'pie',
          background: 'transparent',
        },
        labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
        colors: colors,
        legend: {
          position: 'bottom',
          labels: {
            colors: colorMode === 'dark' ? '#fff' : '#000',
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ['#fff'],
            fontSize: '12px',
            fontWeight: 'bold'
          },
          formatter: function (val, opts) {
            const value = opts.w.config.series[opts.seriesIndex];
            return "$" + value.toFixed(0);
          }
        },
        plotOptions: {
          pie: {
            expandOnClick: true,
            donut: {
              size: '0%'
            }
          }
        },
        tooltip: {
          theme: colorMode,
          y: {
            formatter: function (val) {
              return "$" + val.toFixed(2);
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  }, [transactions, colorMode]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.amount) || 0);
    }, 0);
  }, [transactions]);

  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <Card p='20px' maxW={{ sm: "320px", md: "100%" }}>
        <Flex direction='column' mb='40px'>
          <Text color={textColor} fontSize='lg' fontWeight='bold' mb='6px'>
            Transaction Distribution by Category
          </Text>
          <Text color='gray.400' fontSize='sm'>
            Total Amount: <Text as='span' color='green.400' fontWeight='bold'>
              ${totalAmount.toFixed(2)}
            </Text>
          </Text>
          <Text color='gray.400' fontSize='sm'>
            Total Transactions: <Text as='span' color='blue.400' fontWeight='bold'>
              {transactions.length}
            </Text>
          </Text>
        </Flex>
        <Box minH='400px' w='100%'>
          {transactions.length > 0 ? (
            <PieChart
              chartData={chartData.series}
              chartOptions={chartData.options}
            />
          ) : (
            <Flex 
              align='center' 
              justify='center' 
              minH='400px' 
              direction='column'
            >
              <Text color='gray.400' fontSize='lg' mb='4'>
                No transactions found
              </Text>
              <Text color='gray.400' fontSize='sm'>
                Add some transactions to see the chart
              </Text>
            </Flex>
          )}
        </Box>
      </Card>
    </Flex>
  );
}
