const express = require('express')
const app = express()
const escpos = require('escpos');
const iconv  = require('iconv').Iconv;
escpos.USB = require('escpos-usb');
const path = require('path');

const bodyParser = require('body-parser')

const device  = new escpos.USB();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//const options = { encoding: "GB18030" /* default */ }
const printer = new escpos.Printer(device/*, options*/);
//const imagg = path.join(__dirname, '1612412821466.png');

console.log("TEST >>>>")
const books = require('./db')
/*console.log(books)*/
app.get('/bills', (req, res) => {
  res.json(books)
})

app.post('/test', (req, res) => {
  var data = req.body;
  var datashopname = data["shopname"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataDate = data["date"];
  var dataTime = data["time"];
  var datamenu = data["menu"];
  var datamenutotal = data["menutotal"]


/*  escpos.Image.load(imagg, function(image){

  device.open(function(){

    printer.align('ct')
           .image(image, 's8')
           .then(() => { 
              printer.cut().close(); 
           });

    // OR non-async .raster(image, "mode") : printer.text("text").raster(image).cut().close();

  });
});*/
device.open(function(error){
  printer
    /*.encode('tis-620')
    .font('a')
    .align('ct')
    .size(0.5, 0.55)
    .text(dataSname)
    .text(dataDate+ " "+ dataTime)
    .text(dataTstatus)
    .feed()
    .font('a')
    .size(0.5,0.55)
    .text(dataSname)
    .text(dataDate+ " "+ dataTime)
    .text(dataTstatus)
    .feed()
    .style('b')
    .font('a')
    .size(0.55,0.4)
    .text(dataSname)
    .text(dataDate+ " "+ dataTime)
    .text(dataTstatus)*/
    .feed()
    .cut()
    //.feed()
    .close()
  });

  res.status(201).json(req.body)
})


app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)