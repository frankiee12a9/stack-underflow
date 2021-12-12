const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema(
	{
		id: {
			type: String,
		},
		url: {
			type: String,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Image", ImageSchema)
