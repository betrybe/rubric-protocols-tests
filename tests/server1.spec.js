const ngrok = require('ngrok');
const fs = require('fs');
const puppeteer = require('puppeteer');
//var execTerminal = require('child_process').exec, child;
var spawn = require('child_process').spawn
var shell = require('shelljs');

const BASE_URL = 'http://localhost:4040/inspect/http';

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

function wait(time) {
    const start = Date.now();
    while (true) {
      if (Date.now() - start >= time) {
        return true;
      }
    }
  }

describe('Responder o IP do client', () => {
    it('Será validado que ao acessar a url sera possível visualizar o ip do client', async (done) => {  
        const instructions = fs.readFileSync('./instruction.json', 'utf8');
        const instructionsString = JSON.parse(instructions.toString());
        await ngrok.authtoken(instructionsString.token);
         const url2 = await ngrok.connect(8080);
         browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
         page = await browser.newPage();

         const client = spawn('node', ['src/index.js', '&']);
         client.stdout.setEncoding('utf8');
         client.stdout.on('data', ()=>{done(); });
        // shell.exec('node src/index.js');
      wait(2000);
      await page.goto(BASE_URL);
      wait(2000);
  
      await page.waitForSelector('a[target="_blank"]');
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
  
      newPage = await browser.newPage();
  
      newPage.goto(url[1]);
      await newPage.waitForSelector(dataTestid('ip'));
  
      const textIp = await newPage.$$eval(dataTestid('ip'), (nodes) => nodes.map((n) => n.innerText));
      expect(textIp).not.toBeNull();
      //
      //await ngrok.disconnect(url2); // stops one
      //await ngrok.disconnect(); // stops all
      await ngrok.kill(); 
     // await browser.close();
      //execNode.kill();
     // wait(3000);
     client.stdout.on('close', (data)=>{
       data.kill();
       done(); });
     client.stdout.on('exit', (data)=>{
       data.kill();
      done(); });
     //client.kill();
     //
     wait(3000);
    });
  });