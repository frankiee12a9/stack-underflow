module.exports = app => {
	const Post = require("../controllers/postController")
	const Comment = require("../controllers/commentController")
	const router = require("express").Router()
	const authJWT = require("../middleware/authJWT")
	const upload = require("../utils/multer")

	router.post("/", authJWT, upload.single("image"), Post.create)
	router.get("/:id", authJWT, Post.get)
	router.put("/:id", authJWT, Post.update)
	router.delete("/deleteAll", authJWT, Post.deleteAll)
	router.delete("/:id", authJWT, Post.delete)
	router.get("/userPosts/:username", authJWT, Post.getPostsBasedOnUsername)
	router.get("/timeline/:username", authJWT, Post.getTimeline)
	router.put("/:id/downvote", authJWT, Post.downvotePost)
	router.put("/:id/upvote", authJWT, Post.upvotePost)
	router.put("/:id/close", authJWT, Post.closePost)
	router.post(
		"/upload-file/:username",
		authJWT,
		upload.single("image"),
		Post.uploadSingleFile
	)

	router.post(
		"/upload-files",
		authJWT,
		upload.array("image"),
		Post.uploadMultiFiles
	)

	router.get("/:postId/:commentId/getVotes", authJWT, Comment.getCommentVotes)
	router.get("/:postId/getComments", authJWT, Comment.getComments)
	router.post("/:postId/addComment", authJWT, Comment.addComment)
	router.delete(
		"/:postId/delComment/:commentId",
		authJWT,
		Comment.deleteComment
	)
	router.put("/:postId/voteComment/:commentId", authJWT, Comment.voteComment)
	router.put(
		"/:postId/approveComment/:commentId",
		authJWT,
		Comment.approveComment
	)

	app.use("/api/post", router)
}
