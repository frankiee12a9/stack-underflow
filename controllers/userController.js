const User = require("../models/User")
const Image = require("../models/Image")
const fs = require("fs")
const cloudinary = require("../utils/cloudinary")

exports.update = async (req, res) => {
	console.log(req.user.username)
	if (req.user.username === req.params.username) {
		try {
			const user = await User.findOneAndUpdate(
				{ username: req.params.username },
				{ $set: req.body }
			)
			res.status(200).json(user)
		} catch (err) {
			return res.status(500).json(err)
		}
	} else {
		res.status(403).json("You can update only your account.")
	}
}

exports.get = async (req, res) => {
	try {
		let user = await User.findOne({
			username: req.params.username,
		})

		if (!user)
			return res.status(404).json({
				status: false,
				message: "User not found or has been deleted",
			})

		if (user.profilePicture) {
			user = await User.findOne({ username: user.username })
				.populate("profilePicture", "url")
				.select("-__v")
		}

		const { updatedAt, __v, ...others } = user._doc
		res.status(200).json(others)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.getTopUsers = async (req, res) => {
	try {
		const topUsers = await User.find({ reputation: { $gt: 5 } }).populate(
			"profilePicture"
		)
		res.status(200).json(topUsers)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.delete = async (req, res) => {
	if (req.user.isAdmin || req.user.username === req.params.username) {
		try {
			await User.findOneAndDelete({ username: req.params.username })
			res.status(200).json({
				satus: true,
				message: "Account has been deleted successfully.",
			})
		} catch (err) {
			return res.status(500).json({
				status: false,
				message: "Failed while deleting account.",
			})
		}
	} else {
		res.status(403).json("Error: you can delete only your account.")
	}
}

exports.getAll = async (req, res) => {
	try {
		const users = await User.find({ reputation: { $gt: -1 } }).populate(
			"profilePicture",
			"url"
		)
		const result = users.map(user => {
			const { password, createdAt, updatedAt, __v, ...others } = user._doc
			return others
		})
		res.status(200).json(result)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.following = async (req, res) => {
	if (!req.params.username || req.params.username === req.user.username)
		return res.status(400).json("Bad request")

	try {
		// user to follow
		const userToFollow = await User.findOne({
			username: req.params.username,
		})
		// current logged in user
		const currentUser = await User.findOne({
			username: req.user.username,
		})
		// in case of not following
		if (!currentUser.following.includes(req.params.username)) {
			await userToFollow.updateOne({
				$push: { followers: req.user.username },
			})
			await currentUser.updateOne({
				$push: { following: req.params.username },
			})

			res.status(200).json({
				status: true,
				message: "This user has been followed",
			})
		} else {
			await userToFollow.updateOne({
				$pull: { followers: req.user.username },
			})
			await currentUser.updateOne({
				$pull: { following: req.params.username },
			})

			res.status(200).json({
				status: true,
				message: "This user has been unfollowed.",
			})
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

const fileUploadHelper = async (username, file) => {
	const uploader = async path => await cloudinary.uploads(path, "Images")
	if (username && file) {
		const { path } = file
		const newPath = await uploader(path)
		fs.unlinkSync(path)

		return Image.create(newPath).then(instance => {
			return User.findOneAndUpdate(
				{ username: username },
				{
					$set: {
						profilePicture: {
							_id: instance._id,
						},
					},
				},
				{ new: true, useFindAndModify: false }
			)
		})
	} else {
		res.status(403).json({
			status: false,
			message: "File should not be null.",
		})
	}
}

exports.uploadProfilePicture = async (req, res) => {
	try {
		if (!req.file && !req.user)
			return res.status(403).json({
				status: false,
				message: "Bad request",
			})

		const user = await fileUploadHelper(req.user.username, req.file)

		const updatedProfilePicture = await Image.findOne({
			_id: user.profilePicture,
		})

		res.status(200).json(updatedProfilePicture)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.deleteProfilePicture = async (req, res) => {
	try {
		await Image.findOneAndDelete({ _id: req.params.imageId })
		res.status(201).json({
			status: true,
			message: "Profile picture has been deleted successfully.",
		})
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.getAllProfilePictures = async (req, res) => {
	try {
		const images = await Image.find({})
		console.log(images.length)
		res.status(200).json(images)
	} catch (err) {
		res.status(500).json({
			status: false,
			message: err,
		})
	}
}

exports.getProfilePicture = async (req, res) => {
	try {
		const image = await Image.findOne({ _id: req.params.imageId })
		if (!image)
			res.status(404).json({ status: false, message: "Image not found." })
		res.status(200).json(image)
	} catch (err) {
		res.status(500).json(err)
	}
}
