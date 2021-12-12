import { observer } from "mobx-react-lite"
import React, { Fragment, useEffect } from "react"
import { useStore } from "../../app/stores/store"
import PostItem from "./PostItem"
import Loading from "../../app/common/Loading"
export default observer(function PostItemList() {
	const {
		postStore: { posts, loadUserTimeline, loadingPost },
		authStore: { user },
	} = useStore()

	useEffect(() => {
		if (user?.username) loadUserTimeline(user?.username!)
	}, [user?.username, loadUserTimeline])

	if (loadingPost) return <Loading content="Loading posts..." />

	return (
		<>
			{posts?.map(post => (
				<Fragment>
					<PostItem key={post._id} post={post} isOpen={post.isOpen} />
				</Fragment>
			))}
		</>
	)
})
