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
	commentator?: string = ""
	text?: string = ""
	postId?: string = ""
	constructor(comment?: CommentFormValues) {
		this.commentator = comment?.commentator
		this.text = comment?.text
		this.postId = comment?.postId
	}
}
