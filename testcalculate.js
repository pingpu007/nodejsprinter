const express = require('express')
const app = express()
const escpos = require('escpos');
escpos.USB = require('escpos-usb');


const bodyParser = require('body-parser')

const device  = new escpos.USB();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const options = { encoding: "GB18030" /* default */ }
const printer = new escpos.Printer(device, options);

console.log("TEST >>>>")
const books = require('./db')
/*console.log(books)*/
app.get('/books', (req, res) => {
  res.json(books)
})

app.post('/books', (req, res) => {
  books.push(req.body)
  var data = req.body;
//  console.log(data);
  var dataID = data["id"];
  var dataName =  data["name"];
  var dataInv = data["invoice"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataG = data["gtotal"];
  var dataEcID = data["econtID"];
  var dataDate = data["date"];
  var dataTime = data["time"];
  var datamen = data["menu"];
  var datamentotal = data["menutotal"]
  var datamencost = data["menucost"]


console.log(
  datamencost[1]+datamencost[5]
)

console.log(
  datamencost.reduce((a, b) => a + b, 0)
)

})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)