import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { budgetsAPI } from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch budget alerts and convert them to notifications
  const fetchBudgetAlerts = useCallback(async () => {
    try {
      const response = await budgetsAPI.getAlerts();
      if (response.status === 'success') {
        const budgetNotifications = response.data.alerts.map(alert => ({
          id: `budget-${alert.budgetId}`,
          type: 'budget_alert',
          title: alert.alertType === 'exceeded' ? 'Budget Exceeded!' : 'Budget Warning',
          message: alert.alertType === 'exceeded'
            ? `You have exceeded your ${alert.category} budget! Spent ₹${alert.spentAmount} of ₹${alert.limitAmount}.`
            : `You have spent ${alert.percentageUsed.toFixed(1)}% of your ${alert.category} budget (₹${alert.spentAmount} of ₹${alert.limitAmount}).`,
          category: alert.category,
          alertType: alert.alertType,
          spentAmount: alert.spentAmount,
          limitAmount: alert.limitAmount,
          percentageUsed: alert.percentageUsed,
          period: alert.period,
          timestamp: new Date(),
          isRead: false,
          priority: alert.alertType === 'exceeded' ? 'high' : 'medium'
        }));
        
        return budgetNotifications;
      }
      return [];
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
      throw error;
    }
  }, []);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, we only have budget alerts, but this can be extended
      const budgetNotifications = await fetchBudgetAlerts();
      
      // Combine all notification types here
      const allNotifications = [
        ...budgetNotifications
        // Add other notification types here in the future
      ];

      // Sort by priority and timestamp
      allNotifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBudgetAlerts]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Auto-fetch notifications on mount and set up periodic refresh
  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    refreshNotifications: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
