const multer = require("multer")
const fs = require("fs")

// const storate = multer.memoryStorage()

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// cb(null, path.join(__dirname + "/uploads/"))
		// // cb(null, "./uploads")
		// // cb(null, __dirname)
		fs.mkdir("./uploads/", err => {
			cb(null, "./uploads/")
		})
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname)
	},
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true)
	} else {
		cb(
			{
				message: "Unsupported file format",
			},
			false
		)
	}
}

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: fileFilter,
})

module.exports = upload
