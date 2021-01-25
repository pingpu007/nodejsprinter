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
  var dataID = data["id"];
  var dataName =  data["name"];
  var dataInv = data["invoice"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataG = data["gtotal"];
  var dataEcID = data["econtID"];
  var dataDate = data["date"];
  var dataTime = data["time"];
  var datamenu = data["menu"];
  var datamenutotal = data["menutotal"]
  var datamenucost = data["menucost"]
  var datacash = data ["cash"]

      //Title of the Paper
  setTimeout(() => {
    device.open(function(error){
      printer
        .encode('tis-620')
        .font('a')
        .align('ct')
        .style('b')
        .size(0.5, 0.55)
        .text('เพ-กะ-ลาว')
        .feed()
        .style('normal')
        .size(0.01, 0.015)
        .text('70/12')
        .text('Tel : 0659983229')
        .feed()
        .style('b')
        .size(0.5, 0.55)
        .text('ใบเสร็จ')
        .style('normal')
        .size(0.01, 0.05)
        .text('สั่งอาหารได้ที่ line: @playglao')
        .text('----------------------------------------')

          //First API insert
        .align('lt')
        .text('    '+ 'INV.NO: '+ dataInv+ '  ')
        .text('    '+'Table : '+ dataTstatus+ '  ')
        .text('    '+'Staff : '+ dataSname+ '  ')
        .text('    '+'Guest :  '+ dataG+'                   '+ 'ID : '+ dataEcID+ '  ')
        .text('    '+'Date : '+ dataDate+'              '+ 'Time: '+ dataTime+ '  ')
        .align('ct')
        .text('----------------------------------------')
        .align('lt')
        /*.feed()*/
        .close()
    });
  }, 200);

    //Listing menu
  setTimeout(() => {
    for (var i=0; i < datamenu.length; i++) {
      (function(ind) {
        setTimeout(function(){console.log(ind)
        var j = ind
        var fr = datamenutotal[j]     //Value of First rows
        var sr = datamenu[j]          //Value of Second rows
        var tr = datamenucost[j]      //Value of Third rows
        var trd = datamenucost[j] / 2
        device.open(function(error){
          printer
            .tableCustom(
              [
                { text:"    "+fr, align:"LEFT", width:0.275 },      //First rows of listing menu
                { text: sr, align:"LEFT", width:0.63 },             //Second rows of listing menu
                { text: tr, align:"RIGHT", width:0.16}             //Third rows of listing menu
              ])

            .tableCustom(
              [
                { text:"    ", align:"LEFT", width:0.275 },      //First rows of listing Discount
                { text: "#Discount 50%", align:"LEFT", width:0.63 },             //Second rows of listing Discount
                { text:"-"+ trd, align:"RIGHT", width:0.16}             //Third rows of listing Discount
              ])


            //.text('  '+ o+ '      '+ k+ '                  '+ p)
            //.feed()
            .close()
        });
        }, 200 * ind);
      })(i);
  }}, 700);

  setTimeout(() => {
    var  subtotal = datamenucost.reduce(function(a,b){
      return a+b ;
        }, 0)

    var  totaldiscount = subtotal / 2
    var  total = subtotal - totaldiscount
    var  change = datacash - total

    device.open(function(error){
      printer
        .align('ct')
        .text('----------------------------------------')
        .align('lt')
        .text('    '+'Items : '+ datamenu.length)
        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"Subtotal :", width : 0.5},
            {text:" "+ subtotal, width:0.2}
          ])

        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"Discount :", width : 0.5},
            {text:"-"+ totaldiscount, width:0.2}
          ])

        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"==================", width : 0.45},
            {text:"========", width:0.2}
          ])

        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"Total :", width : 0.5},
            {text:"-"+ total, width:0.2}
          ])

        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"==================", width : 0.45},
            {text:"========", width:0.2}
          ])

        .align('ct')
        .text('----------------------------------------')

        .tableCustom(
          [
            {text:"  Cash", width : 0.43},
            {text:" ", width : 0.5},
            {text:datacash, width:0.2}
          ])

        .tableCustom(
          [
            {text:"  Change", width : 0.43},
            {text:" ", width : 0.5},
            {text:change, width:0.2}
          ])

        .text('----------------------------------------')
        .align('ct')
        .text('Thank you')
        .feed()

        .close()
    });
  },2000);

setTimeout(() => {
    device.open(function(error){
        printer
          .feed()
          .cut()
          .close()
      });
  }, 3000);

  res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)