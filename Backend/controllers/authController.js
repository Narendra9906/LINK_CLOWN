import User from '../models/userModel.js';  // Corrected import

// Login function
const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send("User does not exist");
        }

        // Compare password (consider using hashing/salting passwords for production)
        if (user.password === req.body.password) {
            return res.status(200).send("Success");
        } else {
            return res.status(400).send("Password Incorrect");
        }
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).send("Server error");
    }
};

// Register function
const register = async (req, res) => {
    try {
        // Check if the user already exists based on the email
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send("User already exists");
        }

        // Create a new user with all necessary fields
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,  // Ensure phoneNumber is also passed
        });

        // Save the new user to the database
        await newUser.save();
        return res.status(201).send("User created successfully");
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).send("Server error");
    }
};

// Export the controller functions
export default { login, register };
