import React from "react"
import { useField } from "formik"
import { Form, Label } from "semantic-ui-react"
// import { UserForm } from "../../models/user"

import "./formTextInput.css"

interface Props {
	placeholder?: string
	type?: string
	name: string
	label?: string
}
export default function FormTextInput(props: Props) {
	const [field, meta] = useField(props.name) // useField()
	return (
		<Form.Field>
			<label>{props.label}</label>
			<input {...field} {...props} />
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{meta.error}
				</Label>
			) : null}
		</Form.Field>
	)
}
