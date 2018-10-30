const errors = require('restify-errors');
const Customer = require('../Models/Customer')

module.exports = server => {

  //get customer
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({})
      res.send(customers)
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err))
    }
  });

  //Get customer by id
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id)
      res.send(customer)
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`No customer with id of ${req.params.id}`))
    }
  });

  //post data
  server.post('/customers', async (req, res, next) => {
    if(!req.is('application/json')){
      return next(new errors.InvalidContentError("Expects 'application/json'"))
    }

    const {name, email, balance} = req.body;
    const customer = new Customer({
      name,
      email,
      balance
    })

    try {
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message))
    }
  })


  //put data
  server.put('/customers/:id', async (req, res, next) => {
    if(!req.is('application/json')){
      return next(new errors.InvalidContentError("Expects 'application/json'"))
    }

    try {
      const customer = await Customer.findOneAndUpdate({ _id: req.params.id}, req.body);
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`Cant update with id ${req.params.id}`))
    }
  })

  //delete
  server.del('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id});
      res.send(204);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`Cant delete with id ${req.params.id}`))
    }
  })
}
