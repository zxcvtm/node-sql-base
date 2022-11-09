const { Connection } = require('./connection')
const { generateDatabaseDateTime } = require('../utils/date')

class User {
  
  static add = async ({
    firstname, lastname, email, password, role
  }) => {
    const client =  Connection.instance()
    await client.connect()
    const response = await client.query(
      `INSERT INTO INTERNAL_USER (
        FIRSTNAME, LASTNAME, EMAIL, PASSWORD, ROLE, ACTIVE, CREATED_DATETIME
      )
      VALUES (
        '${firstname}', '${lastname}' , '${email}', '${password}', '${role}', true, '${generateDatabaseDateTime(new Date())}'
      )
      RETURNING ID;
      `
    )
    await client.end()
    return response.rows[0].id
  }

  static getByEmail = async (email) => {
    const client =  Connection.instance()
    await client.connect()
    const response = await client.query(`SELECT * FROM INTERNAL_USER where email='${email}'`)
    await client.end()
    return response.rows[0]
  }

  static getAll = async () => {
    const client =  Connection.instance()
    await client.connect()
    const response = await client.query(`SELECT * FROM INTERNAL_USER`)
    await client.end()
    return response.rows
  }

  static updatePassword =  async ({email, password}) => {
    try {
      const client =  Connection.instance()
      await client.connect()
      const query = `
        UPDATE INTERNAL_USER
        SET password = '${password}'
        WHERE email = '${email}'
        RETURNING *;
      `
      const response = await client.query(query)

      await client.end()
      return response.rows[0]
    } catch(e) {
      console.log(e)
      return []
    }
  }
}
module.exports = {User}