const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL =
  "mongodb+srv://admin:admin@reex.xw1tu.mongodb.net/ReEx?retryWrites=true&w=majority";

const databaseName = "ReEx";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect database...");
    }
    console.log("Database connected successfully... ");
    const db = client.db(databaseName);
    db.collection("users").insertOne(
      {
        name: "Kova",
        age: 24,
      },
      (error, result) => {
        if (error) {
          return console.log("Unable to insert ... ");
        }
        console.log(result.ops);
      }
    );
  }
);
