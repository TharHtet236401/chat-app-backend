import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';



export const signup = async (req, res) => {
    try {
        const {fullName,username,password,confirmPassword,gender} = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        let user = await User.findOne({username});
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        //hash password//
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        let boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        let girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    
        const newUser = new User(
            {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
            }
        );

        if (newUser) {
            await newUser.save();
            generateTokenAndSetCookie(res, newUser._id);
            res.status(201).json({
                _id :newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                gender:newUser.gender,
                profilePic: newUser.profilePic
            });
        }else{
            return res.status(400).json({ message: 'User not created' });
        }


    } catch (error) {
        
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) { // Check if user exists first
            return res.status(400).json({ message: 'Invalid Username or Password' }); // User not found error
        }

        const isPasswordMatch = await bcryptjs.compare(password, user?.password || ""); 
        if (!isPasswordMatch) { 
            return res.status(400).json({ message: 'Invalid Username or Password' }); // Invalid credentials error
        }

        generateTokenAndSetCookie(res, user._id);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login", error.message); // Corrected error message
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try{
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    }catch(error){
        console.log("Error in logout", error.message);
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
};