import React from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"
import { Button, Form, Header, Label, Segment } from "semantic-ui-react"
import { ErrorMessage, Formik } from "formik"
import FormTextInput from "../../app/common/form/FormTextInput"
import { useHistory } from "react-router-dom"

export default observer(function LoginForm() {
	const {
		authStore: { login },
	} = useStore()
	const history = useHistory()

	const authDetails = (
		<div style={{ textAlign: "center" }}>
			<p>앱에서 모든 권한을 가지는 계좌 사용:</p>
			<p>email: alice@test.com</p>
			<p>password: @kien12a99</p>
			<hr />
			<p>email: tom@test.com</p>
			<p>password: @kien12a99</p>
		</div>
	)

	return (
		<Segment clearing>
			<Formik
				initialValues={{ email: "", password: "", error: null }}
				onSubmit={(values, { setErrors }) =>
					login(values)
						.then(() => history.push("/timeline"))
						.catch(err => setErrors({ error: err }))
				}>
				{({ handleSubmit, isSubmitting, errors }) => (
					<Form
						className="ui form"
						onSubmit={handleSubmit}
						autocomplte="off">
						<Header
							as="h2"
							content="Login"
							textAlign="center"
							color="teal"
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
								<Label
									basic
									color="red"
									content={errors.error}
									style={{ marginBottom: 10 }}
								/>
							)}
						/>
						<Button
							loading={isSubmitting}
							positive
							content="Login"
							type="submit"
							fluid
						/>
					</Form>
				)}
			</Formik>
			{authDetails}
		</Segment>
	)
})
