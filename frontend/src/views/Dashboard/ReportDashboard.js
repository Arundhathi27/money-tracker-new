// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  SimpleGrid,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
// Chart components
import LineChart from "components/Charts/LineChart";
import PieChart from "components/Charts/PieChart";
import ApexLineChart from "components/Charts/ApexLineChart";
import ApexPieChart from "components/Charts/ApexPieChart";
// Custom icons
import {
  CartIcon,
  WalletIcon,
  StatsIcon,
} from "components/Icons/Icons.js";
import React, { useState, useEffect, useRef } from "react";
// PDF export
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// Date handling
import { format, startOfWeek, endOfWeek, addDays, subDays, subWeeks, subMonths, startOfMonth, endOfMonth } from "date-fns";

// Mock data for demonstration
const mockTransactions = [
  { id: 1, date: "2025-10-01", amount: 1200, type: "income", category: "Salary" },
  { id: 2, date: "2025-10-02", amount: -45, type: "expense", category: "Groceries" },
  { id: 3, date: "2025-10-03", amount: -25, type: "expense", category: "Transportation" },
  { id: 4, date: "2025-10-04", amount: -120, type: "expense", category: "Utilities" },
  { id: 5, date: "2025-10-05", amount: -60, type: "expense", category: "Dining" },
  { id: 6, date: "2025-09-25", amount: 500, type: "income", category: "Freelance" },
  { id: 7, date: "2025-09-26", amount: -35, type: "expense", category: "Entertainment" },
  { id: 8, date: "2025-09-27", amount: -80, type: "expense", category: "Shopping" },
  { id: 9, date: "2025-09-28", amount: -40, type: "expense", category: "Groceries" },
  { id: 10, date: "2025-09-29", amount: -30, type: "expense", category: "Transportation" },
  { id: 11, date: "2025-09-15", amount: 1200, type: "income", category: "Salary" },
  { id: 12, date: "2025-09-16", amount: -200, type: "expense", category: "Rent" },
  { id: 13, date: "2025-09-17", amount: -50, type: "expense", category: "Groceries" },
  { id: 14, date: "2025-09-18", amount: -25, type: "expense", category: "Transportation" },
  { id: 15, date: "2025-09-19", amount: -45, type: "expense", category: "Dining" },
];

export default function ReportDashboard() {
  // Chakra Color Mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const bgCard = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  
  // State for report type and date
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState({
    income: 0,
    expenses: 0,
    netBalance: 0,
    categories: {},
    trend: 0,
    chartData: {
      income: [],
      expense: []
    }
  });
  
  // Ref for the report container (for PDF export)
  const reportRef = useRef(null);
  
  // Format date based on report type
  const getFormattedDateRange = () => {
    if (reportType === "daily") {
      return format(selectedDate, "MM/dd/yyyy");
    } else if (reportType === "weekly") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(weekStart, "dd MMM")} – ${format(weekEnd, "dd MMM yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };
  
  // Filter transactions based on report type and selected date
  const filterTransactions = () => {
    let filtered = [];
    
    if (reportType === "daily") {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      filtered = mockTransactions.filter(t => t.date === dateStr);
    } else if (reportType === "weekly") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      filtered = mockTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      });
    } else {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      filtered = mockTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= monthStart && date <= monthEnd;
      });
    }
    
    return filtered;
  };
  
  // Calculate previous period for comparison
  const getPreviousPeriodTransactions = () => {
    let previousDate;
    
    if (reportType === "daily") {
      previousDate = subDays(selectedDate, 1);
    } else if (reportType === "weekly") {
      previousDate = subWeeks(selectedDate, 1);
    } else {
      previousDate = subMonths(selectedDate, 1);
    }
    
    let filtered = [];
    
    if (reportType === "daily") {
      const dateStr = format(previousDate, "yyyy-MM-dd");
      filtered = mockTransactions.filter(t => t.date === dateStr);
    } else if (reportType === "weekly") {
      const weekStart = startOfWeek(previousDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(previousDate, { weekStartsOn: 1 });
      filtered = mockTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      });
    } else {
      const monthStart = startOfMonth(previousDate);
      const monthEnd = endOfMonth(previousDate);
      filtered = mockTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= monthStart && date <= monthEnd;
      });
    }
    
    return filtered;
  };
  
  // Process data for the report
  const processReportData = () => {
    const transactions = filterTransactions();
    const previousTransactions = getPreviousPeriodTransactions();
    
    // Calculate totals
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const netBalance = income - expenses;
    
    // Calculate previous period totals
    const prevIncome = previousTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const prevExpenses = previousTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Calculate trend (percentage change)
    const expenseTrend = prevExpenses === 0 ? 0 : ((expenses - prevExpenses) / prevExpenses) * 100;
    
    // Process categories
    const categories = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        if (!categories[t.category]) {
          categories[t.category] = 0;
        }
        categories[t.category] += Math.abs(t.amount);
      });
    
    // Prepare chart data
    const chartData = {
      income: [],
      expense: []
    };
    
    if (reportType === "daily") {
      // For daily, show hourly breakdown (mock data)
      for (let i = 0; i < 24; i++) {
        chartData.income.push({
          x: `${i}:00`,
          y: Math.random() * 100 * (i % 3 === 0 ? 1 : 0.2)
        });
        chartData.expense.push({
          x: `${i}:00`,
          y: Math.random() * 50
        });
      }
    } else if (reportType === "weekly") {
      // For weekly, show daily breakdown
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const dayStr = format(day, "yyyy-MM-dd");
        const dayIncome = transactions
          .filter(t => t.date === dayStr && t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const dayExpense = transactions
          .filter(t => t.date === dayStr && t.type === "expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
        chartData.income.push({
          x: format(day, "EEE"),
          y: dayIncome
        });
        chartData.expense.push({
          x: format(day, "EEE"),
          y: dayExpense
        });
      }
    } else {
      // For monthly, show weekly breakdown
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      let currentWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      
      while (currentWeekStart <= monthEnd) {
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        const weekIncome = transactions
          .filter(t => {
            const date = new Date(t.date);
            return date >= currentWeekStart && date <= weekEnd && t.type === "income";
          })
          .reduce((sum, t) => sum + t.amount, 0);
          
        const weekExpense = transactions
          .filter(t => {
            const date = new Date(t.date);
            return date >= currentWeekStart && date <= weekEnd && t.type === "expense";
          })
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
        chartData.income.push({
          x: `W${format(currentWeekStart, "w")}`,
          y: weekIncome
        });
        chartData.expense.push({
          x: `W${format(currentWeekStart, "w")}`,
          y: weekExpense
        });
        
        currentWeekStart = addDays(currentWeekStart, 7);
      }
    }
    
    setReportData({
      income,
      expenses,
      netBalance,
      categories,
      trend: expenseTrend,
      chartData
    });
  };
  
  // Handle report type change
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };
  
  // Handle date navigation
  const handlePrevDate = () => {
    if (reportType === "daily") {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (reportType === "weekly") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };
  
  const handleNextDate = () => {
    if (reportType === "daily") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (reportType === "weekly") {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      setSelectedDate(addDays(selectedDate, 30));
    }
  };
  
  // Handle PDF export
  const handleExportPDF = () => {
    if (reportRef.current) {
      html2canvas(reportRef.current, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        
        // Add title
        pdf.setFontSize(18);
        pdf.text(`Money Tracker Report - ${getFormattedDateRange()}`, pdfWidth / 2, 20, { align: 'center' });
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`money-tracker-report-${reportType}-${format(selectedDate, 'yyyy-MM-dd')}.pdf`);
      });
    }
  };
  
  // Process data when report type or date changes
  useEffect(() => {
    processReportData();
  }, [reportType, selectedDate]);
  
  // Prepare chart options and data
  const lineChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#4318FF", "#39B8FF"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      type: "line",
    },
    xaxis: {
      type: "category",
      categories: reportData.chartData.income.map(item => item.x),
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
    },
    legend: {
      show: true,
    },
    grid: {
      show: false,
      column: {
        color: ["#7551FF", "#39B8FF"],
        opacity: 0.5,
      },
    },
  };
  
  const lineChartData = [
    {
      name: "Income",
      data: reportData.chartData.income.map(item => item.y),
    },
    {
      name: "Expenses",
      data: reportData.chartData.expense.map(item => item.y),
    },
  ];
  
  // Prepare pie chart data
  const pieChartData = Object.entries(reportData.categories).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <div ref={reportRef}>
        {/* Header with report type selector and date navigation */}
        <Flex mb="20px" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Text fontSize="xl" fontWeight="bold" mr={4}>
              Money Tracker Report
            </Text>
            <Select 
              value={reportType} 
              onChange={handleReportTypeChange} 
              width="150px"
              borderRadius="15px"
              size="sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </Flex>
          
          <Flex alignItems="center">
            <Button size="sm" onClick={handlePrevDate} mr={2}>
              Previous
            </Button>
            <Text fontWeight="medium" mx={3}>
              {getFormattedDateRange()}
            </Text>
            <Button size="sm" onClick={handleNextDate} ml={2}>
              Next
            </Button>
            <Button 
              leftIcon={<DownloadIcon />} 
              colorScheme="blue" 
              variant="solid" 
              size="sm" 
              ml={4}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </Flex>
        </Flex>
        
        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px" mb="20px">
          {/* Income Card */}
          <Card>
            <CardBody>
              <Flex flexDirection="row" align="center" justify="center" w="100%">
                <Stat me="auto">
                  <StatLabel fontSize="sm" color="gray.400" fontWeight="bold" pb="2px">
                    Total Income
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color={textColor}>
                      ${reportData.income.toFixed(2)}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox as="box" h={"45px"} w={"45px"} bg={iconBlue}>
                  <WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
          
          {/* Expenses Card */}
          <Card>
            <CardBody>
              <Flex flexDirection="row" align="center" justify="center" w="100%">
                <Stat me="auto">
                  <StatLabel fontSize="sm" color="gray.400" fontWeight="bold" pb="2px">
                    Total Expenses
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color={textColor}>
                      ${reportData.expenses.toFixed(2)}
                    </StatNumber>
                    <StatHelpText
                      alignSelf="flex-end"
                      justifySelf="flex-end"
                      m="0px"
                      color={reportData.trend > 0 ? "red.500" : "green.500"}
                      fontWeight="bold"
                      ps="3px"
                      fontSize="md"
                    >
                      <StatArrow type={reportData.trend > 0 ? "increase" : "decrease"} />
                      {Math.abs(reportData.trend).toFixed(1)}%
                    </StatHelpText>
                  </Flex>
                </Stat>
                <IconBox as="box" h={"45px"} w={"45px"} bg="red.500">
                  <CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
          
          {/* Net Balance Card */}
          <Card>
            <CardBody>
              <Flex flexDirection="row" align="center" justify="center" w="100%">
                <Stat>
                  <StatLabel fontSize="sm" color="gray.400" fontWeight="bold" pb="2px">
                    Net Balance
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color={reportData.netBalance >= 0 ? "green.500" : "red.500"}>
                      ${reportData.netBalance.toFixed(2)}
                    </StatNumber>
                  </Flex>
                </Stat>
                <Spacer />
                <IconBox as="box" h={"45px"} w={"45px"} bg={reportData.netBalance >= 0 ? "green.500" : "red.500"}>
                  <StatsIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Charts */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" mb="20px">
          {/* Income vs Expenses Trend */}
          <Card p="28px 10px 16px 0px" mb={{ sm: "26px", lg: "0px" }}>
            <CardHeader mb="20px" pl="22px">
              <Flex direction="column" alignSelf="flex-start">
                <Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
                  Income vs Expenses
                </Text>
                <Text fontSize="md" fontWeight="medium" color="gray.400">
                  {reportType === "daily" ? "Hourly breakdown" : 
                   reportType === "weekly" ? "Daily breakdown" : "Weekly breakdown"}
                </Text>
              </Flex>
            </CardHeader>
            <Box w="100%" h={{ sm: "300px" }} ps="8px">
              <ApexLineChart
                chartData={lineChartData}
                chartOptions={lineChartOptions}
              />
            </Box>
          </Card>
          
          {/* Category Breakdown */}
          <Card p="28px 10px 16px 0px" mb={{ sm: "26px", lg: "0px" }}>
            <CardHeader mb="20px" pl="22px">
              <Flex direction="column" alignSelf="flex-start">
                <Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
                  Spending by Category
                </Text>
                <Text fontSize="md" fontWeight="medium" color="gray.400">
                  {getFormattedDateRange()}
                </Text>
              </Flex>
            </CardHeader>
            <Box w="100%" h={{ sm: "300px" }} ps="8px">
              <ApexPieChart
                chartData={pieChartData}
              />
            </Box>
          </Card>
        </SimpleGrid>
        
        {/* Top Spending Categories */}
        <Card p="16px" mb="20px">
          <CardHeader p="12px 5px" mb="12px">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Top Spending Categories
            </Text>
          </CardHeader>
          <CardBody px="5px">
            <Flex direction="column">
              {Object.entries(reportData.categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, amount], index) => (
                  <Flex key={index} justify="space-between" mb="20px">
                    <Flex align="center">
                      <Box
                        w="15px"
                        h="15px"
                        bg={
                          index === 0
                            ? "blue.500"
                            : index === 1
                            ? "green.500"
                            : index === 2
                            ? "orange.500"
                            : index === 3
                            ? "purple.500"
                            : "red.500"
                        }
                        borderRadius="50%"
                        me="12px"
                      />
                      <Text fontSize="md" color={textColor} fontWeight="bold">
                        {category}
                      </Text>
                    </Flex>
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                      ${amount.toFixed(2)}
                    </Text>
                  </Flex>
                ))}
            </Flex>
          </CardBody>
        </Card>
      </div>
    </Box>
  );
}

// Helper component for spacing
const Spacer = () => <Box flex="1" />;