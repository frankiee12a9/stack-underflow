import { ErrorMessage, Formik } from "formik"
import { observer } from "mobx-react-lite"
import React from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, Header, Segment } from "semantic-ui-react"
import FormTextInput from "../../app/common/form/FormTextInput"
import { useStore } from "../../app/stores/store"
import * as Yup from "yup"
import ValidationError from "features/errors/ValidationError"

export default observer(function RegisterForm() {
	const {
		authStore: { register },
	} = useStore()
	const history = useHistory()

	const formFieldsValidation = Yup.object({
		displayName: Yup.string().required(),
		userName: Yup.string().required(),
		email: Yup.string().required().email(),
		password: Yup.string().required(),
	})

	return (
		<Segment clearing>
			<Formik
				initialValues={{
					username: "",
					email: "",
					password: "",
					error: null,
				}}
				// those are from Formik
				onSubmit={(values, { setErrors }) =>
					register(values)
						.then(() => history.push("/timeline"))
						.catch(error => setErrors({ error }))
				}
				validationSchema={formFieldsValidation}>
				{({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
					// in className `error` must be included, if not <ValidationError /> will not be occured
					<Form
						className="ui form error"
						onSubmit={handleSubmit}
						autoComplete="off">
						<Header
							as="h2"
							content="Register"
							textAlign="center"
							color="teal"
						/>
						<FormTextInput
							name="username"
							placeholder="Username"
							type="text"
						/>
						<FormTextInput
							name="email"
							placeholder="Email"
							type="email"
						/>
						<FormTextInput
							name="password"
							placeholder="Password"
							type="password"
						/>
						<ErrorMessage
							name="error"
							render={() => (
								<ValidationError errors={errors.error} />
							)}
						/>
						<Button
							disabled={!isValid || !dirty || isSubmitting}
							loading={isSubmitting}
							positive
							content="Submit"
							type="submit"
							fluid
						/>
					</Form>
				)}
			</Formik>
		</Segment>
	)
})
