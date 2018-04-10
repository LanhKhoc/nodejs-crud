const md5 = require("md5");
const Model = require("./core");

class LoginModel extends Model {
  constructor() {
    super();
    
    this.table = "user";
    this.checkLogin = this.checkLogin.bind(this);
  }

  checkLogin(username, password, callback) {
    if(!username || !password) {
      return callback({
        error: "Username/Password can't empty!"
      });
    }

    this.pool.getConnection((err, conn) => {
      if(err) throw err;

      const statement = `SELECT * FROM ${this.table} WHERE username = ? AND password = ?`;
      conn.query(statement, [username, md5(password)], (error, results, fields) => {
        if(error) throw error;
        if(results.length == 0) {
          callback({
            error: "Username/Password invalid!"
          })
        } else {
          callback(null);
        }
      })
    })
  }
}

module.exports = LoginModel;