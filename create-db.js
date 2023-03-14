
const NUM_OF_EXPENSES = 50
let mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const jsonData = require('./raw-data/expenses.json')

mongoose.connect("mongodb://localhost:27017/ExpensesDB", {useNewUrlParser: true})
const Expense = require('./models/Expense')

function createExpensesDB(jsonData){
    const keys = Object.keys(jsonData)
    keys.slice(0, NUM_OF_EXPENSES).forEach(function(key){
        const expense = new Expense ({
            item: jsonData[key].item,
            amount: jsonData[key].amount,
            date: jsonData[key].date,
            group: jsonData[key].group,
        })
        expense.save()
    })
    console.log("50 expenses were saved to db")
}

createExpensesDB(jsonData)