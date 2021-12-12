import React from "react"
import { Container, Tab } from "semantic-ui-react"
import ListUsers from "./UserCardsList"

export default function UsersDashboard() {
	const panes = [
		{
			menuItem: "Users",
			render: () => <ListUsers />,
		},
	]

	// useEffect(() => {
	// 	users?.length! > 0
	// 		? console.log("loading UserDashboard")
	// 		: console.log("not loading UserDashboard")
	// }, [users?.length])

	return (
		<Container>
			<Tab panes={panes} />
		</Container>
	)
}
