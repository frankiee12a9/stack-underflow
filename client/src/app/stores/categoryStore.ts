import agent from "app/api/agent"
import { Category, CategoryEditForm } from "app/models/category"
import { Post } from "app/models/post"
import { makeAutoObservable, runInAction } from "mobx"

export default class CategoryStore {
	category: Category | null = null
	categories: Category[] | null = []
	posts: Post[] | null = []
	loadingCategory: boolean = false
	loadingCategoryPosts: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	getAllCategories = async () => {
		try {
			const result = await agent.AppCategory.getAllCategories()
			runInAction(() => (this.categories = result))
		} catch (err) {
			console.error(err)
		}
	}

	createCategory = async (category: CategoryEditForm) => {
		try {
			const response = await agent.AppCategory.createCategory(category)
			runInAction(() => {
				this.category = response
			})
		} catch (err) {
			console.error(err)
		}
	}

	loadCategory = async (title: string) => {
		this.loadingCategoryPosts = true
		try {
			const response = await agent.AppCategory.getCategory(title)
			runInAction(() => (this.category = response))
			this.loadingCategoryPosts = false
			return response
		} catch (err) {
			runInAction(() => (this.loadingCategoryPosts = false))
			console.error(err)
		}
	}

	updateCategory = async (category: CategoryEditForm) => {
		try {
			await agent.AppCategory.updateCategory(category)
			runInAction(() => {
				this.category = {
					...this.category,
					...(category as unknown as Category),
				}
			})
		} catch (err) {
			runInAction(() => (this.loadingCategory = false))
			console.error(err)
		}
	}

	deleteCategory = async (id: string) => {
		this.loadingCategory = true
		try {
			await agent.AppCategory.deleteCategory(id)
			this.loadingCategory = false
		} catch (err) {
			runInAction(() => (this.loadingCategory = false))
			console.error(err)
		}
	}

	getCategoryPosts = async (title: string) => {
		this.loadingCategoryPosts = true
		try {
			const result = await agent.AppCategory.getPostsBasedOnCategory(
				title
			)
			runInAction(() => (this.posts = result))
			this.loadingCategoryPosts = false
		} catch (err) {
			runInAction(() => (this.loadingCategoryPosts = false))
			console.error(err)
		}
	}
}
