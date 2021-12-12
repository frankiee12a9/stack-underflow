module.exports = app => {
	const Category = require("../controllers/categoryController")
	let router = require("express").Router()
	const authJWT = require("../middleware/authJWT")

	router.post("/", authJWT, Category.create)
	router.get("/all", authJWT, Category.getAll)
	router.get("/:title", authJWT, Category.get)
	router.put("/:title/edit", authJWT, Category.update)
	router.delete("/:id/del", authJWT, Category.delete)
	router.get("/:title/find", authJWT, Category.getCategoryPosts)

	app.use("/api/category", router)
}
