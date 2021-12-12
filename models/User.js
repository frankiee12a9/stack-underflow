const mongoose = require("mongoose"),
	Schema = mongoose.Schema

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			min: 3,
			max: 50,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		profilePicture: {
			type: Schema.Types.ObjectId,
			ref: "Image",
		},
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		desc: {
			type: String,
			max: 100,
		},
		lives: {
			type: String,
		},
		from: {
			type: String,
		},
		joinedTime: {
			type: String,
		},
		twitterUrl: {
			type: String,
			default: null,
		},
		githubUrl: {
			type: String,
			default: null,
		},
		personalBlogUrl: {
			type: String,
			default: null,
		},
		relationship: {
			type: String,
		},
		reputation: {
			type: Number,
			default: 0,
		},
		token: {
			type: String,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)
