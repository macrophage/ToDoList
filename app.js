require("dotenv").config();
const config = require("config");
const express = require("express");
const app = express();

app.use("api/auth", require("./routes/auth.rotes"));

//set mongoose
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const PORT = config.get("port") || process.env.PORT;

async function run() {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);
    app.listen(PORT, () => console.log(`Live on port PORT ${PORT}...`));
  } catch (error) {
    console.log("Server Error: ", error.message);
    process.exit(1);
  }
}

run();
