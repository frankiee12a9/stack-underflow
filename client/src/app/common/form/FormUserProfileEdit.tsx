import React, { useState } from "react"
import { useStore } from "../../stores/store"
import { Form, Formik } from "formik"
import { Button } from "semantic-ui-react"
import { UserEditForm } from "../../models/user"
import FormTextInput from "./FormTextInput"
import FormTextArea from "./FormTextArea"
import { observer } from "mobx-react-lite"

interface Props {
	setEditAbout: (editAbout: boolean) => void
}

export default observer(function FormUserProfileEdit({ setEditAbout }: Props) {
	const {
		userStore: { updateUser, profileUser },
	} = useStore()

	const [userEditForm, setUserEditForm] = useState<UserEditForm>(
		new UserEditForm(profileUser)
	)

	return (
		<Formik
			enableReinitialize
			initialValues={userEditForm}
			onSubmit={values => {
				updateUser(values).then(() => setEditAbout(false))
			}}>
			{({ isValid, isSubmitting, dirty }) => (
				<Form className="ui form" autoComplete="off">
					<FormTextInput
						name="relationship"
						placeholder="Relationship"
					/>
					<FormTextInput name="from" placeholder="From" />
					<FormTextInput name="lives" placeholder="Lives in" />
					<FormTextInput
						name="githubUrl"
						placeholder="Your Github URL"
					/>
					<FormTextInput
						name="twitterUrl"
						placeholder="Your Twitter URL"
					/>
					<FormTextInput
						name="personalBlogUrl"
						placeholder="Your Blog URL"
					/>
					<FormTextArea
						rows={4}
						name="desc"
						placeholder="Add your description"
					/>
					<Button
						disabled={!isValid || !dirty}
						loading={isSubmitting}
						floated="right"
						positive
						type="submit"
						content="Update profile"
					/>
				</Form>
			)}
		</Formik>
	)
})
