import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent"
import { User, UserEditForm } from "../models/user"
import { store } from "./store"

export default class UserStore {
	users: User[] | null = []
	profileUser: User | null = null
	followingList: User[] = []
	isFollowing: boolean = false
	loadingUser: boolean = false
	updateLoading: boolean = false
	loadingImage: boolean = false
	loadingDeleteImage = false
	constructor() {
		makeAutoObservable(this)
	}

	loadAllUsers = async () => {
		this.loadingUser = true
		try {
			const users = await agent.AppUser.list()
			runInAction(() => {
				this.users = users
			})
			this.loadingUser = false
		} catch (err) {
			runInAction(() => (this.loadingUser = false))
			console.error(err)
		}
	}

	loadUser = async (username: string) => {
		this.loadingUser = true
		try {
			const user = await agent.AppUser.details(username)
			runInAction(() => {
				this.profileUser = user
			})
			this.loadingUser = false
			return user
		} catch (err) {
			runInAction(() => (this.loadingUser = false))
			console.error(err)
		}
	}

	loadTopUsers = async () => {
		try {
			const result = await agent.AppUser.getTopUsers()
			runInAction(() => (this.users = result))
		} catch (err) {
			console.error(err)
		}
	}

	updateUser = async (user: UserEditForm) => {
		this.updateLoading = true
		await agent.AppUser.update(user)
		try {
			runInAction(() => {
				if (store.authStore.user?.username) {
					this.profileUser = {
						...this.profileUser,
						...(user as User), // persisting model that makes TS happy
					}
				}
			})
			this.updateLoading = false
		} catch (err) {
			runInAction(() => (this.updateLoading = false))
			console.error(err)
		}
	}

	updateFollowing = async (username: string) => {
		this.updateLoading = true
		try {
			await agent.AppUser.following(username)
			const follower = store.authStore.user?.username!
			runInAction(() => {
				if (
					this.profileUser &&
					this.profileUser.username !== follower &&
					this.profileUser.username === username
				) {
					this.isFollowing = store.authStore.user?.following?.some(
						x => x === username
					)!
					if (this.isFollowing) {
						const userIndex =
							store.authStore.user?.following!.indexOf(username)
						store.authStore.user?.following!.splice(userIndex!, 1)
					} else {
						store.authStore.user?.following?.push(username)
					}
				}
			})
			this.updateLoading = false
		} catch (err) {
			runInAction(() => (this.updateLoading = false))
			console.error(err)
		}
	}

	uploadProfilePicture = async (file: Blob) => {
		this.loadingImage = true
		try {
			const response = await agent.AppUser.uploadProfilePicture(file)
			const image = response!.data
			store.authStore.setProfilePicture(image)
			runInAction(() => (this.profileUser!.profilePicture = image))
			this.loadingImage = false
			store.modalStore.closeModal()
		} catch (err) {
			runInAction(() => (this.loadingImage = false))
			console.error(err)
		}
	}

	deleteProfilePicture = async (imageId: string) => {
		this.loadingDeleteImage = true
		try {
			await agent.AppUser.deleteProfilePicture(imageId)
			runInAction(() => {
				store.authStore.setProfilePicture(null!)
				this.profileUser!.profilePicture = null!
			})
			this.loadingDeleteImage = false
			store.modalStore.closeModal()
		} catch (err) {
			runInAction(() => (this.loadingDeleteImage = false))
			console.error(err)
		}
	}
}
