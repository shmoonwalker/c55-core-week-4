// Import all the functions I need from my finance tracker
import {
  printAllTransactions,
  printSummary,
  addTransaction,
  getTransactionsByCategory,
  getLargestExpense,
  searchByDateRange,
  groupTransactionsByMonth,
  averageExpensePerCategory,
  removeTransactionById,
  findConsecutiveExpensiveMonths,
  getBalance,
  getTotalIncome,
  getTotalExpenses,
} from './finance.js';
import { transactions } from './data.js';
import { styles } from './style.js';
import { createInterface } from 'readline';

// Show a nice header at the top
function displayHeader() {
  console.log(styles.bold('\n╔════════════════════════════════════════╗'));
  console.log(styles.bold('║   💰 PERSONAL FINANCE TRACKER 💰      ║'));
  console.log(styles.bold('╚════════════════════════════════════════╝\n'));
}

// Display menu options so I know what each number does
function displayMenu() {
  console.log(styles.bold('\n📋 CHOOSE AN OPTION:\n'));
  console.log('1.  📊 View All Transactions');
  console.log('2.  📈 View Summary Report');
  console.log('3.  ➕ Add New Transaction');
  console.log('4.  🗑️ Remove Transaction by ID');
  console.log('5.  💰 Quick Balance Check');
  console.log('6.  🔍 Search by Category');
  console.log('7.  📅 Search by Date Range');
  console.log('8.  📆 View by Month');
  console.log('9.  💸 View Largest Expense');
  console.log('10. 📊 Average Expense per Category');
  console.log('11. 📈 Consecutive Expensive Months\n');
}

// Example 1: Just show me everything
function example1() {
  displayHeader();
  console.log(styles.bold('📊 ALL TRANSACTIONS\n'));
  printAllTransactions();
}

// Example 2: Full summary with all the stats
function example2() {
  displayHeader();
  printSummary();
}

// Example 3: Add a new transaction
function example3() {
  displayHeader();
  console.log(styles.bold('➕ ADD NEW TRANSACTION\n'));

  const newTransaction = {
    id: 100,
    type: 'expense',
    category: 'test',
    amount: 50,
    description: 'Test transaction',
    date: '2025-01-01'
  };

  addTransaction(newTransaction);
  console.log(styles.income('✅ Transaction added successfully!'));
  console.log('New transaction:', newTransaction);
  console.log('\nUpdated transactions:');
  printAllTransactions();
}

// Example 4: Remove a transaction by ID
function example4() {
  displayHeader();
  console.log(styles.bold('🗑️ REMOVE TRANSACTION BY ID\n'));

  const idToRemove = 1;
  const removed = removeTransactionById(idToRemove);

  if (removed) {
    console.log(styles.income(`✅ Transaction with ID ${idToRemove} removed successfully!`));
  } else {
    console.log(styles.expense(`❌ No transaction found with ID ${idToRemove}`));
  }

  console.log('\nUpdated transactions:');
  printAllTransactions();
}

// Example 5: Quick check to see if I'm broke or not
function example5() {
  displayHeader();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance = getBalance();

  console.log(styles.bold('💰 QUICK BALANCE CHECK\n'));
  console.log(styles.income(`Total Income:    €${income.toFixed(2)}`));
  console.log(styles.expense(`Total Expenses:  €${expenses.toFixed(2)}`));
  console.log('─────────────────────────────');

  // Show balance in green if positive, red if negative
  const balanceText =
    balance >= 0
      ? styles.balancePositive(`€${balance.toFixed(2)}`)
      : styles.balanceNegative(`€${balance.toFixed(2)}`);
  console.log(styles.bold(`Current Balance: ${balanceText}\n`));
}

// Example 6: Find all transactions for a specific category
// Change 'groceries' below to search different categories
function example6() {
  displayHeader();
  console.log(styles.bold('🔍 SEARCH BY CATEGORY\n'));

  const category = 'groceries'; // Try: 'rent', 'salary', 'entertainment', etc.
  
  const results = getTransactionsByCategory(category);

  if (results.length === 0) {
    console.log(styles.expense(`❌ No transactions found for category: ${category}`));
    return;
  }

  console.log(styles.income(`✅ Found ${results.length} transaction(s) for "${category}":\n`));
  results.forEach((t) => {
    const amount =
      t.type === 'income'
        ? styles.income(`€${t.amount}`)
        : styles.expense(`€${t.amount}`);
    console.log(
      `  ${t.id}. [${t.type.toUpperCase()}] ${t.category} - ${amount} (${t.description || '-'}) - ${t.date}`
    );
  });
}

// Example 7: Search between two dates
// Useful for checking spending in a specific month
function example7() {
  displayHeader();
  console.log(styles.bold('📅 SEARCH BY DATE RANGE\n'));

  const startDate = '2025-01-01';
  const endDate = '2025-01-31';

  const results = searchByDateRange(startDate, endDate);

  if (results.length === 0) {
    console.log(styles.expense('\n❌ No transactions found in this date range'));
    return;
  }

  console.log(styles.income(`✅ Found ${results.length} transaction(s) from ${startDate} to ${endDate}:\n`));
  results.forEach((t) => {
    const amount =
      t.type === 'income'
        ? styles.income(`€${t.amount}`)
        : styles.expense(`€${t.amount}`);
    console.log(
      `  ${t.date}: [${t.type.toUpperCase()}] ${t.category} - ${amount} (${t.description || '-'})`
    );
  });
}

// Example 8: See everything organized by month
// Good for comparing different months
function example8() {
  displayHeader();
  console.log(styles.bold('📆 TRANSACTIONS BY MONTH\n'));

  const grouped = groupTransactionsByMonth(transactions);
  const months = Object.keys(grouped).sort();

  if (months.length === 0) {
    console.log(styles.expense('❌ No transactions found'));
    return;
  }

  // Loop through each month and show all transactions
  months.forEach((month) => {
    const monthTransactions = grouped[month];
    // Calculate if the month was good or bad (income - expenses)
    const total = monthTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

    const totalText =
      total >= 0 
        ? styles.income(`+€${total.toFixed(2)}`) 
        : styles.expense(`-€${Math.abs(total).toFixed(2)}`);

    console.log(styles.bold(`\n${month} (${monthTransactions.length} transactions) - Net: ${totalText}`));
    monthTransactions.forEach((t) => {
      const amount =
        t.type === 'income'
          ? styles.income(`€${t.amount}`)
          : styles.expense(`€${t.amount}`);
      console.log(
        `  ${t.date}: [${t.type.toUpperCase()}] ${t.category} - ${amount} (${t.description || '-'})`
      );
    });
  });
}

// Example 9: What was my biggest expense?
function example9() {
  displayHeader();
  console.log(styles.bold('💸 LARGEST EXPENSE\n'));

  const largest = getLargestExpense();
  if (!largest) {
    console.log(styles.expense('❌ No expenses found'));
    return;
  }

  console.log(
    styles.expense(
      `💸 €${largest.amount} - ${largest.category} (${largest.description || '-'}) on ${largest.date}`
    )
  );
}

// Example 10: Average spending per category
// Helps me see where most of my money goes
function example10() {
  displayHeader();
  console.log(styles.bold('📊 AVERAGE EXPENSE PER CATEGORY\n'));

  const averages = averageExpensePerCategory();
  const categories = Object.keys(averages);

  if (categories.length === 0) {
    console.log(styles.expense('❌ No expenses found'));
    return;
  }

  categories.forEach((category) => {
    console.log(`  ${category}: ${styles.expense(`€${averages[category].toFixed(2)}`)}`);
  });
}

// Example 11: Find months where I spent more and more each month
// This helps spot bad spending habits
function example11() {
  displayHeader();
  console.log(styles.bold('📈 CONSECUTIVE EXPENSIVE MONTHS\n'));

  const streaks = findConsecutiveExpensiveMonths();

  if (streaks.length === 0) {
    console.log(styles.income('✅ No consecutive expensive months found'));
    return;
  }

  streaks.forEach((streak, index) => {
    console.log(styles.expense(`  Streak ${index + 1}: ${streak.join(' → ')}`));
  });
}

// MAIN PROGRAM
displayMenu();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the number of the option you want to run (1-11): ', (input) => {
  const exampleToRun = parseInt(input);

  if (isNaN(exampleToRun) || exampleToRun < 1 || exampleToRun > 11) {
    console.log(styles.expense('❌ Invalid input! Please enter a number between 1 and 11.'));
    rl.close();
    return;
  }

  console.log(styles.bold(`\n▶️  Running Example ${exampleToRun}...\n`));

  // Switch to run the selected example
  switch (exampleToRun) {
    case 1:
      example1();
      break;
    case 2:
      example2();
      break;
    case 3:
      example3();
      break;
    case 4:
      example4();
      break;
    case 5:
      example5();
      break;
    case 6:
      example6();
      break;
    case 7:
      example7();
      break;
    case 8:
      example8();
      break;
    case 9:
      example9();
      break;
    case 10:
      example10();
      break;
    case 11:
      example11();
      break;
    default:
      console.log(styles.expense('❌ Invalid example number!'));
  }

  rl.close();
});