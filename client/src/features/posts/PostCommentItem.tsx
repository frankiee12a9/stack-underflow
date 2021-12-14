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
	const [votesCount, setVotesCount] = useState(comment.votes?.length)
	const [postComment, setPostComment] = useState<PostComment>(
		commentStore.comment!
	)
	const [voteStatus, setVoteStatus] = useState(false)

	useEffect(() => {
		setVotesCount(comment.votes?.length)
	}, [comment.votes?.length, votesCount])

	const handleCommentVoting = (e: SyntheticEvent, postId: string) => {
		e.preventDefault()
		commentStore.voteComment(postId, comment)
		const isVoted = comment?.votes?.includes(user.username)
		if (isVoted) {
			setVotesCount(votesCount - 1)
			setVoteStatus(false)
		} else {
			setVotesCount(votesCount + 1)
			setVoteStatus(true)
		}
	}

	const handleDeleteComment = () => {
		if (postComment?._id)
			commentStore
				.deleteComment(post._id, postComment?._id)
				.then(() =>
					toast.success("Comment has been deleted successfully")
				)
		else
			commentStore
				.deleteComment(post._id, comment._id)
				.then(() =>
					toast.success("Comment has been deleted successfully")
				)
	}

	useEffect(() => {
		if (postComment?._id) console.log(`comment changed ${postComment._id}`)
	}, [postComment])

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
					<Comment.Author
						as={Link}
						to={`/profiles/${comment.commentator?.username}`}>
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
								{voteStatus ? "unvote" : "vote"}
							</Comment.Action>
						)}
						{user?.isAdmin && comment.commentator.username && (
							<Comment.Action onClick={handleDeleteComment}>
								delete
							</Comment.Action>
						)}
					</Comment.Actions>
				</Comment.Content>
			</Comment>
		</>
	)
})
