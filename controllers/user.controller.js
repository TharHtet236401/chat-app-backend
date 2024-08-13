import User from '../models/user.model.js'


export const getAllUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id; // Extract logged-in user's ID
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } })
                                         .select('-password'); // Exclude password from results

        // Check if users were found
        if (filteredUsers.length === 0) {
            return res.status(404).json({ message: "No other users found." });
        }

        res.status(200).json(filteredUsers); // Return filtered users
    } catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
}