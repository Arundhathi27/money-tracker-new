# How to Use Custom Date Range Feature

## Step-by-Step Guide

### Step 1: Navigate to Report Dashboard
- Open the application
- Click on "Report Dashboard" in the sidebar

### Step 2: Select Custom Range
- Look for the dropdown that shows "Daily", "Weekly", "Monthly"
- Click on it and select **"Custom Range"**
- A modal will automatically open

### Step 3: Select Date Range
In the modal:
1. **From Date**: Click the first date input and select your start date (e.g., 10/07/2025)
2. **To Date**: Click the second date input and select your end date (e.g., 05/10/2025)
3. Click the **"Apply"** button

### Step 4: View Your Report
The dashboard will now show:
- **Total Income** for the selected period
- **Total Expenses** for the selected period
- **Net Balance** (Income - Expenses)
- **Percentage changes** compared to the previous period of same duration
- **Income vs Expenses Chart** with daily data points

### Step 5: Export to PDF (Optional)
Click the **"Export PDF"** dropdown button and choose:
- **Detailed Table Report** - Downloads a PDF with all transactions in table format
- **Standard Report** - Downloads a visual report with charts
- **Categories Report** - Downloads a category breakdown report

## Features

### ✅ Date Validation
- Both dates are required
- From date must be before to date
- Cannot select future dates
- Helpful error messages if validation fails

### ✅ Flexible Date Range
- Select any date range from past to present
- Can be 1 day, 1 week, 1 month, or any custom duration
- Examples:
  - 1 day: 05/10/2025 to 05/10/2025
  - 1 week: 29/09/2025 to 05/10/2025
  - 1 month: 05/09/2025 to 05/10/2025
  - Custom: 10/07/2025 to 05/10/2025 (87 days)

### ✅ Edit Date Range
- Click on the date range text to reopen the modal
- Modify your dates and click "Apply" again
- Report updates automatically

### ✅ Navigation
- Previous/Next arrows are disabled in custom mode
- Use the modal to change dates instead

### ✅ Comparison with Previous Period
- System automatically calculates the previous period
- Shows percentage change for income, expenses, and net balance
- Previous period = same duration before your selected from date

## Example Scenarios

### Scenario 1: Quarterly Report (Q3 2025)
- From Date: 01/07/2025
- To Date: 30/09/2025
- Result: Shows all transactions for July, August, September 2025

### Scenario 2: Vacation Period
- From Date: 15/08/2025
- To Date: 30/08/2025
- Result: Shows expenses during your vacation

### Scenario 3: Year-to-Date
- From Date: 01/01/2025
- To Date: 05/10/2025
- Result: Shows all transactions from start of year to today

### Scenario 4: Compare Two Months
- From Date: 01/08/2025
- To Date: 30/09/2025
- Result: Shows combined data for August and September

## Tips

1. **Quick Access**: The date range text is clickable - click it to change dates
2. **Cancel Anytime**: Click "Cancel" or the X button to close the modal without applying
3. **Switch Views**: You can switch back to Daily/Weekly/Monthly anytime from the dropdown
4. **Export Multiple Formats**: Try all three PDF export options to see which suits your needs
5. **Mobile Friendly**: The modal works great on mobile devices too

## Troubleshooting

### Modal doesn't open
- Make sure "Custom Range" is selected in the dropdown
- Try clicking on the date range text

### "Invalid Date Range" error
- Check that both dates are selected
- Ensure From Date is before To Date
- Make sure you're not selecting future dates

### No data shown
- Verify you have transactions in the selected date range
- Try a different date range
- Check if transactions are loaded (refresh the page)

### PDF export not working
- Make sure the report has loaded completely
- Check that you have transactions in the selected period
- Try a different export format

## Support

If you encounter any issues:
1. Refresh the page and try again
2. Check browser console for errors (F12)
3. Verify your internet connection
4. Contact support with screenshots
