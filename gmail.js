
require('dotenv').config();
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

const accountSid = 'AC0b8e193884a58c186ec1aa3a85f29229'; 
const authToken = 'dad0bed96d0be1f38e7847974cf24acf'; 
const client = require('twilio')(accountSid, authToken); 
 
const readline = require('readline');
async function readLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "myPrompt>>",
  });
  return new Promise(resolve => {
    rl.question(`Enter Sender's name:`, (answer) => {
      rl.close();
      resolve(answer)

    })
  })

}
async function ReadLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "myPrompt>>",
  });
  return new Promise(resolve => {
    rl.question('Enter Date:', (answer) => {
      rl.close();
      resolve(answer)

    })
  })

}

let npage;
let gBrowser;
let email = "guptapresha858@gmail.com";
let pass = "presha2007";
let data=[];



(async function () {
  puppeteer.use(pluginStealth());
  const sender = await readLine();
  const date = await ReadLine();
  const browser = await puppeteer.launch({
    headless: false,
    slowMo:2,
    defaultViewport: null,
    args: ["--start-maximized"]
  })
  .then(function(browser){
    gBrowser=browser;
    return browser.pages();
})

.then(function(pagesArr){
    
    npage=pagesArr[0];
    
    return npage.goto("https://web.whatsapp.com/");
})
  
 
  const page = await gBrowser.newPage();
  await page.goto('https://accounts.google.com/', {waitUntil: 'load', timeout: 0});
 
  await page.waitForSelector("#identifierId");
  await page.type("#identifierId", email);

  await Promise.all([
    page.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b"),
    page.waitForNavigation(),
  ]);
  await page.waitForTimeout(2000);
  await page.waitForSelector('input[type="password"]');
  await page.type('input[type="password"]', pass);
  

  await Promise.all([
    page.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b"),
    page.waitForNavigation({waitUntil: 'networkidle2'}),
  ]);
  

  const gpage = await gBrowser.newPage();

  await gpage.goto('https://mail.google.com/mail/u/0/?ogbl#inbox', {waitUntil: 'load', timeout: 0});

  await gpage.waitForSelector('#aso_search_form_anchor',{visible:true});
  await gpage.click('#aso_search_form_anchor')

  
  await gpage.click('[aria-label="Advanced search options"]')
  await gpage.waitForSelector('[id=":n2"]');
  await gpage.click('[id=":n2"]');
  await gpage.type('[id=":n2"]', sender)
  await gpage.waitForSelector('[id=":ne"]');
  await gpage.click('[id=":ne"]');
  await gpage.type('[id=":ne"]', date);
  await gpage.click(".aab.aP8 ");
  await gpage.waitForSelector('.J-M.J-M-ayU .J-N:nth-child(2)');
  await gpage.click('.J-M.J-M-ayU .J-N:nth-child(2)');


  await Promise.all([
    gpage.click('.T-I.J-J5-Ji.Zx.aQe.T-I-atl.L3'),
    gpage.waitForNavigation(),
  ]);
  await gpage.waitForSelector('[id=":qw"] tr')

  let Mails =  await gpage.$$('[id=":qw"] tr')

   

  for(let i=0; i<Mails.length; i++){
    await gpage.evaluate(function(sel){
      sel.click();
      return;
    }, Mails[i])

    await gpage.waitForSelector('.ha h2');
    let subject = await gpage.$('.ha h2');
    
    let text = await gpage.evaluate(function(subject){
     
      console.log(subject.innerText)
      return subject.innerText;
    }, subject)

    await gpage.waitForSelector('.c2 .iw .go');
    let from=await gpage.$('.c2 .iw .go');
    let sender = await gpage.evaluate(function(from){
     
      console.log(from.innerText)
      return from.innerText;
    }, from)

    await gpage.waitForSelector('.gH.bAk .g3');
    let date=await gpage.$('.gH.bAk .g3');
    let Date = await gpage.evaluate(function(date){
     
      console.log(date.innerText)
      return date.innerText;
    }, date)
    
 
    
  let info1="SUBJECT:"+text ;
  let info2="FROM:" + sender;
  let info3="DATE:" + Date;
  let string="----------------------------------------------------------"

   
   data.push(info1)
   data.push(info2)
   data.push(info3)
   data.push(string);
  }
 
  let msg=JSON.stringify(data,null,'\t')
  
  client.messages 
  .create({ 
     body: msg, 
     from: 'whatsapp:+14155238886',       
     to: 'whatsapp:' + process.env.TWILIO_NUMBER
   }) 
  .then(message => console.log("Message sent")) 
  .done();
})();




