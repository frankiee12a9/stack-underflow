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

dotenv.config()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
	console.log("connected to mongoDB")
})

const corsOptions = {
	origin: "http://localhost:3001",
}

app.use(helmet())
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(cors(corsOptions))
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

console.log(`node env: ${process.env.NODE_ENV}`)
// Serve static assets if in production
if (process.env.NODE_ENV !== "development") {
	// Set static folder
	app.use(express.static("client/build"))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}

const PORT = process.env.PORT || 8800

app.listen(PORT, () => {
	console.log("Backend server is runing on port", PORT)
})
