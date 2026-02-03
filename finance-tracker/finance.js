import { transactions } from './data.js';
import { styles } from './style.js';

// Add new transaction using spread operator
export function addTransaction(transaction) {
  transactions.push({ ...transaction });
}

// Calculate total income using a loop
export function getTotalIncome() {
  let total = 0;
  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      total += transaction.amount;
    }
  }
  return total;
}

// Calculate total expenses using a loop
export function getTotalExpenses() {
  let total = 0;
  for (const transaction of transactions) {
    if (transaction.type === 'expense') {
      total += transaction.amount;
    }
  }
  return total;
}

export function getBalance() {
  return getTotalIncome() - getTotalExpenses();
}

// Filter transactions by category using loop and demonstrating object destructuring
export function getTransactionsByCategory(category) {
  const result = [];
  for (const { id, type, category: cat, amount, description, date } of transactions) {
    if (cat === category) {
      result.push({ id, type, category: cat, amount, description, date });
    }
  }
  return result;
}

// Find the largest expense using a for loop
export function getLargestExpense() {
  let largest = null;
  for (const t of transactions) {
    if (t.type === 'expense' && (!largest || t.amount > largest.amount)) {
      largest = t;
    }
  }
  return largest;
}

// Bonus: Search transactions by date range using slice
export function searchByDateRange(startDate, endDate) {
  const sorted = [...transactions].sort((a, b) => (a.date > b.date ? 1 : -1));

  const startIndex = sorted.findIndex((t) => t.date >= startDate);
  const endIndex = sorted.findIndex((t) => t.date > endDate);

  return sorted.slice(startIndex, endIndex === -1 ? sorted.length : endIndex);
}

// Bonus: Group transactions by month using nested objects
export function groupTransactionsByMonth(transactions) {
  const grouped = {};

  for (const t of transactions) {
    const month = t.date.slice(0, 7);
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(t);
  }

  return grouped;
}

// Bonus: Calculate average expense per category
export function averageExpensePerCategory() {
  const categoryTotals = {};
  const categoryCounts = {};

  for (const t of transactions) {
    if (t.type === 'expense') {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
        categoryCounts[t.category] = 0;
      }
      categoryTotals[t.category] += t.amount;
      categoryCounts[t.category] += 1;
    }
  }

  const averages = {};
  for (const category in categoryTotals) {
    averages[category] = categoryTotals[category] / categoryCounts[category];
  }

  return averages;
}

// Bonus: Remove transaction by ID
export function removeTransactionById(id) {
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
    return true; 
  } else {
    return false; 
  }
}

// Helper function for consecutive expensive months
function getTotalExpensesByMonth(month) {
  const grouped = groupTransactionsByMonth(transactions);
  const monthTransactions = grouped[month] || [];
  return monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Finds consecutive months where expenses increase month-over-month.
 * This function uses a while loop to iterate through sorted months and identifies
 * streaks where each month has higher expenses than the previous month.
 * 
 * Algorithm:
 * 1. Get all months from transactions and sort them chronologically
 * 2. Use outer while loop to iterate through months
 * 3. For each month, use inner while loop to find consecutive increasing expenses
 * 4. Track streaks of 2+ months and add to results
 * 5. Skip ahead to next non-consecutive month
 * 
 * @returns {Array<Array<string>>} Array of streaks, where each streak is an array of month strings
 */
export function findConsecutiveExpensiveMonths() {
  const months = Object.keys(groupTransactionsByMonth(transactions)).sort();
  const result = [];
  let i = 0;

  while (i < months.length) {
    const streak = [months[i]];
    let prevTotal = getTotalExpensesByMonth(months[i]);

    let j = i + 1;
    while (j < months.length) {
      const currTotal = getTotalExpensesByMonth(months[j]);
      if (currTotal > prevTotal) {
        streak.push(months[j]);
        prevTotal = currTotal;
        j++;
      } else {
        break;
      }
    }

    if (streak.length > 1) result.push(streak);
    i = j;
  }

  return result;
}


// Display all transactions with color formatting
export function printAllTransactions() {
  transactions.forEach((t, index) => {
    const values = Object.values(t);

    const typeLabel = `[${values[1].toUpperCase()}]`;
    const category = styles.category(values[2]); // Yellow color for category

    const amount =
      values[1] === 'income'
        ? styles.income(`€${values[3]}`)  // Green for income
        : styles.expense(`€${values[3]}`); // Red for expense

    console.log(
      `${index + 1}. ${typeLabel} ${category} - ${amount} (${values[4] || '-'})`
    );
  });
}

// Print comprehensive summary report with all required information
export function printSummary() {
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const numTransactions = transactions.length;
  const largestExpenseTransaction = getLargestExpense();
  const searchDateRange = searchByDateRange('2025-01-15', '2025-01-18');
  

  console.log(styles.bold('\n--- Summary Report ---'));
  console.log(styles.bold(styles.income(`Total Income: €${totalIncome}`)));
  console.log(styles.bold(styles.expense(`Total Expenses: €${totalExpenses}`)));

  // Balance in cyan if positive, red if negative
  const balanceText =
    balance >= 0
      ? styles.balancePositive(`€${balance}`)
      : styles.balanceNegative(`€${balance}`);
  console.log(styles.bold(`Balance: ${balanceText}`));

  console.log(styles.bold(`Number of Transactions: ${numTransactions}`));

  // Display largest expense with description
  if (largestExpenseTransaction) {
    console.log(
      styles.bold(
        styles.expense(
          `Largest Expense: €${largestExpenseTransaction.amount} (${largestExpenseTransaction.description || '-'})`
        )
      )
    );
  } else {
    console.log(styles.bold(styles.expense('Largest Expense: -')));
  }
  
  // Bonus features below
  const streaks = findConsecutiveExpensiveMonths();
  if (streaks.length === 0) {
    console.log('No consecutive expensive months found.');
    return;
  }

  console.log('\n--- Consecutive Expensive Months ---');
  streaks.forEach(streak => {
    console.log(streak.join(' → '));
  });

  console.log('Transactions from 2025-01-15 to 2025-01-18:');
  searchDateRange.forEach((t) => {
    console.log(
      `- ${t.date}: ${t.type} ${t.category} €${t.amount} (${t.description})`
    );
  });

  const grouped = groupTransactionsByMonth(transactions);
  console.log(grouped);

  const averages = averageExpensePerCategory();
  console.log(styles.bold('\n--- Average Expense per Category ---'));
  for (const category in averages) {
    console.log(`${styles.category(category)}: €${averages[category].toFixed(2)}`);
  }
}