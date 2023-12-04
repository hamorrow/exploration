//This is so that the user can utilize input and output. Imports the readline module.
const readline = require('readline');

//This creates an interface for reading the user's input from the console.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//This stores all of the financial information, from numbers to categories.
let financeData = {
    income: [],
    expenses: [],
    categories: {},
    budget: {},
    bills: {
        rent: 0,
        water: 0,
        electricity: 0,
    },
    savings: 0 
};

//This function adds to the income section and uses amount and category as parameters.
function addIncome(amount, category) {
    financeData.income.push({ amount, category });
    addToCategory(category, amount);
}

//This function adds to the expense section and also uses amount and category as parameters.
function addExpense(amount, category) {
    financeData.expenses.push({ amount, category });
    addToCategory(category, -amount); 
    checkBudget(category, amount); 
}

//This function is what puts the amounts into the correct categories.
function addToCategory(category, amount) {
    if (!financeData.categories[category]) {
        financeData.categories[category] = 0;
    }
    financeData.categories[category] += amount;
}

//When budget is inputted this function is called and it sets the budget depending on categories, amount and category are parameters.
function setBudget(category, amount) {
    financeData.budget[category] = amount;
}

//Thos checks if expenses exceed the budget
function checkBudget(category, amount) {
    if (financeData.budget[category] !== undefined) {
        const totalExpenseForCategory = financeData.categories[category] * -1;
        if (totalExpenseForCategory > financeData.budget[category]) {
            console.log(`Warning: Expenses for ${category} exceed the budget by $${(totalExpenseForCategory - financeData.budget[category]).toFixed(2)}!`);
        }
    }
}

//This calculates the total for income or expenses
function calculateTotal(type) {
    return financeData[type].reduce((total, entry) => total + entry.amount, 0);
}

//This calculates the balance
function calculateBalance() {
    return calculateTotal('income') - calculateTotal('expenses');
}

//This is what displays the financial summary when the user inputs summary.
function displaySummary() {
    console.log("\nFinancial Summary:");
    console.log("Total Income: $" + calculateTotal('income').toFixed(2));
    console.log("Total Expenses: $" + calculateTotal('expenses').toFixed(2));
    console.log("Balance: $" + calculateBalance().toFixed(2));
    console.log("Expenses by Category:");
    for (let category in financeData.categories) {
        if (financeData.budget[category] !== undefined) {
            const budget = financeData.budget[category];
            const actual = financeData.categories[category] * -1; // Convert to positive number
            const difference = budget - actual;
            const status = difference >= 0 ? 'Under' : 'Over';
            console.log(`  ${category}: Budget: $${budget.toFixed(2)}, Actual: $${actual.toFixed(2)}, ${status} Budget by $${Math.abs(difference).toFixed(2)}`);
        }
    }
}

//This records the buget in their categories
function recordBudget() {
    rl.question('Enter category: ', (category) => {
        rl.question('Enter budget amount: ', (amount) => {
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                console.log('Invalid amount. Please enter a number.');
                recordBudget();
                return;
            }

            setBudget(category, amount);
            main(); 
        });
    });
}

//This records any transaction made by the user
function recordTransaction(type) {
    rl.question('Enter amount: ', (amount) => {
        rl.question('Enter category: ', (category) => {
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                console.log('Invalid amount. Please enter a number.');
                recordTransaction(type);
                return;
            }

            if (type === 'income') {
                addIncome(amount, category);
            } else if (type === 'expense') {
                addExpense(amount, category);
            } else {
                console.log('Invalid type. Please enter "income" or "expense".');
                main();
                return;
            }

            console.log(`${type} recorded: $${amount} in ${category}`);
            main(); // Loop back to main menu
        });
    });
}
//This makes a bill an expense and therefore subtracts it from the total
function addBill(billType, amount) {
    if (!financeData.bills[billType]) {
        console.log(`Invalid bill type: ${billType}.`);
        return;
    }

    financeData.bills[billType] = amount;
    addExpense(amount, billType); 
}
//This transfers the money that the user did not spend to savings
function transferToSavings() {
    const totalIncome = calculateTotal('income');
    const totalExpenses = calculateTotal('expenses');
    const surplus = totalIncome - totalExpenses;

    if (surplus > 0) {
        financeData.savings += surplus;
        console.log(`Transferred $${surplus.toFixed(2)} to savings. Total savings: $${financeData.savings.toFixed(2)}.`);
    } else {
        console.log("No surplus available to transfer to savings.");
    }
}
//This is a main function that determines which function to run depending on the user's input.
function main() {
    rl.question('\nEnter "income", "expense", "budget", "bill", "save", "summary", or "exit": ', (answer) => {
        switch(answer) {
            case 'income':
                recordTransaction('income');
                break;
            case 'expense':
                recordTransaction('expense');
                break;
            case 'budget':
                recordBudget();
                break;
            case 'bill':
                manageBills();
                break;
            case 'save':
                transferToSavings();
                break;
            case 'summary':
                displaySummary();
                break;
            case 'exit':
                exitProgram();
                break;
            default:
                console.log('Invalid input, please try again.');
                main();
                break;
        }
    });
}


//This manages bills that are already defined, also includes error handling.
function manageBills() {
    console.log("Available bills: rent, water, electricity");
    rl.question('Enter bill type: ', (billType) => {
        if (Object.keys(financeData.bills).includes(billType)) {
            rl.question(`Enter amount for ${billType}: `, (amount) => {
                amount = parseFloat(amount);
                if (isNaN(amount)) {
                    console.log('Invalid amount. Please enter a number.');
                    manageBills();
                    return;
                }
                addBill(billType, amount);
                main(); 
            });
        } else {
            console.log(`Invalid bill type: ${billType}. Please try again.`);
            manageBills();
        }
    });
}
//This exits the program
function exitProgram() {
    console.log("Exiting the program. Have a nice day!");
    rl.close();
}

//Starts the program up
main(); 