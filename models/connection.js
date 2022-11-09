const { Client } = require('pg')
class Connection {
  static instance = () => (new Client({
    ssl: {
        rejectUnauthorized: false
    }
  }))
}

module.exports = {Connection}