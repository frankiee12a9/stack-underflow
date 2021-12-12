const mongoose = require("mongoose"),
	Schema = mongoose.Schema

const CommentSchema = new mongoose.Schema(
	{
		commentator: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: "Post",
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		votes: {
			type: Array,
			default: [],
		},
		approval: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Comment", CommentSchema)
