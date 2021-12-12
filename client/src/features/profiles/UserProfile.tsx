import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"

import { Grid } from "semantic-ui-react"
import Loading from "../../app/common/Loading"
import { useStore } from "../../app/stores/store"
import UserProfileBody from "./UserProfileBody"
import UserProfileHeader from "./UserProfileHeader"

export default observer(function UserProfile() {
	const { username } = useParams<{ username: string }>()
	const {
		userStore: { loadingUser, loadUser, profileUser },
	} = useStore()

	useEffect(() => {
		username && loadUser(username)
	}, [loadUser, username])

	if (loadingUser) return <Loading content="Loading user profile..." />

	return (
		<Grid>
			<Grid.Column width={16}>
				{profileUser && (
					<>
						<UserProfileHeader userProfile={profileUser} />
						<UserProfileBody userProfile={profileUser} />
					</>
				)}
			</Grid.Column>
		</Grid>
	)
})
