import mysql  			 from "mysql";

function createDBConnection(){
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'admin',
			database: 'iot-db'
		});
}

module.exports = function() {
	return createDBConnection;
}
