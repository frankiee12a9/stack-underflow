import { useStore } from "app/stores/store"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Label, List, Segment } from "semantic-ui-react"
import Tag from "./Tag"

export default observer(function TagsList() {
	const {
		categoryStore: { getAllCategories, categories },
		authStore: { user },
	} = useStore()

	useEffect(() => {
		if (user) {
			getAllCategories()
		}
	}, [user, getAllCategories])

	return (
		<>
			<Segment
				textAlign="center"
				style={{ border: "none" }}
				attached="top"
				as="h3"
				secondary
				inverted
				color="teal">
				Tags ({categories?.length})
			</Segment>
			<Segment attached>
				<Label.Group style={{ textDecoration: "none" }}>
					{categories &&
						categories.map(category => <Tag tag={category} />)}
				</Label.Group>
				<List.Item as={Link} to={`/tags`}>
					want to create new tag?
				</List.Item>
			</Segment>
		</>
	)
})
