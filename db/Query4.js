const { MongoClient } = require("mongodb");

async function getUser() {
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
        $group: {
          _id: "$user.id",
          countTweets: {
            $count: {},
          },
          avgRetweet: {
            $avg: "$retweet_count",
          },
        },
      },
      {
        $match: {
          countTweets: {
            $gt: 3,
          },
        },
      },
      {
        $sort: {
          avgRetweet: -1,
        },
      },
      {
        $limit: 10,
      },
    ];

    const user = await tweetCollection.aggregate(agg).toArray();

    console.log(user);

    return user;
  } finally {
    await client.close();
  }
}

module.exports.getUser = getUser;

getUser();
