import { config } from "dotenv";
import express from "express";
import userRoutes from "./routes/answerRoutes.js";
import router from "./routes/formRoutes.js";
import connectDb from "./config/dbConfig.js";
import answerRoutes from "./routes/answerRoutes.js";

config();
const app = express();

app.use(express.json());
connectDb();

const port = process.env.PORT;

app.use("/api", router);
app.use("/api", answerRoutes);

app.listen(port, () => {
  console.log("server is running", port);
});
