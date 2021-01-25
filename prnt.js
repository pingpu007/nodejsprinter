console.log("STEP #1")
const escpos = require('escpos');
console.log("STEP #2")

// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
console.log("STEP #3")

const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ }
// encoding is optional

const printer = new escpos.Printer(device, options);

device.open(function(error){
  printer
  .font('a')
  .align('ct')
  .style('b')
  .size(0.5, 0.55)
//  .text('Play-G-LAO')
/*  .feed()
  .style('normal')
  .size(0.01, 0.015)
  .text('70/12')
  .text('Tel : 0659983229')
  .feed()
  .style('b')
  .size(0.5, 0.55)
  .text('Bill')
  .style('normal')
  .size(0.01, 0.015)
  .text('Order by Line: @playglao')
  .text('-----------------------------------------')
  .align('lt')
  .text('INV.NO:00004387')
  .text('Table :T/A1')
  .text('Staff : ')
  .text('Guest : 1                      ID : ECONT')
  .text('Date : 20/01/64                Time: 16:55')
  .text('-----------------------------------------')*/
  
  
 // .barcode('1234567', 'EAN8')
 // .table(["One", "Two", "Three"])
  .tableCustom(
    [
      { text:"Left", align:"LEFT", width:0.33, style: 'B' },
      { text:"Center", align:"CENTER", width:0.33},
      { text:"Right", align:"RIGHT", width:0.33 }

    ],
    { encoding: 'cp857', size: [1, 1] } // Optional
  )
  .feed()
  .cut()
  .close()
/*  .qrimage('https://www.facebook.com/afdol.poolsap/', function(err){
    this.cut();
    this.close();
  });*/
});
