var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost:3306",
  user: "kiyoko",
  password: "",
  database: "convenience_store"
});

con.connect(function(err) {
  if (err) throw err;
  //Select all customers and return the result object:
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});