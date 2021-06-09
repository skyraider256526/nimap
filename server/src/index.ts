import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import routes from "./routes";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.PORT;

const app = express();

app
  // Allows React to make HTTP requests
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/api", routes);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Test");
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
