const controller = {};

controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM products', (err, products) => {
     if (err) {
      res.json(err);
     }
     //res.send(products);
     res.render('products', {
        data: products
     });
    });
  });
};



  module.exports = controller;