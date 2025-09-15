const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authenticateToken, (req, res) => {
  try {
    // Demo dashboard statistics
    const dashboardStats = {
      todaysMoney: {
        amount: 53897,
        percentage: 3.48,
        trend: 'up'
      },
      todaysUsers: {
        amount: 3200,
        percentage: 5.2,
        trend: 'up'
      },
      newClients: {
        amount: 2503,
        percentage: -2.82,
        trend: 'down'
      },
      totalSales: {
        amount: 173000,
        percentage: 8.12,
        trend: 'up'
      }
    };

    res.json({
      status: 'success',
      data: {
        stats: dashboardStats
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/charts/sales
// @desc    Get sales chart data
// @access  Private
router.get('/charts/sales', authenticateToken, (req, res) => {
  try {
    const salesChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          name: 'Sales',
          data: [50, 40, 300, 220, 500, 250, 400, 230, 500, 200, 300, 400],
          color: '#4FD1C7'
        }
      ]
    };

    res.json({
      status: 'success',
      data: {
        chartData: salesChartData
      }
    });

  } catch (error) {
    console.error('Get sales chart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching sales chart data'
    });
  }
});

// @route   GET /api/dashboard/charts/performance
// @desc    Get performance chart data
// @access  Private
router.get('/charts/performance', authenticateToken, (req, res) => {
  try {
    const performanceChartData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          name: 'Orders',
          data: [400, 370, 330, 390],
          color: '#4299E1'
        }
      ]
    };

    res.json({
      status: 'success',
      data: {
        chartData: performanceChartData
      }
    });

  } catch (error) {
    console.error('Get performance chart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching performance chart data'
    });
  }
});

// @route   GET /api/dashboard/page-visits
// @desc    Get page visits data
// @access  Private
router.get('/page-visits', authenticateToken, (req, res) => {
  try {
    const pageVisits = [
      {
        pageName: '/argon/',
        visitors: '4,569',
        uniqueUsers: 340,
        bounceRate: '46,53%'
      },
      {
        pageName: '/argon/index.html',
        visitors: '3,985',
        uniqueUsers: 319,
        bounceRate: '46,53%'
      },
      {
        pageName: '/argon/charts.html',
        visitors: '3,513',
        uniqueUsers: 294,
        bounceRate: '36,49%'
      },
      {
        pageName: '/argon/tables.html',
        visitors: '2,050',
        uniqueUsers: 147,
        bounceRate: '50,87%'
      },
      {
        pageName: '/argon/profile.html',
        visitors: '1,795',
        uniqueUsers: 190,
        bounceRate: '46,53%'
      }
    ];

    res.json({
      status: 'success',
      data: {
        pageVisits
      }
    });

  } catch (error) {
    console.error('Get page visits error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching page visits data'
    });
  }
});

// @route   GET /api/dashboard/social-traffic
// @desc    Get social traffic data
// @access  Private
router.get('/social-traffic', authenticateToken, (req, res) => {
  try {
    const socialTraffic = [
      {
        referral: 'Facebook',
        visitors: '1,480',
        percentage: 60,
        color: 'orange'
      },
      {
        referral: 'Facebook',
        visitors: '5,480',
        percentage: 70,
        color: 'orange'
      },
      {
        referral: 'Google',
        visitors: '4,807',
        percentage: 80,
        color: 'cyan'
      },
      {
        referral: 'Instagram',
        visitors: '3,678',
        percentage: 75,
        color: 'cyan'
      },
      {
        referral: 'Twitter',
        visitors: '2,645',
        percentage: 30,
        color: 'orange'
      }
    ];

    res.json({
      status: 'success',
      data: {
        socialTraffic
      }
    });

  } catch (error) {
    console.error('Get social traffic error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching social traffic data'
    });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity data
// @access  Private
router.get('/recent-activity', authenticateToken, (req, res) => {
  try {
    const recentActivity = [
      {
        id: '1',
        type: 'transaction',
        title: '$2400, Design changes',
        date: '22 DEC 7:20 PM',
        icon: 'bell',
        color: 'teal.300'
      },
      {
        id: '2',
        type: 'order',
        title: 'New order #4219423',
        date: '21 DEC 11:21 PM',
        icon: 'html5',
        color: 'orange'
      },
      {
        id: '3',
        type: 'payment',
        title: 'Server Payments for April',
        date: '21 DEC 9:28 PM',
        icon: 'cart',
        color: 'blue.400'
      },
      {
        id: '4',
        type: 'card',
        title: 'New card added for order #3210145',
        date: '20 DEC 3:52 PM',
        icon: 'credit-card',
        color: 'orange.300'
      },
      {
        id: '5',
        type: 'package',
        title: 'Unlock packages for Development',
        date: '19 DEC 11:35 PM',
        icon: 'dropbox',
        color: 'purple'
      }
    ];

    res.json({
      status: 'success',
      data: {
        activities: recentActivity
      }
    });

  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching recent activity data'
    });
  }
});

// @route   GET /api/dashboard/overview
// @desc    Get complete dashboard overview
// @access  Private
router.get('/overview', authenticateToken, (req, res) => {
  try {
    const overview = {
      stats: {
        todaysMoney: {
          amount: 53897,
          percentage: 3.48,
          trend: 'up'
        },
        todaysUsers: {
          amount: 3200,
          percentage: 5.2,
          trend: 'up'
        },
        newClients: {
          amount: 2503,
          percentage: -2.82,
          trend: 'down'
        },
        totalSales: {
          amount: 173000,
          percentage: 8.12,
          trend: 'up'
        }
      },
      quickStats: {
        totalTransactions: 156,
        totalInvoices: 23,
        pendingPayments: 8,
        activeProjects: 12
      },
      recentTransactions: [
        {
          id: '1',
          name: 'Netflix',
          amount: -25.00,
          date: '2024-03-27',
          status: 'completed'
        },
        {
          id: '2',
          name: 'Apple Store',
          amount: 99.99,
          date: '2024-03-26',
          status: 'completed'
        },
        {
          id: '3',
          name: 'Stripe Payment',
          amount: 1250.00,
          date: '2024-03-25',
          status: 'completed'
        }
      ]
    };

    res.json({
      status: 'success',
      data: {
        overview
      }
    });

  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard overview'
    });
  }
});

module.exports = router;
