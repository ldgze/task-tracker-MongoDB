const { MongoClient } = require("mongodb");

async function separateUser() {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("ieeevisTweets");

    const tweetCollection = db.collection("tweet");

    const agg1 = [
      {
        $group: {
          _id: "$user.id",
          user: {
            $last: "$user",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$user",
        },
      },
      {
        $out: "User_Only",
      },
    ];

    const agg2 = [
      {
        $set: {
          user: "$user.id",
        },
      },
      {
        $out: "Tweets_Only",
      },
    ];

    await tweetCollection.aggregate(agg1).toArray();

    console.log("User_Only collection created");

    await tweetCollection.aggregate(agg2).toArray();

    console.log("Tweets_Only collection created");
  } finally {
    await client.close();
  }
}

module.exports.separateUser = separateUser;

separateUser();
