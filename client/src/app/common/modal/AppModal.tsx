import { observer } from "mobx-react-lite"
import React from "react"
import { Modal, ModalContent } from "semantic-ui-react"
import { useStore } from "../../stores/store"

export default observer(function AppModal() {
	const { modalStore } = useStore()

	return (
		<Modal
			className="app-modal"
			style={{ maxHeight: "500px", height: "100%" }}
			open={modalStore.modal.open}
			onClose={modalStore.closeModal}
			size="small">
			<ModalContent>{modalStore.modal.body}</ModalContent>
		</Modal>
	)
})
