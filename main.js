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

console.log("TEST >>>>")
const books = require('./db')
/*console.log(books)*/
app.get('/books', (req, res) => {
  res.json(books)
})

app.post('/books', (req, res) => {
  books.push(req.body)
  var data = req.body;
  //console.log(data);
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
  var datadiscount = data["discount"]

      //Title of the Paper 
 // setTimeout(() => {
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
  //}, 100);
  
  // Regex : Generic Pattern Counter
  const countSpecialThaiWord = (str) => {
    // ะ, ิ
    const re = /[ัิี้]/g
      return ((str || '').match(re) || []).length
  }

  // var countSpecialThaiWord = countThaiWord("ฝัดไท")
  // console.log("countSize", countSpecialThaiWord)
  

    //loop listing menu and discount
    for (var i=0; i < datamenu.length; i++) {
      (function(ind) {
        setTimeout(function(){console.log(ind)
        var j = ind
        var fr = datamenutotal[j]     //Value of First Col - Number of order
        var sr = datamenu[j]          //Value of Second Col - Name of Food
        var tr = datamenucost[j]      //Value of Third Col - Price of Food per dish
        var trd = datamenucost[j] * datadiscount[j] / 100


        
        // Calculate space of thai language by Donut
        var _countSpecialThaiWord = countSpecialThaiWord(sr)
        console.log("_countSpecialThaiWord", _countSpecialThaiWord)
        var maxLenOfTableCustom = 42
        var spaceWidth = 0
        if (_countSpecialThaiWord != 0) {
          spaceWidth = (_countSpecialThaiWord / maxLenOfTableCustom)
          console.log("spaceWidth", spaceWidth)
        }
        


        device.open(function(error){
          printer
            .tableCustom(
              [
                { text:"    "+fr, align:"LEFT", width:0.275 },        //First Col of listing menu
                { text: sr, align:"LEFT", width:0.63+spaceWidth  },   //Second Col of listing menu + space of special ThaiWord by Donut
                { text:"" +tr, align:"RIGHT", width:0.16}             //Third Col of listing menu
              ],
              { encoding: 'tis-620', size: [1, 1] })
            .tableCustom(
              [
                { text:"    ", align:"LEFT", width:0.275 },                                       //First Col of listing Discount
                { text: "#Discount "+datadiscount[j]+"%", align:"LEFT", width:0.63 },             //Second Col of listing Discount
                { text:"-"+ trd, align:"RIGHT", width:0.16}                                       //Third Col of listing Discount
              ])
            //.feed()
            .close()
        });
      }, 200 * ind);
      })(i);
    }
 
          //Operation of the end of printing
  setTimeout(() => {
    var  item = datamenutotal.reduce(function(a,b){
      return a+b ;
        }, 0)
    var  subtotal = datamenucost.reduce(function(a,b){
      return a+b ;
        }, 0)
    var dc = []
    for (var i=0; i < datamenu.length; i++) {
        dc[i] = datamenucost[i] * datadiscount[i] / 100
        var dcvd = dc.reduce(function(a,b){
      return a+b ;
        }, 0)
      } 
    var  totaldiscount = dcvd
    var  total = subtotal - totaldiscount
    var  change = datacash - total

    device.open(function(error){
      printer
        .align('ct')
        .text('----------------------------------------')
        .align('lt')
        .text('    '+'Items : '+ item)
        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"Subtotal :", align:"LEFT", width : 0.5},
            {text:" "+ subtotal, align:"RIGHT", width:0.1}
          ])
        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"Discount :", align:"LEFT", width : 0.5},
            {text:"-"+ totaldiscount, align:"RIGHT", width:0.1}
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
            {text:"Total :", align:"LEFT", width : 0.4},
            {text:" "+ total, align:"RIGHT", width:0.22}
          ])
        .tableCustom(
          [
            {text:" ", width : 0.43},
            {text:"==================", width : 0.45},
            {text:"========", width:0.2}
          ])
        .align('ct')
        .text('----------------------------------------')
        .align('lt')
        .tableCustom(
          [
            {text:"    Cash", align:"LEFT", width : 0.43},
            {text:" ", align:"LEFT", width : 0.3},
            {text: datacash, align:"RIGHT", width:0.33}
          ])
        .tableCustom(
          [
            {text:"    Change", align:"LEFT", width : 0.43},
            {text:" ", align:"LEFT", width : 0.3},
            {text: change , align:"RIGHT", width:0.33}
          ])
        .align('ct')
        .text('----------------------------------------')
        .align('ct')
        .text('Thank you')
        .feed()

        .close()
    });
  },200 * i);

  setTimeout(() => {
    device.open(function(error){
      printer
        .feed()
        .cut()
        .close()
    });
  }, 200 * i); 


  res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)