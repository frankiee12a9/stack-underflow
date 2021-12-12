import React from "react"
import { NavLink } from "react-router-dom"
import { Button, Divider, Grid, Header } from "semantic-ui-react"
import TagsList from "../pages/TagsList"
import TopUsersList from "../pages/TopUsersList"
import PostItemList from "./PostItemList"

export default function PostDashboard() {
	return (
		<Grid columns={2}>
			<Grid.Row style={{ marginTop: "0px" }}>
				<Grid.Column width={11}>
					<Header>Posts</Header>
				</Grid.Column>
				<Grid.Column width={5}>
					<Button
						as={NavLink}
						primary
						to="/createPost"
						content="Create post"
					/>
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={11}>
					<PostItemList />
				</Grid.Column>
				<Grid.Column width={5}>
					<Grid.Row
						style={{
							border: "1px solid gray",
						}}>
						<TagsList />
					</Grid.Row>
					<Divider hidden />
					<Grid.Row
						style={{
							border: "1px solid gray",
						}}>
						<TopUsersList />
					</Grid.Row>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)
}
