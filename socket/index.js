const io = require("socket.io")(8900, {
	cors: {
		origin: "http://localhost:3001",
	},
})

io.on("connection", socket => {
	console.log(`client connected with socketId: ${socket.id}`)

	socket.on("sendComment", (postId, { text, commentator }) => {
		if (!postId) {
			socket.broadcast.emit("receiveComment", comment)
		} else {
			io.in(postId).emit("receiveComment", {
				text,
				commentator,
			})
		}
	})

	socket.on("joinPost", (postId, cb) => {
		socket.join(postId)
		cb(`Server message: client joined postId: ${postId}`)
	})

	socket.on("disconnect", () => {
		console.log(`client: ${socket.id} disconnected`)
	})
})
