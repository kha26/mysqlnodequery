"use strict";

class Query {
    constructor() {
        this.method = 'select';
        this.cols = [];
        this.wheres = [];
        this.tables = [];
        this.orders = [];
        this.limitQ = '';
    }

    insert(into) {
        this.method = 'insert';
        this.valPair = {};
        if (typeof into === 'string') {
            this.tables = [`\`${into}\``];
        } else {
            throw new Error('Invalid table name format, must be a string.');
        }
        return this;
    }

    update(into) {
        this.method = 'update';
        this.valPair = {};
        if (typeof into === 'string') {
            this.tables = [`\`${into}\``];
        } else {
            throw new Error('Invalid table name format, must be a string.');
        }
        return this;
    }

    delete() {
        this.method = 'delete';
        return this;
    }

    select(cols) {
        this.method = 'select';
        if (cols instanceof Array) {
            this.cols = cols;
        } else {
            this.cols = [];
        }
        return this;
    }

    from(tables) {
        if (tables instanceof Array) {
            this.tables = tables;
            for (let i = 0; i < this.tables.length; i++) {
                if (typeof this.tables[i] === 'string') {
                    this.tables[i] = `\`${this.tables[i]}\``;
                } else if (this.tables[i] instanceof Array && this.tables[i].length > 0) {
                    const alias = (this.tables.length > 1 ? ` AS ${this.tables[i][1]}` : '');
                    this.tables[i] = `\`${this.tables[i][0]}\`${alias}`; // `users` AS U
                } else {
                    console.error(`Wrong type for table: ${this.tables[i]}`);
                }
            }
        } else if (typeof tables === 'string') {
            this.tables[0] = `\`${tables}\``;
        }
        return this;
    }

    where(col1, op, col2) {
        const ops = ['=', '>', '<', '<=', '>=', 'LIKE']; // More to come
        if (ops.indexOf(op.toUpperCase()) > -1) {
            const w = `${col1} ${op} ${col2}`;
            this.wheres.push(w);
        } else {
            console.error(`Operator "${op}" is an invalid operator`);
        }
        return this;
    }

    whereSt(col1, op, col2) {
        return this.where(col1, op, `"${col2.replace(/"/g, '\\"')}"`);
    }

    whereEq(col1, col2) {
        const w = `${col1} = ${col2}`;
        this.wheres.push(w);
        return this;
    }

    whereEqSt(col1, col2) {
        return this.whereEq(col1, `"${col2.replace(/"/g, '\\"')}"`);
    }

    value(col, val) {
        if (typeof col !== 'string') {
            throw new Error('Invalid type for column. Must be a string.');
        }

        const column = `\`${col}\``;
        let value = val;
        if (typeof value === 'string') {
            value = value.replace(/"/g, '\\"');
            value = `"${value}"`;
        } else if (val === undefined) {
            value = 'NULL';
        }
        this.valPair[column] = value;
        return this;
    }

    defaultExpression(col, exp) {
        if (typeof col !== 'string') {
            throw new Error('Invalid type for column. Must be a string.');
        }

        const column = `\`${col}\``;
        this.valPair[column] = exp;
        return this;
    }

    addCurrentTime(col) {
        if (typeof col !== 'string') {
            throw new Error('Invalid type for column. Must be a string.');
        }

        const column = `\`${col}\``;
        this.valPair[column] = 'CURRENT_TIMESTAMP()';
        return this;
    }


    addValues(dic) {
        if (typeof dic !== 'object') {
            throw new Error('Invalid type for values. Must be a dictionary');
        }
        let a = this;
        Object.entries(dic).forEach(([key, value]) => {
            a = this.value(key, value);
        });
        return a;
    }

    orderBy(col, dir) {
        if (dir === 'DESC') {
            this.orders.push([col, -1]);
        } else {
            this.orders.push([col, 1]);
        }
        return this;
    }

    limit(limit, offset) {
        if (Number.isNaN(limit)) {
            throw new Error('Invalid type for limit. Needs to be an integer.');
        }
        if (!Number.isNaN(offset)) {
            this.limitQ = ` LIMIT ${offset}, ${limit}`;
        } else {
            this.limitQ = ` LIMIT ${limit}`;
        }
        return this;
    }

    query() {
        let query = '';
        if (this.method === 'select') {
            let cols = '*';
            if (this.cols.length > 0) {
                cols = this.cols.join(', ');
            }
            query = `SELECT ${cols} FROM `;

            if (this.tables.length < 1) {
                throw new Error('No database tables were found');
            }
            const tables = this.tables.join(', ');
            query += tables;
        } else if (this.method === 'insert') {
            query = `INSERT INTO ${this.tables[0]}`;

            const cols = Object.keys(this.valPair).join(', ');
            query += ` (${cols}) `;

            const vals = Object.values(this.valPair).join(', ');
            query += `VALUES (${vals})`;
        } else if (this.method === 'delete') {
            query = `DELETE FROM ${this.tables[0]}`;
        } else if (this.method === 'update') {
            query = `UPDATE ${this.tables[0]} SET `;

            const updates = [];
            Object.entries(this.valPair).forEach(([key, value]) => {
                updates.push(`${key} = ${value}`);
            });
            query += updates.join(', ');
        }

        if (this.wheres.length > 0) {
            const wheres = ` WHERE ${this.wheres.join(' AND ')}`;
            query += wheres;
        }

        if (this.orders.length > 0) {
            let ordersText = ' ORDER BY ';
            for (let i = 0; i < this.orders.length; i++) {
                const order = this.orders[i];
                const pre = i === 0 ? '' : ', ';
                ordersText += pre + order[0] + (order[1] === 1 ? '' : ' DESC');
            }
            query += ordersText;
        }


        query += `${this.limitQ};`;
        return query;
    }
}

module.exports = function () {
    return new Query();
};
