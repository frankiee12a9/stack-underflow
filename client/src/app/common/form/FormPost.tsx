import { useStore } from "app/stores/store"
import { Formik } from "formik"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { Button, Form, Header, Segment } from "semantic-ui-react"
import FormTextInput from "./FormTextInput"
import * as Yup from "yup"
import { PostFormValues } from "app/models/post"
import FormTextArea from "./FormTextArea"
import { toast } from "react-toastify"
import FormSelectInput from "./FormSelectInput"

interface CategoryOption {
	key: string
	text: string
	value: string
}

export default observer(function FormPost() {
	const {
		postStore: { createPost, updatePost, loadPost, selectedPost },
		categoryStore: { getAllCategories, categories },
	} = useStore()
	const history = useHistory()
	const { postId } = useParams<{ postId: string }>()
	const [post, setPost] = useState<PostFormValues>(new PostFormValues())

	useEffect(() => {
		if (postId) {
			loadPost(postId).then(post => setPost(new PostFormValues(post)))
		}
	}, [postId, loadPost, categories])

	useEffect(() => {
		console.log(`selectedPost: ${selectedPost?.title}`)
	}, [selectedPost])

	useEffect(() => {
		if (!postId) getAllCategories()
	}, [getAllCategories])

	const _categoryOptions = categories?.map(category => {
		const categoryOption = {
			key: category.title,
			text: category.title,
			value: category.title,
		} as CategoryOption
		return categoryOption
	})

	const handleFormSubmit = (post: PostFormValues) => {
		if (post.id) {
			updatePost(post)
				.then(() => toast.success("Post has been updated successfully"))
				.then(() => history.push(`/timeline/${postId}`))
				.catch(err => toast.error(err))
		} else {
			createPost(post).then(() =>
				toast.success("Post has been created successfully")
			)
		}
	}

	const formFieldsValidation = Yup.object({
		title: Yup.string().required("The title is required"),
		category: Yup.string().required("The category is required"),
	})

	return (
		<Segment clearing>
			<Header content="Post Details" sub color="teal" />
			<Formik
				validationSchema={formFieldsValidation}
				enableReinitialize
				initialValues={post}
				onSubmit={values => handleFormSubmit(values)}>
				{({ handleSubmit, isValid, isSubmitting, dirty }) => (
					<Form
						className="ui form"
						onSubmit={handleSubmit}
						autoComplete="off">
						<FormTextInput name="title" placeholder="Title" />
						<FormSelectInput
							options={_categoryOptions}
							name="category"
							placeholder="Category"
						/>
						<FormTextArea
							name="desc"
							rows={6}
							placeholder="Desciption"
						/>
						<Button
							disabled={isSubmitting || !isValid || !dirty}
							floated="right"
							positive
							type="submit"
							content="Submit"
							loading={isSubmitting}
						/>
						<Button
							as={Link}
							to={`/timeline/${post.id}`}
							floated="right"
							type="button"
							content="Cancel"
						/>
					</Form>
				)}
			</Formik>
		</Segment>
	)
})
