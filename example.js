const Query = require('./');

function test() {
    // TEST 1 : Basic Select Test
    let q = Query()
        .select()
        .from(['sneaker', ['user', 'U']])
        .where('uid', '=', 5)
        .orderBy('uid') // .orderBy('uid', 'ASC')
        .orderBy('age', 'DESC')
        .limit(5, 1)
        .query();
    let expected = 'SELECT * FROM `sneaker`, `user` AS U WHERE uid = 5 ORDER BY uid, age DESC LIMIT 1, 5;';
    console.assert(q === expected, 'Test 1 has failed');

    // TEST 2 : Empty Tables Test
    try {
        q = Query().select().from().query();
        console.assert(false, 'Test 2 has failed');
    } catch (e) {
        // Passed the test
    }

    // TEST 3 : Basic Insert Test
    q = Query()
        .insert('user')
        .value('name', 'Hasan"')
        .value('age', 22)
        .value('surname', 'Atay')
        .query();
    expected = 'INSERT INTO `user` (`name`, `age`, `surname`) VALUES ("Hasan\\"", 22, "Atay");';
    console.assert(q === expected, 'Test 3 has failed.');

    // TEST 4 : Basic Delete Test
    q = Query()
        .delete()
        .from('user')
        .whereEq('uid', 5)
        .where('age', '>', 20)
        .query();
    expected = 'DELETE FROM `user` WHERE uid = 5 AND age > 20;';
    console.assert(q === expected, 'Test 4 has failed.');

    // TEST 5 : Basic Update Test
    q = Query()
        .update('user')
        .addValues({ name: 'Hasan', age: 22 })
        .whereEq('uid', 1)
        .query();
    expected = 'UPDATE `user` SET `name` = "Hasan", `age` = 22 WHERE uid = 1;';
    console.assert(q === expected, 'Test 5 has failed.');

    console.log('SQL Query Builder has passed all tests!');
}

test();