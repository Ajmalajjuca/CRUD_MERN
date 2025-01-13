
import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { emailRegex, nameRegex, passwordRegex, phoneRegex } from '../utils/regex.js';
import createToken from '../utils/createToken.js';




export const register = async (req, res) => {

    console.log('user registration initiated:');
    const { username, email, phone, password } = req.body;

    if (!username?.trim() || !email?.trim() || !phone?.trim() || !password) {
        const response = {
            success: false,
            message: "All fields required"
        };
        res.status(400).json(response);
        return;
    }
    if (!emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: "Please provide a valid email address." });
    }
    if (!nameRegex.test(username)) {
        return res
            .status(400)
            .json({ message: "Please provide a valid username." });
    }
    if (!phoneRegex.test(phone)) {
        return res
            .status(400)
            .json({ message: "Please provide a valid phone number." });
    }
    if (!passwordRegex.test(password)) {
        return res
            .status(400)
            .json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
    }

    const existingUser = await userModel.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        return res.status(409).json({ success: false, message: "User Already Exists" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password: hashedPassword,
        });

        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email,
            isAdmin: user.isAdmin
        },
            process.env.JWT_SECRET,
            { expiresIn: '30d' });
        console.log("created token>>", token);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        user.save();



        console.log('created new user:', user);

        res.status(200).json({
            success: true, message: "User Registered successfully",
            user, isAdmin: user.isAdmin, token
        });


    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({ message: "Please provide a valid email address." });
        }


        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        if (user.status === 'blocked') {
            return res.status(401).json({ success: false, message: "User is blocked" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }



        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email,
            isAdmin: user.isAdmin
        },
            process.env.JWT_SECRET,
            { expiresIn: '30d' });
        console.log("created token>>", token);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });


        res.status(200).json({
            success: true, message: "Login successful",
            user, isAdmin: user.isAdmin, token
        });


    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {

    res.clearCookie('access_Token').status(200).json({ success: true, message: "Logged Out", })

}

export const updateProfile = async (req, res) => {
    try {
        console.log('update profile initiated:', req.body);

        const { userId, username, email, phone, password } = req.body;

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({ message: "Please provide a valid email address." });
        }
        if (!nameRegex.test(username)) {
            return res
                .status(400)
                .json({ message: "Please provide a valid username." });
        }
        if (!phoneRegex.test(phone)) {
            return res
                .status(400)
                .json({ message: "Please provide a valid phone number." });
        }
        

        // Find the user by ID
        const user = await userModel.findById(userId);


        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user details
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Handle image upload if provided
        if (req.file) {
            user.profileImage = req.file.path; // Assuming you are using multer for file upload
        }



        // Save the updated user
        await user.save();
        console.log('updated user:', user);



        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteProfile = async (req, res) => {
    
    try {
        const { userId } = req.body;
        console.log('deldete profile innited:',userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId);
        console.log('deliting user is:',user);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await userModel.deleteOne({ _id: userId });
        console.log('deleted user:', user);
        res.status(200).json({ success: true, message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Delete Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}