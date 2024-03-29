const io = require("socket.io")(8900, {
	cors: {
		origin: "http://localhost:3001",
	},
})

const postCommentStore = new Map()

io.on("connection", socket => {
	console.log(`client connected with socketId: ${socket.id}`)

	socket.on("sendComment", (postId, { text, commentator, commentId }) => {
		if (!postId) {
			socket.broadcast.emit("receiveComment", { text, commentator })
		} else {
			io.in(postId).emit("receiveComment", {
				text,
				commentator,
			})
		}

		console.log(`Server msg: ${commentId}`)
		postCommentStore.set(commentId, postId)
		console.log(`Server msg: postCommentStore: ${postCommentStore.size}`)
	})

	socket.on("joinPost", (postId, cb) => {
		socket.join(postId)
		cb(`Server message: client joined postId: ${postId}`)
	})

	socket.on("disconnect", () => {
		console.log(`client: ${socket.id} disconnected`)
	})
})
