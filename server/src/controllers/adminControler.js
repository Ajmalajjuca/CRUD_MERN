import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import { emailRegex, nameRegex, passwordRegex, phoneRegex } from '../utils/regex.js';




export const adminlogin = async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    if (!emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: "Please provide a valid email address." });
    }
    if (!passwordRegex.test(password)) {
        return res
            .status(400)
            .json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
    }
    try {
        const user = await userModel.findOne({ email: email, isAdmin: true });
        if (!user) {
            return res.status(404).json({ message: "This email is not registered as an admin" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }
        console.log('login new user:', user);
        
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' })
        console.log('token>>>:', token);


        res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000 })
            .status(200)
            .json({ success: true, message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}

export const getAllUsers = async (req, res) => {
    try {
        const user = await userModel.find({})
        res.status(200).json({ success: true, users: user });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('userId:', id);
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, password } = req.body;

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
        

        const updateData = { username, email, phone, };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            updateData.password = hashedPassword;
        }
        const user = await userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User updated successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await userModel.findByIdAndUpdate(id);


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.status = status;
        await user.save();

        res.status(200).json({ success: true, message: "User status updated successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const createUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        if (username === '' || email === '' || phone === '' || password === '') {
            return res.status(400).json({ message: "All fields are required" });
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
            return res.status(400).json({ message: "User already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({ username, email, phone, password: hashedPassword });


        res.status(201).json({ success: true, message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}