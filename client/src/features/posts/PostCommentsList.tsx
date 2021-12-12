import { useStore } from "app/stores/store"
import { Field, FieldProps, Formik } from "formik"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Form, Segment, Header, Comment, Loader } from "semantic-ui-react"
import * as Yup from "yup"
import { PostComment, CommentFormValues } from "app/models/comment"
import { Post } from "app/models/post"
import PostCommentItem from "./PostCommentItem"

// handle JWT expired https://www.bezkoder.com/handle-jwt-token-expiration-react/

interface Props {
	post: Post
	isOpen: boolean
}

interface CommentVotesProps {
	sourceIndex: number
	sourceValue: number
}

export default observer(function PostCommentsList({ post, isOpen }: Props) {
	const {
		commentStore,
		authStore: { user },
	} = useStore()

	const [commentForm, setCommentForm] = useState<CommentFormValues>(
		new CommentFormValues()
	)
	const [commentVotes, setCommentVotes] = useState<CommentVotesProps[]>([
		{ sourceIndex: 0, sourceValue: 0 },
	])
	const [commentsList, setCommentsList] = useState<PostComment[]>(
		commentStore.comments!
	)

	useEffect(() => {
		if (post?._id) {
			commentStore.connectSocketInstance(post?._id)
			setCommentsList(commentStore.comments!)
		}
		return () => {
			commentStore.clearComments()
		}
	}, [post?._id, commentStore])

	useEffect(() => {
		if (post?._id) {
			setCommentsList(commentStore.comments!)
		}
	}, [commentStore.comments, commentVotes, commentsList, post?._id])

	useEffect(() => {
		const _commentVotes = commentsList.map((comment, index) => {
			const commentVote = {
				sourceIndex: index,
				sourceValue: comment.votes?.length!,
			} as CommentVotesProps
			return commentVote
		})
		setCommentVotes(_commentVotes)
	}, [commentsList])

	return (
		<>
			<Segment
				textAlign="center"
				attached="top"
				inverted
				color={isOpen ? "blue" : "grey"}
				style={{ border: "none" }}>
				<Header>
					{isOpen ? (
						<h4>Share your thoughts here!</h4>
					) : (
						<h4>This post has been closed for some reasons.</h4>
					)}
				</Header>
			</Segment>
			<Segment attached clearing>
				<Comment.Group>
					{commentVotes &&
						commentsList &&
						commentsList.map((comment, index) => (
							<PostCommentItem
								key={comment._id}
								comment={comment}
								post={post}
								user={user!}
							/>
						))}
				</Comment.Group>
				{isOpen && (
					<Formik
						enableReinitialize
						initialValues={commentForm}
						onSubmit={(comment, { resetForm }) =>
							commentStore
								.addComment(post._id, comment)
								.then(() => resetForm({ values: { text: "" } }))
						}
						validationSchema={Yup.object({
							text: Yup.string().required(),
						})}>
						{({ isSubmitting, isValid, handleSubmit }) => (
							<Form className="ui form">
								<Field name="text">
									{(props: FieldProps) => (
										<div style={{ position: "relative" }}>
											<Loader active={isSubmitting} />
											<textarea
												rows={5}
												placeholder="Enter your comment (Enter to submit, SHIFT + enter for new line.)"
												{...props.field}
												onKeyPress={e => {
													if (
														e.key === "Enter" &&
														e.shiftKey
													) {
														return
													}
													if (
														e.key === "Enter" &&
														!e.shiftKey
													) {
														e.preventDefault()
														isValid &&
															handleSubmit()
													}
												}}
											/>
										</div>
									)}
								</Field>
							</Form>
						)}
					</Formik>
				)}
			</Segment>
		</>
	)
})
