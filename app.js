const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();

const corsOptions = {
  origin: ["http://10.0.2.2:3000", "http://localhost:3000"], // Replace PORT with your backend port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Add other headers if needed
};

app.use(cors({ origin: "*" }));

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Database connection
async function main() {
    await mongoose.connect(DATABASE_URL);
}

main()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1); // Exit the process if the database connection fails
    });

// Middleware
app.use(express.json());

// Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const requestRoute = require("./routes/addRequest");

app.use("/api/auth", authRoute);
app.use("/api/user",userRoute)
app.use("/api/request", requestRoute)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Chat App" });
});


app.use((err, req, res, next) => {
    const { status = 500, message = "Server Error" } = err;
    res.status(status).json({ message });
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
