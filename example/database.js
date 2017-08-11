const alasql = require('alasql')
const fs = require('fs')
const path = require('path')

const tableSchemaList = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8').split(';')
tableSchemaList.forEach(sql => {
    const tableName = /^\s*CREATE\s+TABLE\s+(\w+)/.exec(sql)[1]
    console.log(`Creating table ${tableName}`)
    alasql(sql)
})

const dbData = fs.readFileSync(path.join(__dirname, 'data.sql'), 'utf-8')
console.log('Inserting data')
alasql(dbData)

// console.log(alasql("SELECT * FROM cars"))

// alasql.promise("SELECT * FROM assigned_cars").then(console.log)

const queryAsync = (sql, params) => {
    return alasql.promise(sql, params)
}

module.exports = {
    queryAsync
}