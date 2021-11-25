const { MongoClient } = require("mongodb");

async function getScreenNames() {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("ieeevisTweets");

    const tweetCollection = db.collection("tweet");

    const agg = [
      {
        $sort: {
          "user.followers_count": 1,
        },
      },
      {
        $group: {
          _id: "$user.id",
          numberOfFollowers: {
            $last: "$user.followers_count",
          },
          screenName: {
            $last: "$user.screen_name",
          },
        },
      },
      {
        $sort: {
          numberOfFollowers: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          screenName: 1,
          _id: 0,
        },
      },
    ];

    const screenNames = await tweetCollection.aggregate(agg).toArray();

    console.log(screenNames);

    return screenNames;
  } finally {
    await client.close();
  }
}

module.exports.getScreenNames = getScreenNames;

getScreenNames();
