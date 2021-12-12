import { makeAutoObservable, runInAction } from "mobx"
import { CommentFormValues, PostComment } from "../models/comment"
import { io } from "socket.io-client"
import agent from "app/api/agent"
import { store } from "./store"

export default class CommentStore {
	comments: PostComment[] | null = []
	comment: PostComment | null = null
	socket: any | null = null
	loadingComment: boolean = false
	isVoting: boolean = false
	constructor() {
		makeAutoObservable(this)
	}
	connectSocketInstance = async (postId: string) => {
		const comments = await agent.AppPostComment.getComments(postId)
		runInAction(() => (this.comments = comments))
		this.socket = io(`${process.env.REACT_APP_COMMENT_URL}`)

		this.socket.emit("joinPost", postId, msg => {
			console.log(`${msg}`)
		})
		runInAction(() => {
			// cast date type for each comment
			this.comments?.forEach(comment => {
				comment.createdAt = new Date(comment.createdAt)
			})
		})

		this.socket.on("receiveComment", (incommingComment: any) => {
			runInAction(() => {
				// custom object casting
				this.comment = {
					...this.comment,
					...(incommingComment as PostComment),
				}
				this.comment && this.comments?.unshift(this.comment)
			})
		})
	}

	loadAllComments = async (postId: string) => {
		try {
			const comments = await agent.AppPostComment.getComments(postId)
			runInAction(() => (this.comments = comments))
		} catch (err) {
			console.error(err)
		}
	}

	addComment = async (postId: string, comment?: CommentFormValues) => {
		this.socket &&
			this.socket.emit("sendComment", postId, {
				text: comment?.text,
				commentator: store.authStore.user,
			})
		try {
			await agent.AppPostComment.createComment(postId, comment!)
		} catch (err) {
			console.error(err)
		}
	}

	deleteComment = async (postId: string, commentId: string) => {
		try {
			await agent.AppPostComment.deleteComment(postId, commentId)
			runInAction(() => {
				this.comments = this.comments!.filter(
					comment => comment._id !== commentId
				)
			})
		} catch (err) {
			console.error(err)
		}
	}

	approveComment = async (postId: string, commentId: string) => {
		try {
			await agent.AppPostComment.appoveComment(postId, commentId)
			runInAction(() => {
				if (this.comment)
					this.comment!.approval = !this.comment?.approval
			})
		} catch (err) {
			console.error(err)
		}
	}

	voteComment = async (postId: string, comment: PostComment) => {
		try {
			await agent.AppPostComment.voteComment(postId, comment)
			runInAction(() => {
				this.isVoting = comment.votes.some(
					voter => voter === store.authStore.user?.username
				)

				if (this.isVoting) {
					const voterIndex = comment?.votes?.indexOf(
						store.authStore.user?.username!
					)
					comment?.votes?.splice(voterIndex!, 1)
				} else {
					comment?.votes.push(store.authStore.user?.username!)
				}
			})
		} catch (err) {
			console.error(err)
		}
	}

	clearComments = () => {
		this.comments = []
		this.socket && this.socket.disconnect()
	}
}
