import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-toastify"
import { history } from "../.."
import {
	User,
	Image,
	UserEditForm,
	UserLoginForm,
	UserRegisterForm,
} from "../models/user"
import { Post, PostFormValues } from "../models/post"
import { store } from "../stores/store"
import { Category, CategoryEditForm } from "app/models/category"
import { CommentFormValues, PostComment } from "app/models/comment"

const sleep = (delay: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, delay)
	})
}

// global axios default instance
// axios.defaults.baseURL = "http://localhost:8800/api"

// create new instance for specified url
// with specified axios instance, api url can be accessed in other places
// export const axiosInstance = axios.create({
// 	baseURL: "https://dangling-qa.herokuapp.com/api/",
// })
export const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
})
// axios.defaults.baseURL = process.env.REACT_APP_API_URL

console.log(`axiosInstance: ${axiosInstance}`)

axiosInstance.interceptors.request.use(config => {
	const token = store.commonStore.token
	if (token) config.headers!.Authorization = `Bearer ${token}`
	return config
})

axiosInstance.interceptors.response.use(
	async response => {
		await sleep(1000)
		console.log(`response: ${response.data}`)
		return response
	},
	// any response without 200 statusCode wil go here
	(error: AxiosError) => {
		const { data, status, config } = error.response!
		console.log(status)
		switch (status) {
			case 400: {
				toast.error("bad request")
				break
			}
			case 403: {
				// window.location.replace("/")
				toast.error(
					"Your token has expired! Please login again to use app"
				)
				break
			}
			case 401: {
				toast.error("unauthorised")
				break
			}
			case 404: {
				window.location.replace("/notfound")
				// toast.error("not found")
				break
			}
			case 500: {
				window.location.replace("/server-error")
				// history.push("/server-error")
				break
			}
		}
		return Promise.reject(error.response)
	}
)

// api response
const responseBody = <T>(response: AxiosResponse<T>) => response.data

const requests = {
	get: <T>(url: string) => axiosInstance.get<T>(url).then(responseBody),
	post: <T>(url: string, body: {}) =>
		axiosInstance.post<T>(url, body).then(responseBody),
	put: <T>(url: string, body: {}) =>
		axiosInstance.put<T>(url, body).then(responseBody),
	del: <T>(url: string) => axiosInstance.delete<T>(url).then(responseBody),
}

const AppAccount = {
	currentUser: () => requests.get<User>("/auth"),
	register: (user: UserRegisterForm) =>
		requests.post<User>("/auth/register", user),
	login: (user: UserLoginForm) => requests.post<User>("/auth/login", user),
}

const AppUser = {
	list: () => requests.get<User[]>("/users/list"),
	update: (user: UserEditForm) =>
		requests.put<void>(`/users/${user.username}/edit`, user),
	details: (username: string) => requests.get<User>(`users/${username}`),
	delete: (username: string) => requests.del<void>(`users/${username}`),
	following: (username: string) =>
		requests.put<void>(`users/${username}/follow`, {}),
	uploadProfilePicture: (image: Blob) => {
		const formData = new FormData()
		formData.append("image", image)
		return axios
			.post<Image>("users/profilePicture", formData, {
				headers: { "Content-type": "multipart/form-data" },
			})
			.then(res => res)
			.catch(err => console.error(err))
	},
	deleteProfilePicture: (imageId: string) =>
		requests.del<void>(`users/images/${imageId}`),
	getTopUsers: () => requests.get<User[]>("/users/topUsers"),
}

const AppPost = {
	create: (post: PostFormValues) => requests.post<Post>("/post/", post),
	getTimeline: (username: string) =>
		requests.get<Post[]>(`/post/timeline/${username}`),
	getPostsBasedOnUsername: (username: string) =>
		requests.get<Post[]>(`/post/userPosts/${username}`),
	get: (postId: string) => requests.get<Post>(`/post/${postId}`),
	update: (post: PostFormValues) =>
		requests.put<void>(`/post/${post.id}`, post),
	delete: (postId: string) => requests.del<void>(`/post/${postId}`),
	upvote: (post: Post) => requests.put<void>(`/post/${post._id}/upvote`, {}),
	downvote: (postId: string) =>
		requests.put<void>(`/post/${postId}/downvote`, {}),
	closePost: (postId: string) =>
		requests.put<void>(`/post/${postId}/close`, {}),
}

const AppPostComment = {
	createComment: (postId: string, comment: CommentFormValues) =>
		requests.post<void>(`/post/${postId}/addComment`, comment),
	deleteComment: (postId, commentId: string) =>
		requests.del<void>(`/post/${postId}/delComment/${commentId}`),
	getComments: (postId: string) =>
		requests.get<PostComment[]>(`/post/${postId}/getComments`),
	voteComment: (postId: string, comment: PostComment) =>
		requests.put<void>(`/post/${postId}/voteComment/${comment._id}`, {}),
	appoveComment: (postId: string, commentId: string) =>
		requests.put<void>(`/post/${postId}/approveComment/${commentId}`, {}),
	getCommentVotes: (postId: string, comment: PostComment) =>
		requests.get(`post/${postId}/${comment._id}/getVotes`),
}

const AppCategory = {
	createCategory: (category: CategoryEditForm) =>
		requests.post<Category>(`/category`, category),
	getCategory: (title: string) =>
		requests.get<Category>(`/category/${title}`),
	getAllCategories: () => requests.get<Category[]>(`/category/all`),
	getPostsBasedOnCategory: (title: string) =>
		requests.get<Post[]>(`/category/${title}/find`),
	updateCategory: (category: CategoryEditForm) =>
		requests.put<void>(`/category/${category.title}/edit`, category),
	deleteCategory: (id: string) => requests.del(`/category/${id}/del`),
}

const agent = {
	AppAccount,
	AppUser,
	AppPost,
	AppPostComment,
	AppCategory,
}

export default agent
