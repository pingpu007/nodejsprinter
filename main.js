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
  console.log(data);

  var dataName =  data["name"];
  var dataInv = data["invoice"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataG = data["gtotal"];
  var dataEcID = data["econtID"];
  var dataDate = data["date"];
  var dataTime = data["time"];

/*  console.log("data", data["name"])
  console.log("dataName",data["invoice"])*/

  device.open(function(error){
    printer
      .font('a')
      .align('ct')
      .style('b')
      .size(0.5, 0.55)
      .text('Play-G-LAO')
      .feed()
      .style('normal')
      .size(0.01, 0.015)
      .text('70/12')
      .text('Tel : 0659983229')
      .feed()
      .style('b')
      .size(0.5, 0.55)
      .text('Bill')
      .style('normal')
      .size(0.01, 0.05)
      .text('Order by Line: @playglao')
      .text('--------------------------------------------')
      .align('lt')
      .text('  '+ 'INV.NO: '+ dataInv+ '  ')
      .text('  '+'Table : '+ dataTstatus+ '  ')
      .text('  '+'Staff : '+ dataSname+ '  ')
      .text('  '+'Guest :  '+ dataG+'                       '+ 'ID : '+ dataEcID+ '  ')
      .text('  '+'Date : '+ dataDate+'                  '+ 'Time: '+ dataTime+ '  ')
      .align('ct')
      .text('--------------------------------------------')

      .feed()
      .cut()
    .close()
  });

  res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)