module.exports = app => {
	const User = require("../controllers/userController")
	let router = require("express").Router()
	const authJWT = require("../middleware/authJWT")
	const upload = require("../utils/multer")

	router.get("/images", authJWT, User.getAllProfilePictures)
	router.get("/images/:imageId", authJWT, User.getProfilePicture)
	router.delete("/images/:imageId", authJWT, User.deleteProfilePicture)
	router.put("/:username/edit", authJWT, User.update)
	router.delete("/:username", authJWT, User.delete)
	router.get("/list", authJWT, User.getAll)
	router.get("/topUsers", authJWT, User.getTopUsers)
	router.get("/:username", authJWT, User.get)
	router.put("/:username/follow", authJWT, User.following)

	router.post(
		"/profilePicture",
		upload.single("image"),
		authJWT,
		User.uploadProfilePicture
	)

	app.use("/api/users", router)
}
