import React, { SyntheticEvent, useEffect, useState } from "react"
import { PostComment } from "app/models/comment"
import { Comment, Icon } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { User } from "app/models/user"
import { Post } from "app/models/post"
import { observer } from "mobx-react-lite"
import { useStore } from "app/stores/store"
import moment from "moment"
import { toast } from "react-toastify"

interface Props {
	comment: PostComment
	user: User
	post: Post
}

export default observer(function PostCommentItem({
	comment,
	user,
	post,
}: Props) {
	const { commentStore } = useStore()
	let [votesCount, setVotesCount] = useState(comment.votes?.length)

	useEffect(() => {
		setVotesCount(comment.votes?.length)
	}, [comment.votes?.length, votesCount])

	const handleCommentVoting = (e: SyntheticEvent, postId: string) => {
		e.preventDefault()
		commentStore.voteComment(postId, comment)
		const isVoted = comment?.votes?.includes(user.username)
		if (isVoted) {
			setVotesCount(votesCount - 1)
		} else {
			setVotesCount(votesCount + 1)
		}
	}

	const postTimestime = moment(comment.createdAt)
	const diff = postTimestime.fromNow()
	return (
		<>
			<Comment>
				<Comment.Avatar
					src={
						comment.commentator?.profilePicture?.url ||
						`/assets/user.png`
					}
				/>
				<Comment.Content>
					<Comment.Author as={Link} to={`/profiles/`}>
						{comment.commentator?.username}
					</Comment.Author>
					<Comment.Metadata>
						<div>{diff}</div>
					</Comment.Metadata>
					<Comment.Metadata>
						<div>
							<Icon name="star" colored="gold" />
							{votesCount} votes
						</div>
					</Comment.Metadata>
					<Comment.Text style={{ whiteSpace: "pre-wrap" }}>
						{comment.text}
					</Comment.Text>
					<Comment.Actions>
						{user?.username !== comment.commentator.username && (
							<Comment.Action onClick={handleCommentVoting}>
								vote
							</Comment.Action>
						)}
						{user?.isAdmin && comment.commentator.username && (
							<Comment.Action
								onClick={() =>
									commentStore
										.deleteComment(post._id, comment._id)
										.then(() =>
											toast.success(
												"Comment has been deleted succesfully"
											)
										)
								}>
								delete
							</Comment.Action>
						)}
					</Comment.Actions>
				</Comment.Content>
			</Comment>
		</>
	)
})
