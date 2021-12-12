import { useField } from "formik"
import React from "react"
import { Form, Label } from "semantic-ui-react"

interface Props {
	placeholder: string
	rows: number
	onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => any
	name: string
	label?: string
}

export default function FormTextArea(props: Props) {
	const [field, meta] = useField(props.name)

	return (
		<Form.Field>
			<label>{props.label}</label>
			<textarea {...field} {...props} />
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{meta.error}
				</Label>
			) : null}
		</Form.Field>
	)
}
