exports.notFound = (req, res) => {
	res.status(404).json("This is not found error.")
}

exports.badRequest = (req, res) => {
	res.status(400).json("This is bad request error.")
}

exports.serverError = (req, res) => {
	res.status(500).json("This is internal server error.")
}

exports.forbidden = (req, res) => {
	res.status(403).json("This is forbidden error.")
}

exports.unauthorised = (req, res) => {
	res.status(401).json("This is unauthorised error.")
}
