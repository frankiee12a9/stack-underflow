import { makeAutoObservable, runInAction } from "mobx"
import { history } from "../.."
import agent from "../api/agent"
import { User, Image, UserRegisterForm, UserLoginForm } from "../models/user"
import { store } from "./store"

export default class AuthStore {
	user: User | null = null
	isLoggedout: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	register = async (creds: UserRegisterForm) => {
		try {
			const user = await agent.AppAccount.register(creds)
			runInAction(() => {
				this.user = user
			})
			store.modalStore.closeModal()
			console.log(user)
		} catch (err) {
			console.error(err)
		}
	}
	get isLoggedIn() {
		return !!this.user
	}

	login = async (creds: UserLoginForm) => {
		try {
			const user = await agent.AppAccount.login(creds)
			store.commonStore.setToken(user.accessToken)
			runInAction(() => {
				this.user = user
			})
			store.modalStore.closeModal()
		} catch (err) {
			console.error(err)
		}
	}

	logout = async () => {
		try {
			store.commonStore.setToken(null)
			window.localStorage.removeItem("jwt")
			this.user = null
			this.isLoggedout = true
			history.push("/")
		} catch (err) {
			console.log(err)
		}
	}

	getUser = async () => {
		try {
			const user = await agent.AppAccount.currentUser()
			runInAction(() => {
				this.user = user
			})
		} catch (err) {
			console.error(err)
		}
	}

	// handle left-hand side chaining expression error in JS
	// store.authStore.user.profilePicture = image => ERROR
	setProfilePicture = (image: Image) => {
		if (this.user) this.user.profilePicture = image
	}
}
