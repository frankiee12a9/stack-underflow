import { useStore } from "app/stores/store"
import { formatDistanceToNow } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Header, List } from "semantic-ui-react"

export default observer(function RelatedPostsList() {
	const {
		categoryStore: { getCategoryPosts, posts },
		postStore: { selectedPost },
	} = useStore()

	useEffect(() => {
		if (selectedPost) {
			getCategoryPosts(selectedPost.category)
		}
	}, [selectedPost, getCategoryPosts])

	return (
		<List divided relaxed>
			<Header as="h4" content="Related Posts" />
			{posts &&
				posts.map(post => (
					<List.Item key={post._id}>
						<List.Icon
							name="pencil alternate"
							size="large"
							verticalAlign="middle"
						/>
						<List.Content>
							<List.Header as={Link} to={`/timeline/${post._id}`}>
								{post.title}
							</List.Header>
							<List.Description as="a">
								posted{" "}
								{formatDistanceToNow(new Date(post.createdAt))}{" "}
								ago
							</List.Description>
						</List.Content>
					</List.Item>
				))}
		</List>
	)
})
