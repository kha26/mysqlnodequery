const Query = require('../index');
const expect = require('chai').expect;

describe('#Query', function() {
    it('Basic Select Test', function() {
        let result = Query()
            .select()
            .from(['sneaker', ['user', 'U']])
            .where('uid', '=', 5)
            .orderBy('uid') // .orderBy('uid', 'ASC')
            .orderBy('age', 'DESC')
            .limit(5, 1)
            .query();
        let expected = 'SELECT * FROM `sneaker`, `user` AS U WHERE uid = 5 ORDER BY uid, age DESC LIMIT 1, 5;';
        expect(result).to.equal(expected);
    });
    it('Empty Tables Test', function() {
        let result = 1;
        try {
            q = Query().select().from().query();
        } catch (e) {
            // Passed the test
            result = 2;
        }
        let expected = 2;
        expect(result).to.equal(expected);
    });
    it('Basic Insert Test', function() {
        let result = Query()
            .insert('user')
            .value('name', 'Hasan"')
            .value('age', 22)
            .value('surname', 'Atay')
            .query();
        let expected = 'INSERT INTO `user` (`name`, `age`, `surname`) VALUES ("Hasan\\"", 22, "Atay");';
        expect(result).to.equal(expected);
    });
    it('Basic Delete Test', function() {
        let result = Query()
            .delete()
            .from('user')
            .whereEq('uid', 5)
            .where('age', '>', 20)
            .query();
        let expected = 'DELETE FROM `user` WHERE uid = 5 AND age > 20;';
        expect(result).to.equal(expected);
    });
    it('Basic Update Test', function() {
        let result = Query()
            .update('user')
            .addValues({ name: 'Hasan', age: 22 })
            .whereEq('uid', 1)
            .query();
        let expected = 'UPDATE `user` SET `name` = "Hasan", `age` = 22 WHERE uid = 1;';
        expect(result).to.equal(expected);
    });
});