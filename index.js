const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config')
const rjwt = require('restify-jwt-community')

const server = restify.createServer();

//Middleware
server.use(restify.plugins.bodyParser())
//global lockdown
//server.use(rjwt({secret: config.JWT_SECRET}).unless({path:['/auth']}))



server.listen(config.PORT, () => {
  mongoose.connect(
    config.MONGODB_URI, { useNewUrlParser: true }
  );
})

process.on('unhandledRejection', function(reason, promise) {
    console.log(promise);
});

const db = mongoose.connection;

db.on('error', err => console.log(err))

db.once('open', () => {
  require('./routes/customers')(server)
  require('./routes/register')(server)
  console.log(`server on: ${config.PORT}`);
})
