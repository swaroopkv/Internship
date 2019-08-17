const router = require('express').Router();
const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');
const productController = require('../controllers/productController');
const multer  = require('multer');
const path =require('path');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/files');
	},
	filename: function (req, file, cb) {
		cb(null, 
		file.fieldname + path.extname(file.originalname));
	}
});

var upload = multer({ 
	storage: storage,
 }).single('csvfile');

   function importCsvData2MySQL(filename){
	let stream = fs.createReadStream(filename);
	let csvData = [];
	let csvStream = csv
		.parse()
		.on("data", function (data) {
			csvData.push(data);
		})
		.on("end", function () {
			// -> Remove Header ROW
			csvData.shift();
			
			// -> Create a connection to the database
			const connection = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: 'swift2018',
				database: 'testdb'
			});

			// Open the MySQL connection
			connection.connect((error) => {
				if (error) {
					console.error(error);
				} else {
					let query = 'INSERT INTO products VALUES ?';
					connection.query(query, [csvData], (error, response) => {
						console.log(error || response);
					});
				}
			});
		});

	stream.pipe(csvStream);
}



router.get('/',productController.list);
router.post('/upload',(req,res,next)=>
{ upload(req,res,(error)=>{
    if(error){
        res.send(error)
    }else{
			
			 importCsvData2MySQL("./public/files/csvfile.csv");
			 res.redirect('/');
			 
}
  })
  
})
  

module.exports = router;