const mongoose = require("mongoose");

const connectionURL =
  "mongodb+srv://admin:admin@reex.xw1tu.mongodb.net/ReEx?retryWrites=true&w=majority";

mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const me = new User({ name: "Kova", age: 24 });

me.save()
  .then((me) => {
    console.log(me);
  })
  .catch((error) => {
    console.log(error);
  });
