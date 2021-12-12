import { useContext, createContext } from "react"
import UserStore from "./userStore"
import CommonStore from "./commonStore"
import PostStore from "./postStore"
import AuthStore from "./authStore"
import ModalStore from "./modalStore"
import CategoryStore from "./categoryStore"
import CommentStore from "./commentStore"

interface Store {
	authStore: AuthStore
	userStore: UserStore
	commonStore: CommonStore
	postStore: PostStore
	modalStore: ModalStore
	categoryStore: CategoryStore
	commentStore: CommentStore
}

export const store: Store = {
	authStore: new AuthStore(),
	userStore: new UserStore(),
	commonStore: new CommonStore(),
	postStore: new PostStore(),
	modalStore: new ModalStore(),
	categoryStore: new CategoryStore(),
	commentStore: new CommentStore(),
}

export const StoreContext = createContext(store)

export function useStore() {
	return useContext(StoreContext)
}
