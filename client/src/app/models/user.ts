export interface User {
	username: string
	email: string
	password: string
	profilePicture?: Image
	followers?: string[]
	following?: string[]
	reputation?: number
	desc?: string
	isAdmin: boolean
	from?: string
	createdAt: Date
	lives?: string
	relationship?: string
	personalBlogUrl?: string
	githubUrl?: string
	twitterUrl?: string
	accessToken: string | null
}

export interface Image {
	_id: string
	url: string
}

export interface UserLoginForm {
	email: string
	password: string
}

export interface UserRegisterForm {
	username: string
	email: string
	password: string
}

export class UserEditForm {
	username: string = ""
	email: string = ""
	password: string = ""
	desc?: string = ""
	githubUrl?: string = ""
	twitterUrl?: string = ""
	personalBlogUrl?: string = ""
	from?: string = ""
	relationship?: string = ""
	lives?: string = ""
	constructor(user?: User | null) {
		if (user) {
			this.username = user.username
			this.email = user.email
			this.password = user.password
			this.desc = user.desc
			this.githubUrl = user.githubUrl
			this.twitterUrl = user.twitterUrl
			this.personalBlogUrl = user.personalBlogUrl
			this.from = user.from
			this.lives = user.lives
			this.relationship = user.relationship
		}
	}
}
