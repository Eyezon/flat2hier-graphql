# flat2hier-graphql

Folds your JOINNED sql rows into a hierarchy of objects suitable for graphql response.

## Get started

```bash
npm install --save flat2hier-graphql
```

## How it works

flat2hier exposes a single function `flat2hier(rows: Array<Object>, removeDollor: boolean): Array<Object> | Object`

It takes an array of object and groups the objects by the follwing rules/convention and returns an array
#### Conventions
  
  + For each row it splits each keys by `_` say level_keys
  + For each level key it adds an object or array for its value if it is not the last level_keys
  + If a level_key starts with `$` it adds an array, otherwise an object
  + If level_key starts with `$` and it has a child level key `id` it uses that id for subsequest row to insert in that same object in the array

## Usage

Pass your row result renamed using `_` for indention and pass it to `flat2hier`

_P.S_ When using sql as to rename column u may quote them as some database like postgres otherwise doesn't preserve case.

```javascript
const flat2hier = require('flat2hier')
const sqlRow = [ {
    $query_id: '1',
    $query_firstName: 'Ramu',
    $query_lastName: 'Pal',
    $query_$assignedCars_id: '1',
    $query_$assignedCars_name: 'Toyota XI',
    $query_$assignedCars_licenseNo: 'WB XX XXXX'
}, {
    $query_id: '1',
    $query_firstName: 'Ramu',
    $query_lastName: 'Pal',
    $query_$assignedCars_id: '2',
    $query_$assignedCars_name: 'Toyota XII',
    $query_$assignedCars_licenseNo: 'HR XX XXXX'
}, {
    $query_id: '2',
    $query_firstName: 'Sanatan',
    $query_lastName: 'Sarkar',
    $query_$assignedCars_id: '4',
    $query_$assignedCars_name: 'Seadan V5',
    $query_$assignedCars_licenseNo: 'WB XXX XXXX'
}]

flat2hier(sqlRow)
/* Returns: (note pass true as 2nd param to flat2hier if u want to remove the leading $ sign)
{ '$query':
   [ { id: '1',
       firstName: 'Ramu',
       lastName: 'Pal',
       '$assignedCars':
        [ { id: '1', name: 'Toyota XI', licenseNo: 'WB XX XXXX' },
          { id: '2', name: 'Toyota XII', licenseNo: 'HR XX XXXX' } ] },
     { id: '2',
       firstName: 'Sanatan',
       lastName: 'Sarkar',
       '$assignedCars': [ { id: '4', name: 'Seadan V5', licenseNo: 'WB XXX XXXX' } ] } ] }
*/
```



# Examples

Suppose we have two tables

TABLE 1 **cars**

<table>
    <thead>
        <tr>
            <th>Column Name</th>
            <th>Datatype</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>id</td>
            <td>INT</td>
        </tr>
        <tr>
            <td>name</td>
            <td>VARCHAR</td>
        </tr>
        <tr>
            <td>license_no</td>
            <td>VARCHAR</td>
        </tr>
    </tbody>
</table>

TABLE 2 **drivers**

<table>
    <thead>
        <tr>
            <th>Column Name</th>
            <th>Datatype</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>id</td>
            <td>INT</td>
        </tr>
        <tr>
            <td>first_name</td>
            <td>VARCHAR</td>
        </tr>
        <tr>
            <td>last_name</td>
            <td>VARCHAR</td>
        </tr>
    </tbody>
</table>

And every driver is assigned to zero or more cars using another table

TABLE 3 **assigned_cars**

<table>
    <thead>
        <tr>
            <th>Column Name</th>
            <th>Datatype</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>car_id</td>
            <td>INT</td>
        </tr>
        <tr>
            <td>driver_id</td>
            <td>INT</td>
        </tr>
    </tbody>
</table>

Now, Suppose we have a graphql schema like:
```typescript
type Query {
    allCars(limit: Int): [Car]
    allDrivers(limit: Int): [Driver]
    driver(id: Int!): Driver
}

type Car {
    id: Int
    name: String
    licenseNo: String
}

type Driver {
    id: Int
    firstName: String
    lastName: String
    assignedCars: [Car]
}
```

For resolving allDrivers we can retrive all rows using sql join. But we need to group by driver and make an array of Car for same driver. `flat2hier` does this using some simple convention. e.g.

```javascript
return database.queryAsync(`
    SELECT 
        d.id as \`$query_id\`,
        d.first_name as \`$query_firstName\`,
        d.last_name as \`$query_lastName\`,
        c.id as \`$query_$assignedCars_id\`,
        c.name as \`$query_$assignedCars_name\`,
        c.license_no as \`$query_$assignedCars_licenseNo\`,
    FROM drivers d
    JOIN assigned_cars asg_c ON asg_c.driver_id == d.id
    JOIN cars c ON asg_c.car_id == c.id
`).then(rows =>  flat2Hier(rows, true).query)
```

#### Convention used in flat2hier

  flat2hier folds your array of row by

  + Breaking each key/col name by `_`, and add the partial key into a object hierarchy(new object if at top level otherwise at current level). e.g. `user_mailbox_certs_ssl128` => `{ user: { mailbox: { certs: { ssl128: <value> } } } }`
  + If a partial key(after splitting by `_`) starts with `$` instead of adding a object for that key, it adds an array of object. e.g. `$query_queryMetadata_sender_id` => `{$query: [ { queryMetadata: { sender: {id: <value>}} } ]}`
  + If it finds another partial key with starting with a `$` and has a partial key child with name `id` it tries to find a object in the same key with matching `id`, if it finds one it creates object at current level and append in the array it just found.

**For `flat2hier` 's usage see `example/graphql.js` file**


### Running included examples

+ Clone this repository
+ Install dev dependencies
+ run example/server.js with nodejs

```bash
git clone https://github.com/Eyezon/flat2hier-graphql
yarn install # or npm install
node example/server.js
```
