import { Post } from "./post"

export interface Category {
	_id: string
	title: string
	desc: string
	posts?: Post[]
	createdAt: Date
}

export class CategoryEditForm {
	title: string = ""
	desc: string = ""
	constructor(category?: Category) {
		if (category) {
			this.title = category.title
			this.desc = category.desc
		}
	}
}
