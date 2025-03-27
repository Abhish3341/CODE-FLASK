const express = require('express');
const app = express();
const { DBConnection } = require('./database/db.js');
const User = require('./models/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
DBConnection();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log("Request body:", req.body); // Log the request body

        // Check if user is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Encrypt the password
        if (!password) {
            return res.status(400).send("Password is required");
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        console.log("Hashed password:", hashPassword);

        // Save the user in the database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        });

        // Generate token
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: '1h'  // expires in 1 hour
        });
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/login", async (req, res) => { // Declare the function as async
    try {
        // Get all the user data
        const { email, password } = req.body;

        // Check that all the data should exist
        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        // Match the password
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        // Generate token
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: '1h'  // expires in 1 hour
        });
        user.token = token;
        user.password = undefined;
        res.status(200).json({
            message: "Login successful",
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});