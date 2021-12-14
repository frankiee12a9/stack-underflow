import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import {
	Divider,
	Grid,
	Header,
	Label,
	List,
	Segment,
	Icon,
} from "semantic-ui-react"
import Loading from "../../app/common/Loading"
import { useStore } from "../../app/stores/store"
import TagsList from "../pages/TagsList"
import RelatedPostsList from "../home/RelatedPostsList"
import PostCommentList from "./PostCommentsList"
import moment from "moment"
import { toast } from "react-toastify"
import { Post } from "app/models/post"

export default observer(function PostDetails() {
	const { postId } = useParams<{ postId: string }>()
	const {
		postStore: {
			loadingPost,
			selectedPost,
			loadPost,
			deletePost,
			closePost,
			upvotePost,
		},
		authStore: { user },
	} = useStore()
	const [postVotesCount, setPostVotesCount] = useState(
		selectedPost?.upvotes.length!
	)
	const history = useHistory()

	useEffect(() => {
		if (postId) {
			loadPost(postId)
			setPostVotesCount(selectedPost?.upvotes.length!)
		}
	}, [loadPost, postId, selectedPost?.upvotes.length])

	function handleDeletePost(postId: string) {
		deletePost(postId)
			.then(() => {
				toast.success("Post has been deleted successfully")
				history.push(`/timeline`)
			})
			.catch(err => toast.error(err))
	}

	function handleClosePost(postId: string) {
		closePost(postId)
			.then(() => {
				if (!selectedPost?.isOpen)
					toast.success("Post has been opened successfully")
				else toast.success("Post has been closed successfully.")
			})
			.then(() => {
				window.location.reload()
			})
	}

	function handleUpvotePost(post: Post) {
		upvotePost(post).then(() =>
			toast.success("Post has been voted successfully")
		)
		const isVoted = post.upvotes.some(voter => voter === user?.username)
		if (isVoted) setPostVotesCount(postVotesCount - 1)
		else setPostVotesCount(postVotesCount + 1)
	}

	const validPostFilter = (
		<Grid.Column width={3}>
			<List horizontal>
				<List.Item as={Link} to={`/${selectedPost?._id}/update`}>
					Edit
				</List.Item>
				<List.Item
					style={{ cursor: "pointer", color: "red" }}
					onClick={() => handleDeletePost(selectedPost?._id!)}>
					Delete
				</List.Item>
				<List.Item
					style={{ cursor: "pointer", color: "orange" }}
					onClick={() => handleClosePost(selectedPost?._id!)}>
					{selectedPost?.isOpen ? "Close" : "Open"}
				</List.Item>
			</List>
		</Grid.Column>
	)

	loadingPost && <Loading content="Loading post..." />

	const postTimestime = moment(selectedPost?.createdAt)
	const diff = postTimestime.fromNow()

	return (
		<Grid columns={2}>
			<Grid.Row>
				<Grid.Column width={13}>
					<Header as="h1" content={selectedPost?.title} />
					<List horizontal>
						<List.Item
							as="p"
							to={`/profiles/${selectedPost?.username}`}>
							Asked by{" "}
							<Link to={`/profiles/${selectedPost?.username}`}>
								{selectedPost?.username}
							</Link>{" "}
							{diff}
						</List.Item>
						<List.Item as="p">
							<Label as="a">
								{selectedPost?.category}
								<Icon name="delete" />
							</Label>
						</List.Item>
						<List.Item>
							<Icon
								name="heart"
								color="red"
								style={{ cursor: "pointer" }}
								onClick={() => handleUpvotePost(selectedPost!)}
								disabled={
									user?.username === selectedPost?.username
										? true
										: false
								}
							/>
							<output style={{ fontSize: "15px" }}>
								{postVotesCount}
							</output>
						</List.Item>
					</List>
					<Grid.Row>
						<p style={{ fontSize: "20px" }}>{selectedPost?.desc}</p>
					</Grid.Row>
				</Grid.Column>
				{validPostFilter}
			</Grid.Row>
			<Divider />
			<Grid.Row>
				<Grid.Column width={11}>
					<Divider hidden />
					<Divider hidden />
					<Segment vertical>
						<PostCommentList
							post={selectedPost!}
							isOpen={selectedPost?.isOpen!}
						/>
					</Segment>
				</Grid.Column>
				<Grid.Column width={5}>
					<Grid.Row style={{}}>
						<TagsList />
					</Grid.Row>
					<Divider hidden />
					<RelatedPostsList />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)
})
