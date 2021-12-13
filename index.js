const express = require("express")
const bodyParser = require("body-parser")
const _ = require("lodash")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const compression = require("compression")
const path = require("path")
const app = express()
// place in src with index.js no need to import anywhere
const proxy = require("http-proxy-middleware")
const { createProxyMiddleware } = require("http-proxy-middleware")
dotenv.config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
	console.log("connected to mongoDB")
})

const corsOption = {
	origin: "http://localhost:3001",
}
const _corsOption = {
	origin: "https://dangling-qa.herokuapp.com",
	credentials: true,
}
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
)
if (process.env.NODE_ENV === "production") {
	app.use(cors(_corsOption))
	console.log(`cors is in production mode ${_corsOption.origin}`)
} else {
	app.use(cors(corsOption))
	console.log(`cors is in development mode ${corsOption.origin}`)
}
app.use(cookieParser())
const oneDay = 1000 * 60 * 60 * 24
app.use(
	session({
		secret: "thisismyseesionsecret",
		saveUninitialized: true,
		cookie: { maxAge: oneDay },
		resave: false,
	})
)
createProxyMiddleware({
	target: "http://localhost:8800/api",
	changeOrigin: true,
})

// app.use(
// 	proxy({
// 		target: "http://localhost:8800/api",
// 		changeOrigin: true,
// 	})
// )
// app.use(proxy(["/api"], { target: "http://localhost:8800" }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(morgan("common"))
app.use(compression())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// app routes
require("./routes/authRoute")(app)
require("./routes/userRoute")(app)
require("./routes/postRoute")(app)
require("./routes/categoryRoute")(app)
require("./routes/errorRoute")(app)

const PORT = process.env.PORT || 8800
console.log(`node env: ${process.env.NODE_ENV}`)
// Serve static assets if in production
// Set static folder
// app.use(express.static("client/build"))
// app.get("*", (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
// })

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/build")))
	app.get("*", (req, res) => {
		// don't serve api routes to react app
		// res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
		// app.get("*", (req, res) => {
		// 	res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
		// })
		res.sendFile(path.join(__dirname, "/client/build/", "index.html"))
	})
	console.log("Currently in production mode...")
}

// app.use(express.static(path.join(__dirname, "/client/build")))
// app.get("*", (req, res) => {
// 	// don't serve api routes to react app
// 	// res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
// 	// app.get("*", (req, res) => {
// 	// 	res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
// 	// })
// 	res.sendFile(path.join(__dirname, "/client/build/", "index.html"))
// })

app.listen(PORT, () => {
	console.log("Backend server is runing on port", PORT)
})
