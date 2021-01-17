const express = require('express');
const port = 8000;

const app = express();

app.use('/', require('./routes/index'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, (err) => {
    if (err) {
        console.log('Error in running the server', err);
        return;
    }
    console.log('Server is running perfectly fine on port: ', port);
})