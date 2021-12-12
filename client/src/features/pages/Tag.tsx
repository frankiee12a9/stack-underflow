import { Category } from "app/models/category"
import React from "react"
import { Link } from "react-router-dom"
import { Icon, Label } from "semantic-ui-react"

interface Props {
	tag: Category
}

export default function Tag({ tag }: Props) {
	return (
		<Label as={Link} key={tag._id} to={`/tags/${tag.title}`}>
			{tag.title}
			<Icon name="delete" /> {tag.posts?.length}
		</Label>
	)
}
