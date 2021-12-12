module.exports = app => {
	const Image = require("../controllers/ImageController")
	let router = require("express").Router()
	const authJWT = require("../middleware/authJWT")
	const upload = require("../utils/multer")

	router.put("/:username/edit", authJWT, users.update)
	router.delete("/:username", authJWT, users.delete)
	router.get("/list", authJWT, users.list)
	router.get("/:username", authJWT, users.get)
	router.put("/:username/follow", authJWT, users.userFollowing)
	router.post(
		"/profilePicture",
		upload.single("image"),
		authJWT,
		users.uploadUserProfilePicture
	)

	app.use("/api/users", router)
}
