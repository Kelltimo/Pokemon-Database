var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_kelltimo',
  password        : '4618',
  database        : 'cs340_kelltimo'
});


module.exports.pool = pool;