import Loading from "app/common/Loading"
import { useStore } from "app/stores/store"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import {
	Divider,
	Grid,
	Header,
	List,
	Segment,
	TableBody,
} from "semantic-ui-react"
import TaggedPost from "./TaggedPost"
import TagsList from "./TagsList"

export default observer(function TaggedPostsList() {
	const { tagTitle } = useParams<{ tagTitle: string }>()
	const history = useHistory()
	const {
		categoryStore: {
			category,
			loadCategory,
			loadingCategoryPosts,
			deleteCategory,
		},
	} = useStore()

	useEffect(() => {
		if (tagTitle) {
			loadCategory(tagTitle)
		}
	}, [tagTitle, loadCategory])

	if (loadingCategoryPosts)
		return <Loading content="Loading tagged posts..." />

	return (
		<Grid columns={2}>
			<Grid.Row>
				<Grid.Column width={16}>
					<Segment>
						<Header as="h3">
							Questions tagged [{category?.title}]
						</Header>
						<TableBody>
							<p style={{ fontSize: "15px" }}>{category?.desc}</p>
						</TableBody>
						<List horizontal style={{ marginTop: "15px" }}>
							<List.Item
								as={Link}
								to={`/tags/${category?.title}/update`}>
								Edit
							</List.Item>
							<List.Item
								style={{ cursor: "pointer", color: "red" }}
								onClick={() =>
									deleteCategory(category?._id!)
										.then(() =>
											toast.success(
												"Tag has been deleted successfully"
											)
										)
										.then(() => history.push("/timeline"))
								}>
								Delete
							</List.Item>
						</List>
					</Segment>
				</Grid.Column>
			</Grid.Row>
			<Divider hidden />
			<Grid.Row>
				<Grid.Column width={11}>
					{category?.posts &&
						category.posts.map(post => (
							<TaggedPost
								taggedPost={post}
								isOpen={post.isOpen}
							/>
						))}
				</Grid.Column>
				<Grid.Column width={5}>
					<Grid.Row>
						<TagsList />
					</Grid.Row>
					<Divider hidden />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)
})
