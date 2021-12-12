const mongoose = require("mongoose"),
	Schema = mongoose.Schema

const PostSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		desc: {
			type: String,
			max: 300,
			required: true,
		},
		images: [
			{
				type: Schema.Types.ObjectId,
				ref: "Image",
			},
		],
		upvotes: {
			type: Array,
			default: [],
		},
		downvotes: {
			type: Array,
			default: [],
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		category: {
			type: Schema.Types.String,
			ref: "Category",
		},
		isOpen: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Post", PostSchema)
