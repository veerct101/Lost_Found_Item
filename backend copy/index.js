require("dotenv").config({ override: true });
const express = require("express");
const path = require("path");
const cors = require("cors");
const USER = require("./models/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/auth");
const r = require("./routes/user");
const rItem = require("./routes/item");
const ITEM = require("./models/item");
const NOTIFICATION = require("./models/notification");

const PORT = process.env.PORT || 8002;
const app = express();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("DB connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cors({
  origin: "https://lost-found-item-f.onrender.com",
  credentials: true
}));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("Token"));

app.use("/user", r);
app.use("/item", rItem);


app.get("/logout", (req, res) => {
  res.clearCookie("Token");

  return res.send({
    msg: "Logged Out",
  });
});

app.get("/notifications", async (req, res) => {
  try {
    const notifications = await NOTIFICATION.find({
      receiver: req.user._id,
    })
      .populate("sender", "userName email")
      .sort({ createdAt: -1 });

    res.send({
      notifications,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      msg: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});
