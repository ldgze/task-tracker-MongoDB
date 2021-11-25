const { MongoClient } = require("mongodb");

async function getTweets() {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("task");

    const tweetCollection = db.collection("task");

    const agg = [
      {
        $lookup: {
          from: "task",
          localField: "_id",
          foreignField: "assignee",
          as: "assignedTasks",
        },
      },
      {
        $unwind: {
          path: "$assignedTasks",
        },
      },
      {
        $group: {
          _id: "$_id",
          count: {
            $sum: 1,
          },
          userID: {
            $last: "$userID",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const tweet = await tweetCollection.find(query).count();

    console.log(tweet);

    //return tweet;
  } finally {
    await client.close();
  }
}

module.exports.getTweets = getTweets;

getTweets();
