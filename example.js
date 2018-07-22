const Query = require('./');

        let queryString = Query()
            .insert('user')
            .defaultExpression('createdAt', 'NOW()')
            .whereEqSt('name', 'George')
            .query();

console.log(queryString);