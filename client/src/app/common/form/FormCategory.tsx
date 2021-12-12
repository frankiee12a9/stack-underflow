import { CategoryEditForm } from "app/models/category"
import { useStore } from "app/stores/store"
import { Formik } from "formik"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Form, Header, Segment } from "semantic-ui-react"
import * as Yup from "yup"
import FormTextInput from "./FormTextInput"
import FormTextArea from "./FormTextArea"

export default observer(function FormCategory() {
	const {
		categoryStore: { createCategory, loadCategory, updateCategory },
	} = useStore()
	const [categoryEditForm, setCategoryEditForm] = useState<CategoryEditForm>(
		new CategoryEditForm()
	)
	const history = useHistory()
	const { tagTitle } = useParams<{ tagTitle: string }>()

	useEffect(() => {
		if (tagTitle)
			loadCategory(tagTitle).then(category =>
				setCategoryEditForm(new CategoryEditForm(category))
			)
	}, [])

	const handleFormSubmit = (category: CategoryEditForm) => {
		if (tagTitle) {
			updateCategory(category)
				.then(() => toast.success("Updated tag successfully"))
				.then(() => history.push(`/tags/${category.title}`))
		} else {
			createCategory(category)
				.then(() =>
					toast.success("New tag has been created successfully")
				)
				.then(() => history.push(`/tags/${category.title}`))
		}
	}

	const formFieldsValidation = Yup.object({
		title: Yup.string().required("The title is required"),
		desc: Yup.string().required("The description is required"),
	})

	const update = (
		<>
			<FormTextArea name="desc" rows={6} placeholder="Desciption" />
		</>
	)

	const create = (
		<>
			<FormTextInput name="title" placeholder="Title" />
			<FormTextArea name="desc" rows={6} placeholder="Desciption" />
		</>
	)

	return (
		<Segment clearing>
			<Header content="Tag Details" sub color="teal" />
			<Formik
				validationSchema={formFieldsValidation}
				enableReinitialize
				initialValues={categoryEditForm}
				onSubmit={values => handleFormSubmit(values)}>
				{({ handleSubmit, isValid, isSubmitting }) => (
					<Form
						className="ui form"
						onSubmit={handleSubmit}
						autoComplete="off">
						{tagTitle ? update : create}
						<Button
							disabled={isSubmitting || !isValid}
							floated="right"
							positive
							type="submit"
							content="Submit"
							loading={isSubmitting}
						/>
						<Button
							as={Link}
							to="/timeline"
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
