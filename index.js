const express = require('express');
const app = express();
const mongoose = require('mongoose');
const posts = require('./route/post');
const users = require('./route/user');


mongoose.connect('mongodb://localhost/playgrount')
.then(()=> {
    console.log('Connecting to MONGODB....')
     const port = process.env.PORT||3000;
    app.listen(port, () => console.log('Listening on port....',port));
})
// .catch(err => console.log('Not Connecting to MONGODB...', err))


app.use(express.json());
app.use('/api/post',posts)
app.use('/api/user', users)
