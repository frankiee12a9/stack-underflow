const Image = require("../models/Image")
const fs = require("fs")
const cloudinary = require("../utils/cloudinary")

const fileUploadHelper = async (postId, file) => {
	const uploader = async path => await cloudinary.uploads(path, "Images")
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
		res.status(403).json("Error: file should not be null.")
	}
}

exports.getImage = async (req, res) => {
	try {
		const image = Image.findOne({ _id: req.imageId })
		if (!image) return res.status(404).json("Image not found.")
		res.status(200).json(image)
	} catch (err) {
		res.status(500).json(err)
	}
}
