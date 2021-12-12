import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { Button, Form, Header, Segment } from "semantic-ui-react"
import FormTextInput from "../../app/common/form/FormTextInput"
import { UserEditForm } from "../../app/models/user"
import { useStore } from "../../app/stores/store"
import { Formik } from "formik"
import FormTextArea from "app/common/form/FormTextArea"
import * as Yup from "yup"

export default observer(function EditProfileForm() {
	const history = useHistory()
	const { username } = useParams<{ username: string }>()
	const {
		userStore: { updateUser, loadUser },
	} = useStore()
	const [userForm, setUserForm] = useState<UserEditForm>(new UserEditForm())

	useEffect(() => {
		console.log(username)
		if (username) {
			loadUser(username).then(userForm =>
				setUserForm(new UserEditForm(userForm))
			)
		}
	}, [username, loadUser])

	function handleFormSubmit(user: UserEditForm) {
		if (user.username) {
			updateUser(user).then(() =>
				history.push(`/profiles/${user.username}`)
			)
		}
	}

	const formFieldsValidator = Yup.object({
		username: Yup.string().required("username is required"),
		email: Yup.string().required("email is required"),
		password: Yup.string().required("password is required"),
		description: Yup.string().required("description is required"),
	})

	return (
		<Segment clearing>
			<Header content="User Details" sub color="olive" />
			<Formik
				validationSchema={formFieldsValidator}
				enableReinitialize
				initialValues={userForm}
				onSubmit={values => handleFormSubmit(values)}>
				{({ handleSubmit, isValid, isSubmitting, dirty }) => (
					<Form
						className=""
						onSubmit={handleSubmit}
						autoComplete="off">
						<FormTextInput name="username" placeholder="Username" />
						<FormTextInput name="email" placeholder="Email" />
						<FormTextInput
							type="password"
							name="password"
							placeholder="Password"
						/>
						<FormTextArea
							name="desc"
							placeholder="Desctiption"
							rows={3}
						/>
						<Button
							disabled={isSubmitting || !isValid}
							floated="right"
							positive
							content="Submit"
							loading={isSubmitting}
						/>
						<Button
							as={Link}
							to="/profiles"
							floated="right"
							content="Cancel"
						/>
					</Form>
				)}
			</Formik>
		</Segment>
	)
})
