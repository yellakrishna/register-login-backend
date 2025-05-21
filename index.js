import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
// import userData from './routes/user.js'
import dotenv from "dotenv";

const app = express();
app.use(express.json());
import userRouter from "./routes/user.js";


dotenv.config();

const port = process.env.PORT || 5000;



app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use(cookieParser())

app.use("/yella", userRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log("mongodb is connected"))
  .catch((err) => console.log("not connect DB", err));

app.get("/", (req, res) => {
  res.send("hello world");
});

// app.use('/yella', userData)

app.listen(port, () => console.log(`server is running ${port} ...`));
