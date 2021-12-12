import { ServerError } from "app/models/error"
import { makeAutoObservable, reaction } from "mobx"

export default class CommonStore {
	token: string | null = window.localStorage.getItem("jwt")
	loadingApp: boolean = false

	error: ServerError | null = null

	constructor() {
		makeAutoObservable(this)

		// reaction will be called when accessToken changed
		reaction(
			() => this.token,
			token => {
				if (token) window.localStorage.setItem("jwt", token)
				else window.localStorage.removeItem("jwt")
			}
		)
	}

	setToken = (token: string | null) => {
		this.token = token
	}

	setServerError = (error: ServerError) => {
		this.error = error
	}

	setLoadingApp = () => (this.loadingApp = true)
}
