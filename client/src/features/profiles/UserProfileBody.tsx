import { observer } from "mobx-react-lite"
import React from "react"
import { Tab } from "semantic-ui-react"
import { User } from "../../app/models/user"
import UserProfileAbout from "./UserProfileAbout"

interface Props {
	userProfile: User
}

export default observer(function UserProfileBody({ userProfile }: Props) {
	const panes = [
		{
			menuItem: "About",
			render: () => <UserProfileAbout />,
		},
		{ menuItem: "Tags", render: () => <Tab.Pane>Tags</Tab.Pane> },
	]

	return (
		<Tab
			menu={{ fluid: true, vertical: true }}
			menuPosition="right"
			panes={panes}
		/>
	)
})
