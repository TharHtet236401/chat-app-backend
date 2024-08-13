import User from '../models/user.model.js'
export const getAllUsers = async (req, res) => {
    try{
        console.log(req.user);
       let loggedInUser = req.user._id
       let filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select('-password')
       res.status(200).json(filteredUsers)
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}




