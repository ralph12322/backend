import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';
import albumRouter from './src/routes/albumRoute.js';

// app config
const app = express();
const port = process.env.PORT; // Remove the fallback 4000 or 10000
if (!port) {
    console.error("PORT is not set by Render!");
    process.exit(1);
}

connectDB();
connectCloudinary();


// middlewares
app.use(express.json());


app.use(cors());


// initializing routes
app.use("/api/song", songRouter)
app.use("/api/album", albumRouter)

app.get('/', (req, res) => res.send("API Working"))


app.listen(port, () => console.log(`Server started on ${port}`))

app.listen(port, '0.0.0.0', () => console.log(`Server started on ${port}`))

