const { newDb, DataType } = require('pg-mem');

const db = newDb();
db.public.registerFunction({
  name: 'now',
  returns: DataType.timestamp,
  implementation: () => new Date(),
});

const { Pool } = db.adapters.createPg();
const pool = new Pool();

module.exports = {
  Pool: function () {
    return pool;
  },
};
