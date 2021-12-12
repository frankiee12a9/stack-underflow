const User = require("../models/User")
const Post = require("../models/Post")
const Image = require("../models/Image")
const Category = require("../models/Category")
const fs = require("fs")
const cloudinary = require("../utils/cloudinary")

const fileUploadHelper = async (postId, file) => {
	const uploader = async path => await cloudinary.uploads(path, "Images")
	console.log("file: ", file)
	console.log("postId: ", postId)
	if (postId && file) {
		const { path } = file
		const newPath = await uploader(path)
		fs.unlinkSync(path)

		return Image.create(newPath).then(instance => {
			return Post.findByIdAndUpdate(
				postId,
				{
					$push: {
						images: {
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

const createPostHelper = async (post, category) => {
	return Post.create(post).then(async instance => {
		try {
			return await Category.findOneAndUpdate(
				{ title: category },
				{ $push: { posts: instance._id } },
				{ new: true, useFindAndModify: false }
			)
		} catch (err) {
			console.error(err)
		}
	})
}

exports.create = async (req, res) => {
	try {
		const category = await Category.findOne({
			title: req.body.category,
		})

		const newPost = await Post({
			username: req.user.username,
			category: req.body.category,
			title: req.body.title,
			desc: req.body.desc,
			status: req.body.status,
		})
		if (await createPostHelper(newPost, category.title)) {
			res.status(200).json(newPost)
		}

		if (req.file) {
			if (!(await fileUploadHelper(newPost._id, req.file))) {
				return res.status(403).json({
					status: false,
					message: "Failed while uploading image.",
				})
			}
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

// testing only
exports.uploadSingleFile = async (req, res) => {
	const uploader = async path => await cloudinary.uploads(path, "Images")
	console.log(req.file)
	if (req.method === "POST" && req.file) {
		const file = req.file
		const { path } = file
		const newPath = await uploader(path)
		fs.unlinkSync(path)

		res.status(200).json(newPath)
	} else {
		res.status(403).json("File should not be null.")
	}
}

exports.uploadMultiFiles = async (req, res) => {
	const uploader = async path => await cloudinary.uploads(path, "Images")
	if (req.method === "POST" && req.files) {
		const urls = []
		const files = req.files
		for (const file of files) {
			console.log("file: ", file)
			const { path } = file
			const newPath = await uploader(path)
			urls.push(newPath)
			fs.unlinkSync(path)
		}
		res.status(200).json(urls)
	} else {
		res.status(403).json("File should not be null.")
	}
}

exports.update = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (post.username === req.user.username || req.user.isAdmin) {
			await post.updateOne({ $set: req.body })
			res.status(200).send({
				status: true,
				message: "Post has been updated.",
			})
		} else {
			res.status(401).json({
				status: false,
				message: "You have no permission to update this post!",
			})
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.get = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
			.populate("comments")
			.populate("images")
		if (!post)
			return res
				.status(404)
				.json({ status: false, message: "Post not found." })
		// update post views
		let count = post.views++
		await post.updateOne({ views: count })
		await post.save()
		res.status(200).json(post)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.delete = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) return res.status(404).json("Post not found.")

		if (post.username === req.user.username || req.user.isAdmin) {
			await post.deleteOne()
			res.status(200).json({
				status: true,
				message: "Post has been deleted.",
			})
		} else {
			res.status(401).json({
				status: true,
				message: "You have no permission to delete this post.",
			})
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.getTimeline = async (req, res) => {
	try {
		const currentUser = await User.findOne({
			username: req.user.username,
		})
		if (!currentUser) return res.status(404).json("User not found.")

		const userPosts = await Post.find({
			username: currentUser.username,
		}).populate("comments")

		const friendPosts = await Promise.all(
			currentUser.following.map(name => {
				return Post.find({ username: name }).populate("comments")
			})
		)

		res.status(200).json(userPosts.concat(...friendPosts))
	} catch (err) {
		res.status(500).send({
			status: false,
			message: err,
		})
	}
}

exports.getPostsBasedOnUsername = async (req, res) => {
	try {
		const posts = await Post.find({ username: req.params.username })
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.upvotePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (post.username === req.user.username) {
			return res.status(403).json({
				status: true,
				message: "You can not upvotes your own post.",
			})
		}

		if (post.upvotes.includes(req.user.username)) {
			await post.updateOne({ $pull: { upvotes: req.user.username } })
			return res.status(200).json({
				status: true,
				message: "You've already upvoted this post. Un-upvoted post.",
			})
		} else {
			await post.updateOne({ $push: { upvotes: req.user.username } })
			await post.updateOne({ $pull: { downvotes: req.user.username } })
			res.status(200).json({
				status: true,
				message: "Upvoted post successfully.",
			})
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.downvotePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (post.username === req.user.username) {
			return res.status(403).json({
				status: true,
				message: "You can not upvotes/downvotes your own post.",
			})
		}

		if (post.downvotes.includes(req.user.username)) {
			await post.updateOne({ $pull: { downvotes: req.user.username } })
			return res.status(403).json({
				status: true,
				message:
					"You've already down-voted this post. Un-downvoted this post.",
			})
		} else {
			await post.updateOne({ $push: { downvotes: req.user.username } })
			await post.updateOne({ $pull: { upvotes: req.user.username } })
			res.status(200).json("Down-voted post successfully.")
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.getPostsBasedUsername = async (req, res) => {
	try {
		const posts = await Post.find({ username: req.params.username })
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.deleteAll = async (req, res) => {
	try {
		await Post.deleteMany({})
		res.status(200).json("All posts has been deleted")
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.closePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (post.username === req.user.username || req.user.isAdmin) {
			if (post.isOpen) {
				await post.updateOne({ isOpen: false })
				res.status(200).json({
					status: true,
					message: "Post has been closed successfully.",
				})
			} else {
				await post.updateOne({ isOpen: true })
				res.status(200).json({
					status: true,
					message: "Post has been opened successfully.",
				})
			}
		}
	} catch (err) {
		res.status(500).json(err)
	}
}
