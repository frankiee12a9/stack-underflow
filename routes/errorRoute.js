module.exports = app => {
	let router = require("express").Router()
	let Error = require("../controllers/errorController")
	router.get("/notFound", Error.notFound)
	router.get("/badRequest", Error.badRequest)
	router.get("/forbidden", Error.forbidden)
	router.get("/serverError", Error.serverError)
	router.get("/unauthorised", Error.unauthorised)

	app.use("/api/errors", router)
}
