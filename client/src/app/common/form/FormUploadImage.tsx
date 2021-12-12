import { observer } from "mobx-react-lite"
import React from "react"
import { Segment, Image } from "semantic-ui-react"
import { useStore } from "../../stores/store"

export default observer(function FormUploadImage() {
	const { userStore } = useStore()

	return (
		<Segment clearing textAlign="center">
			<Image
				src={
					userStore.profileUser?.profilePicture?.url ||
					"assets/user.png"
				}
				wrapped
				ui={false}
			/>
		</Segment>
	)
})
