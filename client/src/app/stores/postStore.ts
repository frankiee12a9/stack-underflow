import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent"
import { Post, PostFormValues } from "../models/post"
import { store } from "./store"

export default class PostStore {
	posts: Post[] | null = null
	userPosts: Post[] | null = null
	selectedPost: Post | null = null
	loadingPost: boolean = false
	loadingDelete: boolean = false
	isVoted: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	createPost = async (post: PostFormValues) => {
		try {
			const response = await agent.AppPost.create(post)
			runInAction(() => {
				this.selectedPost = response
				window.location.replace(`/timeline/${this.selectedPost._id}`)
			})
		} catch (err) {
			console.error(err)
		}
	}

	updatePost = async (post: PostFormValues) => {
		try {
			await agent.AppPost.update(post)
			runInAction(() => {
				this.selectedPost = {
					...this.selectedPost,
					...(post as unknown as Post),
				}
			})
		} catch (err) {
			console.error(err)
		}
	}

	deletePost = async (postId: string) => {
		this.loadingDelete = true
		try {
			await agent.AppPost.delete(postId)
			this.loadingDelete = false
		} catch (err) {
			runInAction(() => (this.loadingDelete = false))
			console.error(err)
		}
	}

	loadUserTimeline = async (username: string) => {
		this.loadingPost = true
		try {
			const timeline = await agent.AppPost.getTimeline(username)
			runInAction(() => {
				this.posts = timeline
			})
			this.loadingPost = false
		} catch (err) {
			runInAction(() => (this.loadingPost = false))
			console.error(err)
		}
	}

	getPostBasedOnUsername = async (username: string) => {
		this.loadingPost = true
		try {
			const posts = await agent.AppPost.getPostsBasedOnUsername(username)
			runInAction(() => {
				this.userPosts = posts
			})
			this.loadingPost = false
		} catch (err) {
			runInAction(() => (this.loadingPost = false))
			console.error(err)
		}
	}

	loadPost = async (postId: string) => {
		this.loadingPost = true
		try {
			const post = await agent.AppPost.get(postId)
			runInAction(() => {
				this.selectedPost = post
			})
			this.loadingPost = false
			return post
		} catch (err) {
			runInAction(() => (this.loadingPost = false))
			console.error(err)
		}
	}

	upvotePost = async (post: Post) => {
		try {
			await agent.AppPost.upvote(post)
			runInAction(() => {
				this.isVoted = post.upvotes.some(
					voter => voter === store.authStore.user?.username!
				)

				if (this.isVoted) {
					const voterIndex = post.upvotes.indexOf(
						store.authStore.user?.username!
					)
					post.upvotes.splice(voterIndex, 1)
				} else {
					post.upvotes.push(store.authStore.user?.username!)
				}
			})
		} catch (err) {
			console.error(err)
		}
	}

	closePost = async (postId: string) => {
		try {
			await agent.AppPost.closePost(postId)
		} catch (err) {
			console.error(err)
		}
	}
}
