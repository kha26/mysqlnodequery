nodemysqlquery
==============
A Node.js library to easily create MySQL queries.
## Installation
`npm install nodemysqlquery`
## Basic Usage
```js
let queryString = Query()
    .select()
    .from('users')
    .whereEq('noPets', 5) // .where('noPets', '=', 5) is also valid
    .where('age', '>', 25)
    .query();
console.log(queryString); // # SELECT * FROM `users` WHERE noPets = 5 AND age > 25;

let queryString = Query()
    .insert('user')
    .value('name', 'George')
    .value('age', 25)
    .query();
console.log(queryString); // # INSERT INTO `user` (`name`, `age`) VALUES ("George", 25);

let queryString = Query()
    .delete()
    .from('user')
    .whereEqSt('name', 'George')
    .query();
console.log(queryString); // # DELETE FROM `user` WHERE name = "George";

let queryString = Query()
  .update('user')
  .addValues({
    name: 'Michael',
    age: 30 })
  .whereEqSt('name', 'George')
  .query();
console.log(queryString); // # UPDATE `user` SET `name` = "Michael", `age` = 30 WHERE name = "George";
```
When comparing a column to a string, you must use ```whereSt()``` or ```whereEqSt()``` functions, because these functions configures the query accordingly. For example if you say, ```whereEq('name', 'George')``` the query will be like ```WHERE name = George``` which is not what we want.

To add a dictionary of values you can just use the ```.addValues()``` function instead of having to write them one by one.

# Advanced Usage
```js
// LIMIT & OFFSET
let queryString = Query().select().from('user')
    .limit(5)
    .query(); // # SELECT * FROM `user` LIMIT 5;

let queryString = Query().select().from('user')
    .limit(5, 10)
    .query(); // # SELECT * FROM `user` LIMIT 10, 5;

// ORDER BY
let queryString = Query().select().from('user')
    .orderBy('name')
    .orderBy('age', 'DESC')
    .orderBy('noPets', 'ASC')
    .query(); // # SELECT * FROM `user` ORDER BY name, age DESC, noPets;

// Default MySQL expressions
let queryString = Query()
    .insert('user')
    .defaultExpression('createdAt', 'NOW()')
    .whereEqSt('name', 'George')
    .query(); // # INSERT INTO `user` (`createdAt`) VALUES (NOW()) WHERE name = "George";

// Multiple Tables and Aliases
let queryString = Query().select()
            .from(['post', ['user', 'U']])
            .whereEq('post.user', 'U.id')
            .query(); // # SELECT * FROM `post`, `user` AS U WHERE post.user = U.id;
```

```.from()``` accepts either a string or an array. If it's a string it must be a table name, if its an array it can contain two types of obects: a string or another array of two strings. For example ```.from([['post', 'P'], 'user', ['comment', 'C'], 'payment'])``` will give us the tables: ```post AS P, user, comment AS C, payment```.
## Tests
`npm test`