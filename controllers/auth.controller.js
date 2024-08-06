import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';


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
        console.log("Error in signup",error.message);
        res.status(500).json({ errorMessage: "Internal Server Error"});
    }
};

export const login = (req, res) => {
    res.send('Login route');
};

export const logout = (req, res) => {
    res.send('Logout route');
};
