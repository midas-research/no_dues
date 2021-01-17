const express = require('express');
const port = 8000;
const db = require('./config/mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./assets'));
app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if (err) {
        console.log('Error in running the server', err);
        return;
    }
    console.log('Server is running perfectly fine on port: ', port);
})