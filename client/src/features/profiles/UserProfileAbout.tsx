import { formatDistanceToNow } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Button, Grid, Header, List, Tab } from "semantic-ui-react"
import FormProfileEdit from "../../app/common/form/FormUserProfileEdit"
import { useStore } from "../../app/stores/store"

export default observer(function UserProfileAbout() {
	const {
		authStore: { user },
		userStore: { profileUser },
		postStore: { getPostBasedOnUsername, userPosts },
	} = useStore()
	const [editAbout, setEditAbout] = useState(false)

	useEffect(() => {
		if (profileUser?.username) getPostBasedOnUsername(profileUser.username)
	}, [profileUser?.username, getPostBasedOnUsername])

	return (
		<Tab.Pane>
			<Grid>
				<Grid.Column width={16}>
					<Header
						floated="left"
						icon="user"
						content={`About ${profileUser?.username}`}
					/>
					{user?.username === profileUser?.username && (
						<List.Item>
							<Button
								floated="right"
								icon="pencil alternate"
								basic
								content={editAbout ? "Cancel" : "Edit Profile"}
								onClick={() =>
									setEditAbout(!editAbout)
								}></Button>
						</List.Item>
					)}
				</Grid.Column>
				<Grid.Column width={16}>
					{editAbout ? (
						<FormProfileEdit setEditAbout={setEditAbout} />
					) : (
						<>
							<abbr>{profileUser?.desc}</abbr>
							<br />
							<br />
							<Grid.Column width={16}>
								<List divided relaxed>
									<Header
										as="h5"
										icon="pencil alternate"
										content={`${profileUser?.username}'Posts (${userPosts?.length})`}
									/>
									{userPosts?.length !== 0 ? (
										userPosts?.map(post => (
											<List.Item key={post._id}>
												<List.Icon
													name="github"
													size="large"
													verticalAlign="middle"
												/>
												<List.Content>
													<List.Header
														as={NavLink}
														to={`/timeline/${post._id}`}>
														{post.title}
													</List.Header>
													<List.Description as="a">
														posted{" "}
														{formatDistanceToNow(
															new Date(
																post.createdAt
															)
														)}{" "}
														ago
													</List.Description>
												</List.Content>
											</List.Item>
										))
									) : (
										<p>Posts are empty</p>
									)}
								</List>
							</Grid.Column>
							<br />
							<br />
						</>
					)}
				</Grid.Column>
			</Grid>
		</Tab.Pane>
	)
})
