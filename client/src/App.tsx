import FormPost from "app/common/form/FormPost"
import AppModal from "app/common/modal/AppModal"
import HomePage from "features/home/HomePage"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useLocation,
} from "react-router-dom"
import { Container } from "semantic-ui-react"
import "./App.css"
import Loading from "./app/common/Loading"
import { useStore } from "./app/stores/store"
import AuthRoute from "./features/auth/AuthRoute"
import Navbar from "./features/home/Navbar"
import NotFound from "./features/errors/NotFound"
import PostDashboard from "./features/posts/PostDashboard"
import PostDetails from "./features/posts/PostDetails"
import UserProfile from "./features/profiles/UserProfile"
import UsersDashboard from "./features/home/UsersDashboard"
import { ToastContainer } from "react-toastify"
import TestErrors from "features/errors/TestErrors"
import ServerError from "features/errors/ServerError"
import TaggedPostsList from "features/pages/TaggedPostsList"
import FormCategory from "app/common/form/FormCategory"

export default observer(function App() {
	const {
		authStore,
		commonStore,
		modalStore: { modal },
	} = useStore()
	const location = useLocation()

	useEffect(() => {
		if (commonStore.token) {
			authStore.getUser().finally(() => commonStore.setLoadingApp())
		} else commonStore.setLoadingApp()
	}, [authStore, commonStore])

	if (!commonStore.loadingApp) return <Loading content="Loading app..." />

	return (
		<div>
			<Router>
				{/* above all components so that can be accessed anywhere in app */}
				{modal.open && <AppModal />}
				<ToastContainer position="bottom-right" hideProgressBar />
				<Route exact path="/" component={HomePage} />
				<Route
					path={"/(.+)"}
					render={() => {
						return (
							<>
								<Navbar />
								<Container style={{ marginTop: "8em" }}>
									<Switch>
										<AuthRoute
											exact
											path={`/profiles`}
											component={UsersDashboard}
										/>
										<AuthRoute
											path={`/profiles/:username`}
											component={UserProfile}
										/>
										<AuthRoute
											exact
											path={`/timeline`}
											component={PostDashboard}
										/>
										<AuthRoute
											path={`/timeline/:postId`}
											component={PostDetails}
										/>
										<AuthRoute
											exact
											key={location.key}
											path={[
												`/tags/`,
												"/tags/:tagTitle/update",
											]}
											component={FormCategory}
										/>
										<AuthRoute
											exact
											path={`/tags/:tagTitle`}
											component={TaggedPostsList}
										/>
										<AuthRoute
											key={location.key}
											path={[
												"/createPost",
												"/:postId/update",
											]}
											component={FormPost}
										/>
										<Route
											path="/errors"
											component={TestErrors}
										/>
										<Route
											exact
											path="/server-error"
											component={ServerError}
										/>
										<Route component={NotFound} />
									</Switch>
								</Container>
							</>
						)
					}}
				/>
			</Router>
		</div>
	)
})
