const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts.js');
const cors = require('cors');
const path = require('path');

dotenv.config();

// middleware 

app.use(express.json());
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(helmet());
app.use(morgan('common'));

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => {
        console.log("Connected to MongoDb!");
    }
    ).catch((err) => {
        console.log(err)
    });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File uploaded successfully!");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen("8800", () => {
    console.log('Server is running on port 8800!');
});