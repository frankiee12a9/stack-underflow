const mongoose = require("mongoose"),
	Schema = mongoose.Schema

const CategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			unique: true,
			required: true,
		},
		creator: {
			type: String,
			unique: true,
			required: true,
		},
		desc: {
			type: String,
			requried: true,
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		following: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Category", CategorySchema)
