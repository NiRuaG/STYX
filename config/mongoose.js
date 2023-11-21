const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/styxgame";

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const connectWithRetry = () => {
  if (connectRetryAttemptNum > 5) {
    console.error("No mongoose connection made, max retry attempts reached.");
    return;
  }

  console.log(
    "mongoose connection with retry, attempt " + connectRetryAttemptNum++
  );
  mongoose.connect(MONGODB_URI, options).catch((e) => {
    console.log("Mongoose could not make connection: " + e);
    setTimeout(connectWithRetry, 500);
  });
};

let connectRetryAttemptNum = 1;
connectWithRetry();

//* CONNECTION EVENTS

// When successfully connected
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open to " + MONGODB_URI);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = mongoose;
