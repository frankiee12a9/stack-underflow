import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { Card, Grid } from "semantic-ui-react"
import { useStore } from "../../app/stores/store"
import UserCard from "./UserCard"

export default observer(function UserCardsList() {
	const {
		userStore: { loadAllUsers, users },
	} = useStore()

	useEffect(() => {
		loadAllUsers()
	}, [loadAllUsers])

	return (
		<Grid>
			<Grid.Column width={16}>
				<Card.Group>
					{users &&
						users?.map(user => (
							<UserCard key={user.username} user={user} />
						))}
				</Card.Group>
			</Grid.Column>
		</Grid>
	)
})
