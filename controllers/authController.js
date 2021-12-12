const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let refreshTokens = []

exports.register = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(req.body.password, salt)

		const invalidUser = await User.findOne({ username: req.body.username })
		if (invalidUser !== null) {
			return res.status(500).send({
				status: false,
				message: `${req.body.username} is already registered. Please use another name.`,
			})
		}

		const newUser = await new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		})

		const user = await newUser.save()
		res.status(200).json({
			status: true,
			data: user,
		})
	} catch (err) {
		res.status(500).send({
			error: err,
		})
	}
}

const generateAccessToken = user => {
	return jwt.sign(
		{ username: user.username, isAdmin: user.isAdmin },
		process.env.TOKEN_KEY,
		{
			expiresIn: "50m",
		}
	)
}

const generateRefreshToken = user => {
	return jwt.sign(
		{ username: user.username, isAdmin: user.isAdmin },
		process.env.REFRESH_TOKEN_KEY
	)
}

// global session
let session

exports.login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
			.populate("profilePicture", "-__v")
			.select("-__v")

		if (!user) res.status(404).json("User not found.")

		res.cookie("user email", user.email)
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		)

		console.log(req.body.password, user.password, validPassword)
		if (!validPassword) res.status(401).json("invalid email or password")

		// generate tokens
		const accessToken = generateAccessToken(user)
		const refreshToken = generateRefreshToken(user)
		refreshTokens.push(refreshToken)

		// session
		session = req.session
		session.email = req.body.email
		session.username = user.username

		res.status(200).json({
			username: user.username,
			isAdmin: user.isAdmin,
			accessToken,
			refreshToken,
			profilePicture: user.profilePicture,
		})
	} catch (err) {
		res.status(500).send(err)
	}
}

exports.logout = async (req, res) => {
	res.clearCookie()
	req.session.destroy()
	const refreshToken = req.body.token
	refreshTokens = refreshTokens.filter(token => token !== refreshToken)
	res.status(200).json("You logged out successfully.")
}

exports.refreshToken = async (req, res) => {
	// take the refresh token from user
	const refreshToken = req.body.token

	// if there is no token or invalid token
	if (!refreshToken)
		return res
			.status(401)
			.json({ status: false, message: "You are not authenticated." })
	if (!refreshTokens.includes(refreshToken)) {
		return res
			.status(403)
			.json({ status: false, message: "Refresh token is not valid." })
	}

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
		err && console.error(err)
		refreshToken = refreshTokens.filter(token => token !== refreshToken)

		const newAccessToken = generateAcessToken(user)
		const newRefreshToken = generateRefreshToken(user)

		refreshTokens.push(newRefreshToken)

		res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		})
	})
}

exports.getUser = async (req, res) => {
	try {
		const user = await User.findOne({
			username: req.user.username,
		}).populate("profilePicture")

		if (!user)
			return res.status(404).json({
				status: false,
				message: "User not found or has been deleted.",
			})

		const { password, updatedAt, ...others } = user._doc
		res.status(200).json(others)
	} catch (err) {
		res.status(500).json(err)
	}
}
