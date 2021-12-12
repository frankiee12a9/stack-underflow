import { formatDistanceToNow } from "date-fns"
import React from "react"
import { Link } from "react-router-dom"
import { Grid, Header, Label, Segment } from "semantic-ui-react"
import { Post } from "../../app/models/post"

interface Props {
	post: Post
	isOpen: boolean
}

export default function PostItem({ post, isOpen }: Props) {
	const postStatus = isOpen ? "" : "[Close]"

	return (
		<Segment.Group>
			<Segment vertical style={{ padding: 20 }}>
				<Grid columns={2}>
					<Grid.Row>
						<Grid.Column width={6}>
							<Label className="ui button" as={Link}>
								{post.upvotes?.length}
								<p>votes</p>
							</Label>
							<Label
								className="ui button"
								as={Link}
								style={{
									backgroundColor:
										post.comments?.length! > 0
											? "#5EBA7D"
											: "",
									color:
										post.comments?.length! > 0
											? "white"
											: "grey",
								}}>
								{post.comments?.length!}
								<p>comments</p>
							</Label>
							<Label className="ui button" as={Link}>
								{post.views!}
								<p>views</p>
							</Label>
						</Grid.Column>
						<Grid.Column style={{ marginLeft: -20 }} width={10}>
							<Header
								as={Link}
								content={post?.title + postStatus}
								to={`timeline/${post._id}`}
								style={{
									textDecoration: "none",
									color: "#0074CC",
								}}
							/>
							<br />
							<Label
								style={{ marginTop: 10 }}
								as={Link}
								to={`/tags/${post?.category}`}>
								{post?.category}
							</Label>
							<p style={{ marginTop: 50, float: "right" }}>
								Asked{" "}
								{formatDistanceToNow(new Date(post.createdAt))}{" "}
								ago, by{" "}
								<Link
									to={`/profiles/${post?.username}`}
									style={{ textDecoration: "none" }}>
									{post?.username}
								</Link>
							</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		</Segment.Group>
	)
}
