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
app.get('/bills', (req, res) => {
  res.json(books)
})
                                                                //Post for invoice Printing
app.post('/invoice', (req, res) => {
  var data = req.body;
  //console.log(data);
  var datashopname = data["shopname"]
  var dataaddressnum = data["addressnumber"]
  var datatel = data["tel"]
  var datatypeofpaper = data["typeofpaper"]
  var datalinedetail = data["lineDetail"]
  var dataInv = data["invoice"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataG = data["gtotal"];
  var dataDate = data["date"];
  var dataTime = data["time"];
  var datamenu = data["menu"];
  var datamenutotal = data["menutotal"]
  var datamenucost = data["menucost"]
  var datadiscounttext = data["discounttext"]
  var datadiscount = data["discount"]

  // Regex : Generic Pattern Counter
  const countSpecialThaiWord = (str) => {
    // ะ, ิ
    const re = /[ะิีึืุู่้๊๋ั]/g
      return ((str || '').match(re) || []).length
  }

      setTimeout(() => {
      //Title of the Paper 
    device.open(function(error){
      printer
       .encode('tis-620')
        .font('a')
        .align('ct')
        .style('b')
        .size(0.5, 0.55)
        .text(datashopname)
        .feed()
        .style('normal')
        .size(0.01, 0.015)
        .text(dataaddressnum)
        .text(datatel)
        .feed()
        .style('b')
        .size(0.5, 0.55)
        .text(datatypeofpaper)
        .style('normal')
        .size(0.01, 0.05)
        .text(datalinedetail)
        .text('----------------------------------------')
          //First API insert
        .align('lt')
        .text('    '+ dataInv)
        .text('    '+ dataTstatus+ '  ')
        .text('    '+ dataSname+ '  ')
        .text('    '+ dataG+ '                   ')
        .tableCustom(
          [
          {text:"    "+ dataDate, width:0.8},
          {text:dataTime, width:0.38}
          ])
        .align('ct')
        .text('----------------------------------------')
        .align('lt')
        .close()
    });}, 200 * datamenu.length);


  //loop listing menu and discount
  for (var i=0; i < datamenu.length; i++) {
    (function(ind) {
      setTimeout(function(){console.log(ind)
        var j = ind
        var fl = datamenutotal[j]     //Value of First Col - Number of order
        var sl = datamenu[j]          //Value of Second Col - Name of Food
        var tl = datamenucost[j]      //Value of Third Col - Price of Food per dish
        var tld = datamenucost[j] * datadiscount[j] / 100
        // Calculate space of thai language by Donut
        var _countSpecialThaiWord = countSpecialThaiWord(sl)
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
                { text:"    "+fl, align:"LEFT", width:0.275 },        //First Col of listing menu
                { text: sl, align:"LEFT", width:0.63+spaceWidth  },   //Second Col of listing menu + space of special ThaiWord by Donut
                { text:"" +tl, align:"RIGHT", width:0.16}             //Third Col of listing menu
              ],
              { encoding: 'tis-620', size: [1, 1] })
            .tableCustom(
              [
                { text:"    ", align:"LEFT", width:0.275 },                                       //First Col of listing Discount
                { text: datadiscounttext[j]+ " "+ datadiscount[j]+"%", align:"LEFT", width:0.63 },             //Second Col of listing Discount
                { text:"-"+ tld, align:"RIGHT", width:0.16}                                       //Third Col of listing Discount
              ])
            //.feed()
            .close()
        });
      }, 200 * datamenu.length);
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
        .text('Thank you')
        .feed()
        .close()
    });
  },200 * datamenu.length);

  setTimeout(() => {
    device.open(function(error){
      printer
        .feed()
        .cut()
        .close()
    });
  }, 200 * datamenu.length); 

  res.status(201).json(req.body)
})
                                                                    //Post for order printing
app.post('/order', (req, res) => {
  var data = req.body;
  var datashopname = data["shopname"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataDate = data["date"];
  var dataTime = data["time"];
  var datamenu = data["menu"];
  var datamenutotal = data["menutotal"]

  for (var i=0; i < datamenu.length; i++) {
    (function(ind) {
      setTimeout(function(){console.log(ind)
        var j = ind
        var datamenunum = datamenutotal[j]     //Value Number of order
        var datamenuname = datamenu[j]          //Value Name of Food
      device.open(function(error){
          printer
            .encode('tis-620')
            .font('a')
            .align('lt')
            .size(0.5, 0.55)
            .text(dataSname)
            .text(dataDate+ " "+ dataTime)
            .feed()
            .size(1,1.2)
            .text(dataTstatus)
            .size(0.5, 0.55)
            .text('-----------------------------------------')
            .size(1,1.2)
            .tableCustom(
              [
                { text:"  "+ datamenunum+ "x", align:"LEFT", width:0.1 },        //First Col of listing menu
                { text:"  "+ datamenuname, align:"LEFT", width:0.5  },           //Second Col of listing menu + space of special ThaiWord by Donut
              ])
            .size(0.5, 0.55)
            .text('-----------------------------------------')
            .feed()
            .cut()
            //.feed()
            .close()
        });
      }, 200 * datamenu.length);
      })(i);
    }
    console.log("succeed")

  res.status(201).json(req.body)
})
                                                                      //Post for bills Printing
app.post('/bills', (req, res) => {
  var data = req.body;
  //console.log(data);
  var dataID = data["id"];
  var datashopname = data["shopname"]
  var dataaddressnum = data["addressnumber"]
  var datatel = data["tel"]
  var datatypeofpaper = data["typeofpaper"]
  var datalinedetail = data["lineDetail"]
  var dataInv = data["invoice"];
  var dataTstatus = data["tstatus"];
  var dataSname = data["sname"];
  var dataG = data["gtotal"];
  var dataBillID = data["billID"];
  var dataDate = data["date"];
  var dataTime = data["time"];
  var datamenu = data["menu"];
  var datamenutotal = data["menutotal"]
  var datamenucost = data["menucost"]
  var datacash = data ["cash"]
  var datadiscounttext = data["discounttext"]
  var datadiscount = data["discount"]


    setTimeout(() => {
      //Title of the Paper 
    device.open(function(error){
      printer
       .encode('tis-620')
        .font('a')
        .align('ct')
        .style('b')
        .size(0.5, 0.55)
        //First API insert
        .text(datashopname)
        .feed()
        .style('normal')
        .size(0.01, 0.015)
        .text(dataaddressnum)
        .text(datatel)
        .feed()
        .style('b')
        .size(0.5, 0.55)
        .text(datatypeofpaper)
        .style('normal')
        .size(0.01, 0.015)
        .text(datalinedetail)
        .text('----------------------------------------')
        .align('lt')
        .text('    '+ dataInv+ '  ')
        .text('    '+ dataTstatus+ '  ')
        .text('    '+ dataSname+ '  ')
        .tableCustom(
          [
          {text:"    "+ dataG, width:0.8},
          {text:dataBillID, width:0.38}
          ])
        .tableCustom(
          [
          {text:"    "+ dataDate, width:0.8},
          {text:dataTime, width:0.38}
          ])
        .align('ct')
        .text('----------------------------------------')
        .align('lt')
        .close()
    });}, 200 * datamenu.length);
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
        var fl = datamenutotal[j]     //Value of First Col - Number of order
        var sl = datamenu[j]          //Value of Second Col - Name of Food
        var tl = datamenucost[j]      //Value of Third Col - Price of Food per dish
        var tld = datamenucost[j] * datadiscount[j] / 100
        // Calculate space of thai language by Donut
        var _countSpecialThaiWord = countSpecialThaiWord(sl)
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
                { text:"    "+fl, align:"LEFT", width:0.275 },        //First Col of listing menu
                { text: sl, align:"LEFT", width:0.63+spaceWidth  },   //Second Col of listing menu + space of special ThaiWord by Donut
                { text:"" +tl, align:"RIGHT", width:0.16}             //Third Col of listing menu
              ],
              { encoding: 'tis-620', size: [1, 1] })
            .tableCustom(
              [
                { text:"    ", align:"LEFT", width:0.275 },                                       //First Col of listing Discount
                { text: datadiscounttext[j]+ " "+ datadiscount[j]+"%", align:"LEFT", width:0.63 },             //Second Col of listing Discount
                { text:"-"+ tld, align:"RIGHT", width:0.16}                                       //Third Col of listing Discount
              ])
            //.feed()
            .close()
        });
      }, 200 * datamenu.length);
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
  },200 * datamenu.length);

  setTimeout(() => {
    device.open(function(error){
      printer
        .feed()
        .cut()
        .close()
    });
  }, 300 * datamenu.length); 

  res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})


app.listen(5000)