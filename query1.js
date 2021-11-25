/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$group': {
      '_id': '$list.name', 
      'listTitle': {
        '$first': '$list.name'
      }, 
      'count': {
        '$sum': 1
      }
    }
  }, {
    '$project': {
      'listTitle': 1, 
      'count': 1, 
      '_id': 0
    }
  }
];

MongoClient.connect(
  'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB+Compass&ssl=false',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db('task').collection('task');
    coll.aggregate(agg, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  });