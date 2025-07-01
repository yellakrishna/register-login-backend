import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
// import userData from './routes/user.js'
import dotenv from "dotenv";

const app = express();

import userRouter from "./routes/user.js";


dotenv.config();

const port = process.env.PORT || 5000;



// app.use(cors({
//     origin:"https://register-login-frontend.vercel.app/",
//     credentials:true
// }))


const allowedOrigins = [
  'https://register-login-frontend.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // If you're using cookies or authorization headers
}));

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://register-login-frontend.vercel.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed from this origin'));
//     }
//   },
//   credentials: true // if you use cookies/sessions
// }));


app.use(express.json());
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
