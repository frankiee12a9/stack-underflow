module.exports = app => {
	const Auth = require("../controllers/authController")
	let router = require("express").Router()
	const authJWT = require("../middleware/authJWT")

	router.get("/", authJWT, Auth.getUser)
	router.post("/register", Auth.register)
	router.post("/login", Auth.login)
	router.post("/refresh", Auth.refreshToken)
	router.post("/logout", Auth.logout)

	app.use("/api/auth", router)
}
