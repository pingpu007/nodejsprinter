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



app.post('/books', (req, res) => {
  books.push(req.body)
  var data = req.body;
  //console.log(data);
  var datashopname = data["shopname"]
  var dataaddressnum = data["addressnumber"]
  var datatel = data["tel"]
  var datalineid = data["lineID"]
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
/*    device.open(function(error){
      printer
       .encode('tis-620')
        .font('a')
        .align('lt')
        .size(1.5, 1.55)
        .text("Order :" + dataInv)
        .feed()
        .align('lt')
        .style('normal')
        .size(0.8, 0.45)
        .text("Date :"+ dataDate )
        .align('ct')
        .size(1.5, 1.55)
        .feed()
        .align('lt')
        .size(0.5, 0.55)
        .text('Items')
        .align('ct')
        .text('----------------------------------------')
        .close()
    });*/
  //}, 100);
  
    //loop listing menu and discount
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
            .text("Staff Name :"+ dataSname)
            .text("Time :"+ dataDate+ " "+ dataTime)
            .feed()
            .size(1,1.2)
            .text("Table :"+ dataTstatus)
            .size(0.5, 0.55)
            .text('-----------------------------------------')
            .size(1,1.2)
            .tableCustom(
              [
                { text:"  "+ fr+ "x", align:"LEFT", width:0.1 },        //Print Number of order
                { text:"  "+ sr, align:"LEFT", width:0.5  },            //Print Number of Food
              ])
            .size(0.5, 0.55)
            .text('-----------------------------------------')
            .feed()
            .cut()
            //.feed()
            .close()
        });
      }, 200 * ind);
      })(i);
    }



  res.status(201).json(req.body)
})

app.listen(5000)