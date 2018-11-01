var express = require('express');
var router = express.Router();
var rp = require('request-promise');


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/countries', (req, res) => {
  var rmap = new Map();
  rp(' http://northwind.servicestack.net/customers.json', { json: true })
    .then(data => {
      data.Customers.map(d => {
        if (!rmap.get(d.Country)) {
          rmap.set(d.Country, []);
        }
      })
      data.Customers.map(d => {
        if (rmap.get(d.Country)) {
          rmap.get(d.Country).push(d);
        }
      })
      //Map to JSON
      var countires = [];
      rmap.forEach((value, key) => {
        countires.push({ Country: key, City: value })
      });
      res.send(countires);

    })
    .catch(e => console.log('cant get json data', e));
})
router.get('/city/:cityId', (req, res) => {
  var customer;
  rp(' http://northwind.servicestack.net/customers.json', { json: true })
    .then(data => {
      customer = data.Customers.find(cust => cust.Id === req.params.cityId);
      res.send(customer);
    })
})


module.exports = router;
