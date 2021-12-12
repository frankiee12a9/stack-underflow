export interface Post {
	_id: string
	username: string
	category: string
	title: string
	desc: string
	views: number
	comments?: Comment[]
	upvotes: string[]
	downvotes: string[]
	createdAt: Date
	isOpen: boolean
}

export class PostFormValues {
	id: string = ""
	title?: string = ""
	category: string = ""
	desc?: string = ""
	status: string = ""
	constructor(post?: Post) {
		if (post) {
			this.id = post._id
			this.title = post.title
			this.category = post.category
			this.desc = post.desc
		}
	}
}
