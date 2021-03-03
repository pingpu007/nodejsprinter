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

      /*setTimeout(() => {
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
    });}, 200 * datamenu.length);*/

  setTimeout(() => {
  //loop listing menu and discount
  for (var i=0; i < datamenu.length; i++) {
    (function(ind) {
      console.log('st ##2')
      setTimeout(function(){console.log(i)
        console.log('st ##3')
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

        console.log(j)
        console.log(sl)
        console.log(tl)
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
      console.log('st ##4')}, 200 * datamenu.length);
    console.log('st ##5')(ind)});
  console.log('st ##6')}}, 200 * datamenu.length);

  //Operation of the end of printing
/*  setTimeout(() => {
    var  item = datamenutotal.reduce(function(a,b){
      return a+b ;
        }, 0)
    var  subt = []
    for (var i=0; i < datamenu.length; i++) {
        subt[i] = datamenutotal[i] * datamenucost[i] 
        var subtotal = subt.reduce(function(a,b){
      return a+b ;
        }, 0)} 
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
  },200 * datamenu.length);*/

  /*setTimeout(() => {
    device.open(function(error){
      printer
        .feed()
        .cut()
        .close()
    });
  }, 200 * datamenu.length)*/;

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
    var  subt = []
    for (var i=0; i < datamenu.length; i++) {
        subt[i] = datamenutotal[i] * datamenucost[i] 
        var subtotal = subt.reduce(function(a,b){
      return a+b ;
        }, 0)} 
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

app.post('/newform', (req, res) => {
  var data = req.body;
  var datacompanyname = data["companyname"];
  var datashopname1 = data["shopname1"];
  var datashopname2 = data["shopname2"];
  var databranchtitle = data["branchtitle"];
  var databranchid = data["branchid"];
  var datataxidtitle = data["taxidtitle"];
  var datataxid = data["taxid"];
  var datapapertitle = data["papertitle"];
  var dataposidtitle = data["posidtitle"];
  var dataposid = data["posid"];
  var datataxinvoicetitle = data["taxinvoicetitle"];
  var datataxinvoiceid = data["taxinvoiceid"];
  var datadateandtime = data["dateandtimetitle"];
  var datadate = data["date"];
  var datatime = data["time"];
  var datatabletitle = data["tabletitle"];
  var datatablenum = data["tablenum"];
  var datacustomernum = data["customernum"];
  var datacustomerpronoun = data["customerpronoun"];
  var datamenutitle = data["menutitle"];
  var datamenutotal = data["menutotal"];
  var datamenucost = data["menucost"];
  var datatotaltitle = data["totaltitle"];
  var datavattitle = data["vattitle"];
  var dataalltotal = data["alltotal"];
  var datacashtitle = data["cashtitle"];
  var datacash = data["cash"];
  var datacashchangetitle = data["cashchangetitle"];
  var dataaverageperpeopletitle = data["averageperpeopletitle"];
  var datacustomertitle = data["customertitle"];
  var datacustomerid = data["customerid"];
  var datacustomertype = data["customertype"];
  var dataending1 = data["ending1"];
  var dataending2 = data["ending2"];
  var dataitemtitle = data["itemtitle"];
  var datasignaturetitle = data["signaturetitle"];
  var datacashiersignaturetitle = data["cashiersignaturetitle"];
  var datacashiernametitle = data["cashiernametitle"];
  var datacashiername = data["cashiername"];



setTimeout(() => {
  var  allcc = [];
  for (var i=0; i < datamenucost.length; i++) {
        allcc[i] = datamenucost[i] * datamenutotal[i]
        var allco = allcc.reduce(function(a,b){
      return a+b ;
        }, 0)
      }
  var allcost = allco.toFixed(2);
  var  novat = allcost * 0.93
  var  costvat = novat.toFixed(2);
  var  withvat = allcost * 0.07
  var  vat = withvat.toFixed(2);
  var cashwithchange = datacash - allcost
  var cashchange = cashwithchange.toFixed(2);
  var cashperperpeople = allcost / datacustomernum
  var cashperpeople = cashperperpeople.toFixed(2);
  var cash = datacash.toFixed(2);

  // Regex : Generic Pattern Counter
  const countSpecialThaiWord = (str) => {
    // ะ, ิ
    const re = /[ะิีึืุู่้๊๋ั]/g
      return ((str || '').match(re) || []).length
  }

  // Calculate space of thai language by Donut
        var _countSpecialThaiWorddatadateandtime = countSpecialThaiWord(datadateandtime)
        var _countSpecialThaiWorddatamenutitle = countSpecialThaiWord(datamenutitle)
        var _countSpecialThaiWorddatatotaltitle = countSpecialThaiWord(datatotaltitle)
        var _countSpecialThaiWorddataalltotal = countSpecialThaiWord(dataalltotal)
        var _countSpecialThaiWorddatacashtitle = countSpecialThaiWord(datacashtitle)
        var _countSpecialThaiWorddatacashchangetitle = countSpecialThaiWord(datacashchangetitle)
        var _countSpecialThaiWorddataaverageperpeopletitle = countSpecialThaiWord(dataaverageperpeopletitle)
        //console.log("_countSpecialThaiWord", _countSpecialThaiWord)
        var maxLenOfTableCustom = 42
        var spaceWidthfordatadateandtime = 0
        var spaceWidthfordatamenutitle = 0
        var spaceWidthfordataalltotal = 0
        var spaceWidthfordatatotaltitle = 0
        var spaceWidthfordatacashtitle = 0
        var spaceWidthfordatacashchangetitle = 0
        var spaceWidthfordataaverageperpeopletitle = 0
        if (_countSpecialThaiWorddatadateandtime  != 0) {
         spaceWidthfordatadateandtime = (_countSpecialThaiWorddatadateandtime / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }
        if (_countSpecialThaiWorddatamenutitle  != 0) {
         spaceWidthfordatamenutitle = (_countSpecialThaiWorddatamenutitle / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }
        if (_countSpecialThaiWorddatatotaltitle  != 0) {
         spaceWidthfordatatotaltitle = (_countSpecialThaiWorddatatotaltitle / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }
        if (_countSpecialThaiWorddataalltotal  != 0) {
         spaceWidthfordataalltotal = (_countSpecialThaiWorddataalltotal / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }
        if (_countSpecialThaiWorddatacashtitle  != 0) {
         spaceWidthfordatacashtitle = (_countSpecialThaiWorddatacashtitle / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }
        if (_countSpecialThaiWorddatacashchangetitle  != 0) {
         spaceWidthfordatacashchangetitle = (_countSpecialThaiWorddatacashchangetitle / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }
        if (_countSpecialThaiWorddataaverageperpeopletitle  != 0) {
         spaceWidthfordataaverageperpeopletitle = (_countSpecialThaiWorddataaverageperpeopletitle / maxLenOfTableCustom)
          //console.log("spaceWidth", spaceWidth)
        }

device.open(function(error){
  printer
    .encode('tis-620')
    .font('a')
    .align('ct')
    .size(1, 1.05) 
    .text(datacompanyname)
    .style('b')
    .text(datashopname1)
    .text(datashopname2)
    .style('normal')
    .size(0.5555,0.05)
    .text(databranchtitle+" "+ databranchid)
    .text(datataxidtitle+" "+ datataxid)
    .feed()
    .style('b')
    .align('lt')
    .size(0.5555,0.05)
    .text("   "+ datapapertitle)
    .style('normal')
    .tableCustom(
          [
          {text:dataposidtitle,align:"LEFT", width:0.5},
          {text:dataposid,align:"RIGHT", width:0.56}
          ])
    .tableCustom(
          [
          {text:datataxinvoicetitle,align:"LEFT", width:0.5},
          {text:datataxinvoiceid,align:"RIGHT", width:0.56}
          ])
    .tableCustom(
          [
          {text:datadateandtime,align:"LEFT", width:0.5+spaceWidthfordatadateandtime},
          {text:datadate+ " "+ datatime,align:"RIGHT", width:0.56}
          ])
    .align('ct')
    .style('b')
    .size(1, 1.05)
    .text(datatabletitle+ " "+ datatablenum)
    .text(datacustomernum+ " "+datacustomerpronoun)
    .style('normal')
    .size(0.5555,0.05)
    .text("-------------------------------------------")
    .tableCustom(
          [
          {text:datamenutitle,align:"LEFT", width:0.5+ spaceWidthfordatamenutitle},
          {text:allcost,align:"RIGHT", width:0.5}
          ])
    .text("-------------------------------------------")
    .align('lt')
    .tableCustom(
          [
          {text:datatotaltitle,align:"LEFT", width:0.5+ spaceWidthfordatatotaltitle},
          {text:costvat,align:"RIGHT", width:0.56}
          ])
    .tableCustom(
          [
          {text:datavattitle,align:"LEFT", width:0.5},
          {text:vat,align:"RIGHT", width:0.56}
          ])
    .style('b')
    .size(1, 0)
    .tableCustom(
          [
          {text:dataalltotal,align:"LEFT", width:0.33+ spaceWidthfordataalltotal},
          {text:allcost,align:"RIGHT", width:0.2}
          ])
    .align('lt')
    .style('normal')
    .size(0.5555,0.05)
    .tableCustom(
          [
          {text:datacashtitle+ ":",align:"LEFT", width:0.5+ spaceWidthfordatacashtitle},
          {text:cash,align:"RIGHT", width:0.56}
          ])
    .tableCustom(
          [
          {text:datacashchangetitle,align:"LEFT", width:0.5+ spaceWidthfordatacashchangetitle},
          {text:cashchange,align:"RIGHT", width:0.56}
          ])
    .tableCustom(
          [
          {text:dataaverageperpeopletitle,align:"LEFT", width:0.5+ spaceWidthfordataaverageperpeopletitle},
          {text:cashperpeople,align:"RIGHT", width:0.56}
          ])
    .text("-------------------------------------------")
    .text(datacustomertitle+ " "+ datacustomerid+ " "+ datacustomertype+ " "+ datacashtitle)
    .text("-------------------------------------------")
    .align('ct')
    .text(dataending1)
    .text(dataending2)
    .text(dataitemtitle)
    .feed('vt')
    .feed('vt')
    .feed('vt')
    .feed('vt')
    .feed('vt')
    .text(datasignaturetitle+ ".............................")
    .text(datacustomertype+ " "+ datacashtitle)
    .feed('vt')
    .feed('vt')
    .feed('vt')
    .text(datacashiersignaturetitle+ "________________________")
    .text(datacashiernametitle+ " "+ datacashiername)
    .text("("+ datadate+ " "+ datatime+ ")")
    .feed()
    .cut()
    .close()
  });
}, 200 * datamenucost.length); 


  res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
  const updateIndex = books.findIndex(book => book.id === req.params.id)
  res.json(Object.assign(books[updateIndex], req.body))
})

app.post('/invwindow', (req, res) => {
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
    });}, 500 * datamenu.length);

  setTimeout(() => {
  //loop listing menu and discount
  for (var i=0; i < datamenu.length; i++) {
    (function(ind) {
        console.log('st ##2')
      setTimeout(function(){console.log('i = '+ i)
        console.log('st ##3')
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

        console.log('j = '+ j)
        console.log('sl = '+ sl)
        console.log('tl = '+ tl)
        device.open(function(error){
          printer
            .tableCustom(
              [
                { text:"    "+fl, align:"LEFT", width:0.275 },        //First Col of listing menu
                { text: sl, align:"LEFT", width:0.5+spaceWidth  },   //Second Col of listing menu + space of special ThaiWord by Donut
                { text:"" +tl, align:"RIGHT", width:0.16}             //Third Col of listing menu
              ],
              { encoding: 'tis-620', size: [1, 1] })
            .tableCustom(
              [
                { text:"    ", align:"LEFT", width:0.275 },                                       //First Col of listing Discount
                { text: datadiscounttext[j]+ " "+ datadiscount[j]+"%", align:"LEFT", width:0.5 },             //Second Col of listing Discount
                { text:"-"+ tld, align:"RIGHT", width:0.16}                                       //Third Col of listing Discount
              ])
            //.feed()
            .close()
        });
      console.log('st ##4')}, 500 * datamenu.length);
    console.log('st ##5')}(i));
  console.log('st ##6')}
  }, 500 * datamenu.length);

  //Operation of the end of printing
  setTimeout(() => {
    var  item = datamenutotal.reduce(function(a,b){
      return a+b ;
        }, 0)
    var  subt = []
    for (var i=0; i < datamenu.length; i++) {
        subt[i] = datamenutotal[i] * datamenucost[i] 
        var subtotal = subt.reduce(function(a,b){
      return a+b ;
        }, 0)} 
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
  },1500 * datamenu.length);

  setTimeout(() => {
    device.open(function(error){
      printer
        .feed()
        .cut()
        .close()
    });
  }, 1500 * datamenu.length);

  res.status(201).json(req.body)
})


app.listen(5000)