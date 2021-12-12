import React from "react"
import { Redirect } from "react-router"
import { Route, RouteComponentProps, RouteProps } from "react-router-dom"
import { useStore } from "../../app/stores/store"
import { observer } from "mobx-react-lite"

interface Props extends RouteProps {
	component:
		| React.ComponentType<RouteComponentProps<any>>
		| React.ComponentType<any>
}

export default observer(function AuthRoute({
	component: Component,
	...rest
}: Props) {
	const {
		authStore: { isLoggedIn },
	} = useStore()

	return (
		<Route
			{...rest}
			render={props =>
				isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
			}
		/>
	)
})
