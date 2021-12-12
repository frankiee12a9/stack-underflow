import { useStore } from "app/stores/store"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { List, Segment } from "semantic-ui-react"
import TopUserCard from "./TopUserCard"

export default observer(function TopUsersList() {
	const {
		userStore: { users, loadTopUsers },
		authStore: { user },
	} = useStore()

	useEffect(() => {
		if (user?.username) {
			loadTopUsers()
		}
	}, [user?.username, loadTopUsers])

	return (
		<>
			<Segment
				textAlign="center"
				style={{ border: "none" }}
				attached="top"
				as="h3"
				secondary
				inverted
				color="teal">
				Top Users ({users?.length})
			</Segment>
			<Segment attached>
				<List relaxed divided>
					{users &&
						users.map(topUser => <TopUserCard user={topUser} />)}
				</List>
			</Segment>
		</>
	)
})
