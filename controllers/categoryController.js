const Category = require("../models/Category")
const Post = require("../models/Post")

exports.get = async (req, res) => {
	try {
		const category = await Category.findOne({
			title: req.params.title,
		}).populate("posts")
		res.status(200).json(category)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.delete = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id)
		if (!category)
			return res.status(404).json({
				status: false,
				message: "Category not found.",
			})

		if (req.user.isAdmin || post.creator === req.user.username) {
			await category.deleteOne()
			res.status(200).json({
				status: true,
				message: "Category has been deleted successfully.",
			})
		}
	} catch (err) {
		res.status(500).json({
			status: false,
			message: err,
		})
	}
}

exports.update = async (req, res) => {
	try {
		const category = await Category.findOne({ title: req.params.title })
		await category.updateOne({ $set: req.body })
		res.status(200).json(category)
	} catch (err) {
		res.status(500).json({
			status: false,
			message: err,
		})
	}
}

exports.getAll = async (req, res) => {
	try {
		const categories = await Category.find({})
		res.status(200).json(categories)
	} catch (err) {
		res.status(500).json({
			status: false,
			message: err,
		})
	}
}

exports.getCategoryPosts = async (req, res) => {
	try {
		const posts = await Post.find({ category: req.params.title })
		if (posts.length === 0)
			return res
				.status(404)
				.json(`Posts based on ${req.params.category} do not exist`)
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json(err)
	}
}

exports.create = async (req, res) => {
	const newCategory = new Category({
		title: req.body.title,
		creator: req.user.username,
		desc: req.body.desc,
	})
	if (req.user.isAdmin || req.user.reputation > 10) {
		try {
			await newCategory.save()
			res.status(200).json(newCategory)
		} catch (err) {
			res.status(500).json(err)
		}
	} else {
		res.status(403).json({
			status: false,
			message:
				"Admin or user with 10 reputation or higher can create category.",
		})
	}
}
