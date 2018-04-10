const mysql = require('mysql');

class Model {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit : 100,
      host: "localhost",
      user: "root",
      password: "",
      database: "nodejs_crud"
    });

    this.getAll = this.getAll.bind(this);
  }

  getAll(callback) {
    this.pool.getConnection((error, connection) => {
      if(error) {
        callback(error);
      } else {
        const statement = `SELECT * FROM ${this.table}`;
        connection.query(statement, (err, results, fields) => {
          connection.release();
          callback(err, results);
        });
      }
    })
  }

  getWithConditions(conditions, callback) {
    this.pool.getConnection((error, connection) => {
      if(error) {
        callback(error);
      } else {
        const statement = `SELECT * FROM ${this.table} WHERE ${conditions}`;
        connection.query(statement, (err, results, fields) => {
          connection.release();
          callback(err, results);
        });
      }
    })
  }

  store(data, callback) {
    this.pool.getConnection((error, connection) => {
      if(error) {
        callback(error);
      } else {
        let fields = "";
        let values = "";
        for(let [key, value] of Object.entries(data)) {
          fields += "`" + key + "`,";
          values += `'${value}',`;
        }

        const statement = `INSERT INTO ${this.table} (${fields.slice(0, -1)}) VALUES(${values.slice(0, -1)})`;

        connection.query(statement, (err, results, fields) => {
          connection.release();
          callback(err, results);
        });
      }
    })
  }

  update(conditions, data, callback) {
    this.pool.getConnection((error, connection) => {
      if(error) {
        callback(error);
      } else {
        let update = "";
        for(let [key, value] of Object.entries(data)) {
          update += `${key}='${value}',`;
        }

        const statement = `UPDATE ${this.table} SET ${update.slice(0,-1)} WHERE ${conditions}`;

        connection.query(statement, (err, results, fields) => {
          connection.release();
          callback(err, results);
        });
      }
    })
  }

  destroy(conditions, callback) {
    this.pool.getConnection((error, connection) => {
      if(error) {
        callback(error);
      } else {
        const statement = `DELETE FROM ${this.table} WHERE ${conditions}`;

        connection.query(statement, (err, results, fields) => {
          connection.release();
          callback(err, results);
        });
      }
    })
  }
}

module.exports = Model;
