
const bodyParser = require('body-parser')
const express = require('express')
let app = express()
const api = require('./server/routes/api')
app.use('/', api)

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect("mongodb://localhost:27017/ExpensesDB", {useNewUrlParser: true})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})
