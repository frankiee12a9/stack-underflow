import { User } from "./user"

export interface PostComment {
	_id: string
	commentator: User
	post: string
	text: string
	votes: string[]
	approval: boolean
	createdAt: Date
}

export class CommentFormValues {
	id?: string = ""
	commentator?: string = ""
	text: string = ""
	postId?: string = ""
	constructor(comment?: PostComment) {
		if (comment) {
			this.id = comment._id
			this.commentator = comment.commentator.username
			this.text = comment.text
			this.postId = comment.post
		}
	}
}
