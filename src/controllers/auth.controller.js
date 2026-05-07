const userModel = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
	try {
		const { username, email, password, role = 'user' } = req.body;

		const isUserAlreadyExists = await userModel.findOne({
			$or: [
				{ username },
				{ email }
			]
		});

		if (isUserAlreadyExists) {
			return res.status(409).json({ message: 'Username or email already exists' });
		}
        const hash = await bcrypt.hash(password, 10);

		const user = await userModel.create({
			username,
			email,
			password: hash,
			role
		});

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role,
			},
			process.env.JWT_SECRET
		);

		res.cookie('token', token);

		return res.status(201).json({
			message: 'User registered successfully',
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: 'Registration failed', error: error.message });
	}
}
async function loginUser(req, res) {
	try {
		const { username, email, password } = req.body;

		const user = await userModel.findOne({
			$or: [
				{ username },
				{ email }
			]
		});
		if(!user){
			return res.status(404).json({ message: 'Invalid Credentials' });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role,
			},
			process.env.JWT_SECRET
		);

		res.cookie('token', token);

		return res.status(200).json({
			message: "User Logged in successful",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			}
		});
	} catch (error) {
		return res.status(500).json({ message: 'Login failed', error: error.message });
	}
}
async function logoutUser(req, res) {
	res.clearCookie('token');
	res.status(200).json({ message: 'User logged out successfully' });
}

module.exports = { registerUser, loginUser, logoutUser };
