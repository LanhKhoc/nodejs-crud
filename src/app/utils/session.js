class Session {
  constructor() {
    if (typeof localStorage === "undefined" || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage;
      this.localStorage = new LocalStorage('./scratch');
    }

    this.getSession = this.getSession.bind(this);
    this.setSession = this.setSession.bind(this);
    this.delSession = this.delSession.bind(this);
    this.destroySession = this.destroySession.bind(this);
  }

  getSession(key) {
    const json = this.localStorage.getItem(key);
    const data = JSON.parse(json);
    return data;
  }

  setSession(key, value) {
    const json = JSON.stringify(value);
    this.localStorage.setItem(key, json);
  }

  delSession(key) {
    this.localStorage.removeItem(key);
  }

  destroySession() {
    this.localStorage.clear();
  }
}

module.exports = {
  Session,
};