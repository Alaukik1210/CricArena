import express,{ Express } from "express";
import dotenv from "dotenv"
import userRouter from "./routes/user.routes";
import tour from "./routes/TourDetails.route";
import team from "./routes/team.routes"
import profile from "./routes/P_profile.routes"
import ground from "./routes/ground.route"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()
const app:Express = express();
app.use(express.json());
app.use(cors())
app.use(cookieParser());
app.use('/api/v1/user',userRouter);
app.use('/api/v1/ground',ground);
app.use('/api/v1/owner/tours',tour);
app.use('/api/v1/user/team',team);
app.use('/api/v1/user/profile',profile);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT)
})
