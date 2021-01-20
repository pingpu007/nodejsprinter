const express = require('express')
const app = express()


const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

console.log("TEST >>>>")
const books = require('./db')

app.get('/books', (req, res) => {
  res.json(books)

})



app.post('/books', (req, res) => {
  books.push(req.body)
  res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})

app.listen(5000)