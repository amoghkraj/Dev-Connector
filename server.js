const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");
const app = express();
const port = process.env.PORT || 5000;

//DB config
const db = require("./config/keys").mongoURI;

//connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/post", post);

app.get("/", (req, res) => res.send("Hello!"));
app.listen(port, () => console.log(`Server running on ${port}`));
