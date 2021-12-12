const Comment = require("../models/Comment")
const Post = require("../models/Post")
const User = require("../models/User")
const Image = require("../models/Image")

const createCommentHelper = async (postId, comment) => {
	return Comment.create(comment).then(instance => {
		console.log("instance: ", instance)
		return Post.findByIdAndUpdate(
			postId,
			{ $push: { comments: instance._id } },
			{ new: true, useFindAndModify: false }
		).catch(err => {
			console.log(err)
		})
	})
}

const deleteCommentHelper = (postId, commentId) => {
	return Comment.findById(commentId).then(instance => {
		console.log(instance)
		return Post.findByIdAndUpdate(postId, {
			$pull: { comments: instance._id },
		}).catch(err => {
			console.log(err)
		})
	})
}

exports.deleteComment = async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId)
		const comment = await Comment.findById(req.params.commentId)
		if (!post || !comment)
			return res.status(400).json({
				status: false,
				message: "Bad request",
			})
		if (
			req.user.username === post.username ||
			req.user.username === comment.username ||
			req.user.isAdmin
		) {
			if (
				await deleteCommentHelper(
					req.params.postId,
					req.params.commentId
				)
			) {
				await comment.deleteOne()
				res.status(200).json({
					status: true,
					message: "Deleted comment successfully.",
				})
			}
		} else {
			res.status(403).json({
				status: false,
				message: "Failed while deleting comment.",
			})
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.addComment = async (req, res) => {
	if (req.params.postId) {
		try {
			const post = await Post.findById(req.params.postId)
			const user = await User.findOne({ username: req.user.username })
			if (!post || !user) return res.status(400).json("Bad request")

			const newComment = new Comment({
				commentator: user._id,
				post: post._id,
				text: req.body.text,
			})
			if (await createCommentHelper(req.params.postId, newComment)) {
				res.status(200).json(newComment)
			}
			res.status(403).json("Failed while adding comment.")
		} catch (err) {
			res.status(500).json(err)
		}
	} else {
		res.status(403).json("Post ID is required.")
	}
}

exports.getComments = async (req, res) => {
	try {
		const comments = await Comment.find({
			post: req.params.postId,
		})
			.populate({
				path: "commentator",
				select: "username",
				populate: { path: "profilePicture", select: "url" },
			})
			.sort("-createdAt")
		res.status(200).json(comments)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.voteComment = async (req, res) => {
	try {
		const comment = await Comment.findOne({ _id: req.params.commentId })
		if (!comment) return res.status(404).json("Comment not found.")
		if (comment.votes.includes(req.user.username)) {
			await comment.updateOne({ $pull: { votes: req.user.username } })
			res.status(200).json(comment)
		} else {
			await comment.updateOne({ $push: { votes: req.user.username } })
			res.status(200).json("Comment has been updated succesfully.")
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.approveComment = async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId)
		if (req.user.username !== post.username) {
			return res
				.status(403)
				.json("You have no permission to do this task.")
		}

		const comment = await Comment.findById(req.params.commentId)
		if (comment.approval) {
			await comment.updateOne({ approval: false })
			res.status(200).json("Comment has been un-approved successfully.")
		} else {
			await comment.updateOne({ approval: true })
			res.status(200).json("Comment has been approved successfully.")
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.getCommentVotes = async (req, res) => {
	try {
		const commentVotes = await Comment.findById(
			req.params.commentId
		).select("votes")
		res.status(200).json(commentVotes)
	} catch (err) {
		res.status(500).json(err)
	}
}
