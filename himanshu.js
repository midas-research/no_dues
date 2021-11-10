var data = [];
async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    for (var j=1; j<26; j++) {
        var temp = [];
        for (var i=1; i<9; i++) {
            var [table] = await page.$x(`//*[@id="contest-app"]/div/div/div[2]/div[2]/table/tbody/tr[${j}]/td[${i}]`);
            if (table != null) {
                var txt = await table.getProperty('textContent');
                txt = await txt.jsonValue();
            } else {
                txt = '';
            }
            temp.push(txt);
        }
        data.push(temp);
    }
    browser.close();
}
addToSheet = async () => {
    var spreadsheetId = "1ImRA45YLNsLC25ODh8HRTKLMCYteOFR8he6GaeEK6nM";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({version: "v4", auth: client});
    await googleSheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    await googleSheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    resource: {
        values: data
    }
    });
}
for (var x=1; x<11; x++) {
    for (var k=35*(x-1)+1; k<35*x+1; k++) {
        console.log(k);
        await scrape(`https://leetcode.com/contest/biweekly-contest-64/ranking/${k}/`);
    }
    await addToSheet();
}