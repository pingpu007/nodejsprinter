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

console.log("papu is online >>>>")
const books = require('./db')
/*console.log(books)*/
app.get('/bills', (req, res) => {
  res.json(books)
  device.open(function(error){
    printer
      .feed()
  })
})

app.post('/papu', (req, res) => {
  var data = req.body;
  var datashopname = data["shopname"];
  var dataaddress = data["address"];
  var dataaddress2 = data["address2"];
  var datataxid = data["taxid"];
  var dataaddress3 = data["address3"];
  var datatel = data["tel"];
  var datatypeofpaper = data["typeofpaper"]
  var datatypeoftable = data["typeoftable"]
  var datatablenum = data["tablenum"]
  var datastaffnametitle = data["staffnametitle"]
  var datastaffname = data["staffname"]
  var datatimearrivaltitle = data["timearrivaltitle"]
  var datadatearrival = data["datearrival"]
  var datatimearrival = data["timearrival"]
  var datatimeprintingtitle = data["timeprintingtitle"]
  var datadateprinting = data["dateprinting"]
  var datatimeprinting = data["timeprinting"]
  var dataitemtitle = data["itemtitle"]
  var dataquantitytitle = data["quantitytitle"]
  var datatotalcosttitle = data["totalcosttitle"]
  var datamenu = data["menu"]
  var datamenutotal = data["menutotal"]
  var datamenucost = data["menucost"]
  var datatotaltitle = data["totaltitle"]
  var dataalltotal = data["alltotal"]
  var datathankyoutitle = data["thankyoutitle"]
  var datacontacttitle = data["contacttitle"]
  var datacontactnumber = data["contactnumber"]
  var datacreditcreating = data["creditcreating"]

setTimeout(() => {
device.open(function(error){
  printer
    .encode('tis-620')
    .font('a')
    .align('ct')
    .size(0.5, 0.55) 
    .text(datashopname)
    .text(dataaddress)
    .text(dataaddress2)
    .text(datataxid)
    .feed()
    .text(dataaddress3)
    .text(datatel)
    .feed()
    .text(datatypeofpaper)
    .feed()
    .text("---------------------------------------")
    .feed()
    .tableCustom(
          [
          {text:datatypeoftable,align:"LEFT", width:0.5},
          {text:datatablenum,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datastaffnametitle,align:"LEFT", width:0.5},
          {text:datastaffname,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datatimearrivaltitle,align:"LEFT", width:0.5},
          {text:datadatearrival+ " "+ datatimearrival,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datatimeprintingtitle,align:"LEFT", width:0.5},
          {text:datadateprinting+ " "+ datatimeprinting,align:"RIGHT", width:0.5}
          ])
    .feed()
    .text("---------------------------------------")
    .feed()
    .tableCustom(
          [
          {text:dataitemtitle,align:"LEFT", width:0.33},
          {text:dataquantitytitle,align:"CENTER", width:0.33},
          {text:datatotalcosttitle,align:"RIGHT", width:0.33}
          ])
    //.feed()
    .close()
  });
}, 200 * datamenu.length); 

    // Regex : Generic Pattern Counter
  const countSpecialThaiWord = (str) => {
    // ะ, ิ
    const re = /[ะิีึืุู่้๊๋ั]/g
      return ((str || '').match(re) || []).length
  }
  //loop listing menu and discount
  for (var i=0; i < datamenu.length; i++) {
    (function(ind) {
      setTimeout(function(){console.log(ind)
        var j = ind
        var fl = datamenu[j]     //Value of First Col - Number of order
        var sl = datamenutotal[j]          //Value of Second Col - Name of Food
        var tl = datamenucost[j] * datamenutotal[j]      //Value of Third Col - Price of Food per dish
        // Calculate space of thai language by Donut
        var _countSpecialThaiWord = countSpecialThaiWord(fl)
        console.log("_countSpecialThaiWord", _countSpecialThaiWord)
        var maxLenOfTableCustom = 42
        var spaceWidth = 0
        if (_countSpecialThaiWord != 0) {
         spaceWidth = (_countSpecialThaiWord / maxLenOfTableCustom)
          console.log("spaceWidth", spaceWidth)
        }
        device.open(function(error){
          printer
            .size(0.5, 0.45)
            .tableCustom(
              [
                { text:fl, align:"LEFT", width:0.33+ spaceWidth, size:0. },        //First Col of listing menu + space of special ThaiWord by Donut
                { text: sl, align:"CENTER", width:0.33  },   //Second Col of listing menu 
                { text:tl, align:"RIGHT", width:0.33}             //Third Col of listing menu
              ])
            //.feed()
            .close()
        });
      }, 200 * datamenu.length);
    })(i);
  }

setTimeout(() => {
  var  quantity = datamenutotal.reduce(function(a,b){
      return a+b ;
        }, 0)
  var allcc = []
  for (var i=0; i < datamenu.length; i++) {
        allcc[i] = datamenucost[i] * datamenutotal[i]
        var allcost = allcc.reduce(function(a,b){
      return a+b ;
        }, 0)
      }
device.open(function(error){
  printer
    .encode('tis-620')
    .font('a')
    .align('ct')
    .feed()
    .size(0.5, 0.55)
    .tableCustom(
          [
          {text:datatotaltitle,align:"LEFT", width:0.33},
          {text:quantity,align:"CENTER", width:0.33},
          {text:allcost,align:"RIGHT", width:0.33}
          ])
    .text("---------------------------------------")
    .feed()
    .tableCustom(
          [
          {text:dataalltotal,align:"LEFT", width:0.5},
          {text:allcost,align:"RIGHT", width:0.5}
          ])
    .align('ct')
    .text(datathankyoutitle)
    .text(datacontacttitle+ " "+ datacontactnumber)
    .text(datacreditcreating)
    .feed()
    .cut()
    //.feed()
    .close()
  });
}, 200 * datamenu.length); 

  res.status(201).json(req.body)
})


app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)