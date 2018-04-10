const Model = require("./core");

class UserModel extends Model {
  constructor() {
    super();
    
    this.table = "user";
  }
}

module.exports = UserModel;