let mongoose = require("mongoose");
let dotenv = require("dotenv");
let bcrypt = require("bcrypt");
let logger = require("winston");
dotenv.config();
const schema = require("../app/userService/model/userModel");
const getRandomName = require("../middleware/commonFunction").getRandomName;
const getRandomEmail = require("../middleware/commonFunction").getRandomEmail;

// Connect with MongoDB using mongoose at default port 27017

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function create() {
  for (var i = 1; i <= 30; i++) {
    let payload = {
      fullName: getRandomName(6),
      email: getRandomEmail(6) + i + "@gmail.com",
      password: await bcrypt.hash(
        process.env.DEFAULT_PWD,
        parseInt(process.env.SALT_ROUNDS)
      ),
    };

    let save = await schema(payload).save();
  }

  if (create) {
    logger.info("users created successfully");
    process.exit();
  } else {
    logger.info("An error occurred");
    process.exit();
  }
}

create();
