const flat2Hier = require('../index')
const { buildSchema } = require('graphql')

const database = require('./database')

const schema = buildSchema(`
    type Query {
        allCars(limit: Int): [Car]
        allDrivers(limit: Int): [Driver]
        driver(id: Int!): Driver
    }

    type Car {
        id: Int
        name: String
        licenseNo: String
        addedAt: String
    }

    type Driver {
        id: Int
        firstName: String
        lastName: String
        licenseNo: String
        vehicleType: String
        expiresOn: String
        addedAt: String
        assignedCars: [Car]
    }
`)

const rootResolver = {
    allCars(arg, object, context) {
        console.log('allCars', { arg })
        return database.queryAsync(`
            SELECT 
                id,
                name,
                license_no as \`licenseNo\`,
                added_at as \`addedAt\`
            FROM cars
        `)
    },
    allDrivers(arg, object, context) {
        console.log('allDrivers', { arg })
        return database.queryAsync(`
            SELECT 
                d.id as \`$query_id\`,
                d.first_name as \`$query_firstName\`,
                d.last_name as \`$query_lastName\`,
                d.license_no as \`$query_licenseNo\`,
                d.vehicle_type as \`$query_vehicleType\`,
                d.expires_on as \`$query_expiresOn\`,
                d.added_at as \`$query_addedAt\`,
                c.id as \`$query_$assignedCars_id\`,
                c.name as \`$query_$assignedCars_name\`,
                c.license_no as \`$query_$assignedCars_licenseNo\`,
                c.added_at as \`$query_$assignedCars_addedAt\`
            FROM drivers d
            JOIN assigned_cars asg_c ON asg_c.driver_id == d.id
            JOIN cars c ON asg_c.car_id == c.id
        `).then(rows => {
                // console.log("+++++++++\nORIGINAL\n++++++++\n", rows)
                // console.log("=======================================\n", flat2Hier(rows, true))
                return flat2Hier(rows, true).query
            })
    },
    driver(arg) {
        console.log('driver', { arg })
        const { id } = arg
        return database.queryAsync(`
            SELECT 
                d.id as \`$result_id\`,
                d.first_name as \`$result_firstName\`,
                d.last_name as \`$result_lastName\`,
                d.license_no as \`$result_licenseNo\`,
                d.vehicle_type as \`$result_vehicleType\`,
                d.expires_on as \`$result_expiresOn\`,
                d.added_at as \`$result_addedAt\`,
                c.id as \`$result_$assignedCars_id\`,
                c.name as \`$result_$assignedCars_name\`,
                c.license_no as \`$result_$assignedCars_licenseNo\`,
                c.added_at as \`$result_$assignedCars_addedAt\`
            FROM drivers d
            LEFT JOIN assigned_cars asg_c ON asg_c.driver_id == d.id
            LEFT JOIN cars c ON asg_c.car_id == c.id
            WHERE d.id = ?
        `, [id]).then(rows => flat2Hier(rows, true).result[0])
        // We should get one row only after flat2Hier
    }
}

module.exports = {
    schema,
    rootResolver
}