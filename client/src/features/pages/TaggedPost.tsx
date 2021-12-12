import { Post } from "app/models/post"
import { formatDistanceToNow } from "date-fns"
import { observer } from "mobx-react-lite"
import React from "react"
import { Link } from "react-router-dom"
import { Grid, Header, Label, Segment } from "semantic-ui-react"

interface Props {
	taggedPost: Post
	isOpen: boolean
}

export default observer(function TaggedPost({ taggedPost, isOpen }: Props) {
	const postStatus = isOpen ? "" : "[Close]"
	return (
		<Segment.Group>
			<Segment vertical style={{ padding: 20 }}>
				<Grid columns={2}>
					<Grid.Row>
						<Grid.Column width={6}>
							<Label className="ui button" as={Link}>
								{taggedPost.upvotes?.length}
								<p>votes</p>
							</Label>
							<Label
								className="ui button"
								as={Link}
								style={{
									backgroundColor:
										taggedPost.comments?.length! > 0
											? "#5EBA7D"
											: "",
									color:
										taggedPost.comments?.length! > 0
											? "white"
											: "grey",
								}}>
								{taggedPost.comments?.length!}
								<p>comments</p>
							</Label>
							<Label className="ui button" as={Link}>
								{taggedPost.views!}
								<p>views</p>
							</Label>
						</Grid.Column>
						<Grid.Column style={{ marginLeft: -20 }} width={10}>
							<Header
								as={Link}
								content={taggedPost?.title + postStatus}
								to={`/timeline/${taggedPost._id}`}
								style={{
									textDecoration: "none",
									color: "#0074CC",
								}}
							/>
							<br />
							<Label style={{ marginTop: 10 }}>
								{taggedPost?.category}
							</Label>
							<p style={{ marginTop: 50, float: "right" }}>
								Asked{" "}
								{formatDistanceToNow(
									new Date(taggedPost.createdAt)
								)}{" "}
								ago, by{" "}
								<Link
									to={`/profiles/${taggedPost?.username}`}
									style={{ textDecoration: "none" }}>
									{taggedPost?.username}
								</Link>
							</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		</Segment.Group>
	)
})
