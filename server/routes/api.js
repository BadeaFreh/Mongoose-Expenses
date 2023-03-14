
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const moment = require('moment')
router.use(bodyParser.urlencoded({extended: true}))
const Expense = require('../../models/Expense')

router.get('/expenses', async (req, res) => {
    try {
        let d1 = req.query.d1
        let d2 = req.query.d2
        if (!d1 && !d2) {
            const expenses = await Expense.find({}).sort({date: -1})
            res.send(expenses)
        }
        d1 = moment(d1, 'YYYY-MM-DD').isValid() ? moment(d1, 'YYYY-MM-DD') : moment(new Date(), 'YYYY-MM-DD')
        d2 = moment(d2, 'YYYY-MM-DD').isValid() ? moment(d2, 'YYYY-MM-DD') : moment(new Date(), 'YYYY-MM-DD')

        const expenses = await Expense.aggregate([
            {$match: 
                {$and: [
                    {date: {$gt: new Date(d1)}},
                    {date: {$lt: new Date(d2)}}
            ]}}
        ]).sort({date: -1})
        res.send(expenses)
    }
    catch (err) {
        res.send(err)
    }
})

router.get('/expenses/:group', async (req, res) => {
    try {
        const filterGroup = req.params.group
        const total = JSON.parse(req.query.total)
        if (total) {
            const [filteredGroupExpenses] = await Expense.aggregate([
                {$match: {group: filterGroup}},
                {$group:
                    {
                        _id: "total amount",
                        total: { $sum: "$amount" }
                    }
                }
            ])
            res.send(`Total amount for group "${filterGroup}": ${filteredGroupExpenses.total}`)
        } else {
            const groupExpenses = await Expense.find({group: filterGroup})
            res.send(groupExpenses)
        }
    }
    catch (err) {
        res.send(err)
    }
})

router.post('/expense', (req, res) => {
    const date = req.body.date
    const expense = new Expense({
        item: req.body.item,
        amount: req.body.amount,
        group: req.body.group,
        date: moment(date, "YYYY-MM-DD").isValid() ? moment(date, 'LLLL') : moment(new Date(), 'LLLL')
    })
    try {
        expense.save()
            .then((res) => console.log(res.amount))
        res.send("Document has been saved")
    } catch (error) {
        res.send(error)
    }
})

router.put('/update', async (req, res) => {
    const groupFilter = req.query.groupFilter
    const groupUpdate = req.query.groupUpdate
    try {
    const updatedDocument = await Expense.findOneAndUpdate(
        {group: groupFilter},
        {group: groupUpdate},
        {new: true}
    )
    res.send(`Expense ${updatedDocument.item} was updated successfully`)
    } catch (err) {
        res.send(err)
    }
})

module.exports = router