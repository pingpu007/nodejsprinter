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

console.log("Santa Fe is onboard >>>>")
const books = require('./db')
/*console.log(books)*/
app.get('/bills', (req, res) => {
  res.json(books)
  device.open(function(error){
    printer
      .feed()
  })
})

app.post('/begin', (req, res) => {
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
        var allcost = allcc.reduce(function(a,b){
      return a+b ;
        }, 0)
      }
  var  costvat = allcost * 0.93
  var  vat = allcost * 0.07
  var cashchange = datacash - allcost
  var cashperpeople = allcost / datacustomernum
device.open(function(error){
  printer
    .encode('tis-620')
    .font('a')
    .align('ct')
    .size(1,1) 
    .text(datacompanyname)
/*    .size(1,1.3) 
    .text(datacompanyname)
    .size(1,1.4) 
    .text(datacompanyname)
    .size(1,1.5) 
    .text(datacompanyname)
    .size(1,1.6) 
    .text(datacompanyname)
    .size(1,1.7) 
    .text(datacompanyname)
    .size(1,1.8) 
    .text(datacompanyname)
    .size(1,1.9) 
    .text(datacompanyname)
    .size(1,2) 
    .text(datacompanyname)*/
    .feed()
    .cut()
    .close()
  });
  console.log("Ready to use printer >>>>>>>")
}, 200 * datamenucost.length); 


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
          {text:dataposid,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datataxinvoicetitle,align:"LEFT", width:0.5},
          {text:datataxinvoiceid,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datadateandtime,align:"LEFT", width:0.5},
          {text:datadate+ " "+ datatime,align:"RIGHT", width:0.5}
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
          {text:datamenutitle,align:"LEFT", width:0.5},
          {text:allcost,align:"RIGHT", width:0.5}
          ])
    .text("-------------------------------------------")
    .align('lt')
    .tableCustom(
          [
          {text:datatotaltitle,align:"LEFT", width:0.5},
          {text:costvat,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datavattitle,align:"LEFT", width:0.5},
          {text:vat,align:"RIGHT", width:0.5}
          ])
    .style('b')
    .size(1, 0)
    .tableCustom(
          [
          {text:dataalltotal,align:"LEFT", width:0.5},
          {text:allcost,align:"RIGHT", width:0.5}
          ])
    .align('lt')
    .style('normal')
    .size(0.5555,0.05)
    .tableCustom(
          [
          {text:datacashtitle,align:"LEFT", width:0.5},
          {text:cash,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:datacashchangetitle,align:"LEFT", width:0.5},
          {text:cashchange,align:"RIGHT", width:0.5}
          ])
    .tableCustom(
          [
          {text:dataaverageperpeopletitle,align:"LEFT", width:0.5},
          {text:cashperpeople,align:"RIGHT", width:0.5}
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


app.listen(5000)