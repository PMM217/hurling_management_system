// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// require('dotenv').config({ path: './config.env' });

// //Helper function to generate JWT token
// const generateToken = (userId, role) => {
//     return jwt.sign(
//         { userId, role },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' } // Token expires in 1 hour
//     );
// };

// //Register user - keeping existing logic, just updating the response
// exports.registerUser = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;
        
//         //Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         //Create new user
//         const user = new User({
//             name,
//             email,
//             password, // Note: In a future update, we should hash this password
//             role: role || 'player' // Default to player if no role specified
//         });

//         await user.save();

//         //Generate JWT token for immediate login after registration
//         const token = generateToken(user._id, user.role);

//         res.status(201).json({
//             message: "Registration successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ 
//             message: "Error registering user",
//             error: error.message 
//         });
//     }
// };

// //Login user - modified to use JWT
// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         //Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         //Check password (simple check for now)
//         if (password !== user.password) { // Note: In future update, use proper password comparison
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         //Generate JWT token
//         const token = generateToken(user._id, user.role);

//         //Send response with token and user data
//         res.json({
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ message: "Error during login" });
//     }
// };

// //New middleware to verify JWT token
// exports.verifyToken = (req, res, next) => {
//     try {
//         //Get token from header
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ message: "No token provided" });
//         }

//         //Extract token from Bearer string
//         const token = authHeader.split(' ')[1];

//         //Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         //Add user data to request object
//         req.user = decoded;
        
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };