const express = require('express');
const port = 8000;
const axios = require('axios');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session= require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const mongoStore = require('connect-mongo')(session);
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const {google} = require('googleapis');
//const request = require('request-promise');
const cheerio = require('cheerio');
const https = require('https');
//const professorsList = require('./config/professors');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./assets'));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({
    name: 'nodues',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*100
    },
    store: new mongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, (err) => {
        if (err) {
            console.log('Error in setting up connect-mongo');
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', require('./routes/index'));

app.listen(port, async (err) => {
    if (err) {
        console.log('Error in running the server', err);
        return;
    }
    console.log('Server is running perfectly fine on port: ', port);

    // var data = [];
    // async function scrape(url) {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.goto(url);
    //     for (var j=1; j<26; j++) {
    //         var temp = [];
    //         for (var i=1; i<9; i++) {
    //             var [table] = await page.$x(`//*[@id="contest-app"]/div/div/div[2]/div[2]/table/tbody/tr[${j}]/td[${i}]`);
    //             if (table != null) {
    //                 var txt = await table.getProperty('textContent');
    //                 txt = await txt.jsonValue();
    //             } else {
    //                 txt = '';
    //             }
    //             temp.push(txt);
    //         }
    //         data.push(temp);
    //     }
    //     browser.close();
    // }
    // addToSheet = async () => {
    //     var spreadsheetId = "1ImRA45YLNsLC25ODh8HRTKLMCYteOFR8he6GaeEK6nM";
    //     var auth = new google.auth.GoogleAuth({
    //         keyFile: "credentials.json",
    //         scopes: "https://www.googleapis.com/auth/spreadsheets"
    //     });
    //     var client = await auth.getClient();
    //     var googleSheets = google.sheets({version: "v4", auth: client});
    //     await googleSheets.spreadsheets.values.clear({
    //         auth: auth,
    //         spreadsheetId: spreadsheetId,
    //         range: "Sheet1"
    //     });
    //     await googleSheets.spreadsheets.values.append({
    //     auth: auth,
    //     spreadsheetId: spreadsheetId,
    //     range: "Sheet1",
    //     valueInputOption: "USER_ENTERED",
    //     resource: {
    //         values: data
    //     }
    //     });
    // }
    // for (var x=1; x<11; x++) {
    //     for (var k=35*(x-1)+1; k<35*x+1; k++) {
    //         console.log(k);
    //         await scrape(`https://leetcode.com/contest/biweekly-contest-64/ranking/${k}/`);
    //     }
    //     await addToSheet();
    // }

    var spreadsheetId = "1fdqYc6YxhabH18J07hA0c5f4S_VA_aYfguvLltn17Aw";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({version: "v4", auth: client});
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    });
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    admins_data = data.data.values;
    fs.writeFile('./data/admins.json', JSON.stringify(admins_data), (err) => {
        if (err) {console.log('Error in writing to admins file: ', err); return;}
    });

    var spreadsheetId = "1Z1iuQizDRU_P_tfED0ICzx1k-u-ZaLkO_cWSWOZjul8";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({version: "v4", auth: client});
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    });
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    professors_data = data.data.values;
    fs.writeFile('./data/professors.json', JSON.stringify(professors_data), (err) => {
        if (err) {console.log('Error in writing to professors file: ', err); return;}
    });

    var spreadsheetId = "1cBBIKCdmScEndsOtuSK4OZl4MyNhZxsPNAewyq6MikU";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({version: "v4", auth: client});
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    });
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "ALL"
    });
    students_data = data.data.values;
    fs.writeFile('./data/students.json', JSON.stringify(students_data), (err) => {
        if (err) {console.log('Error in writing to students file: ', err); return;}
    });
});

//client id = 417822814724-2klognhn6le7q43c0vc0tqpn0cbgu053.apps.googleusercontent.com
//client secret = tn3wI5iFPkAawIotSB9IHIX2