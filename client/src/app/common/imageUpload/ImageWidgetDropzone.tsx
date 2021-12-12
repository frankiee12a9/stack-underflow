import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Header, Icon } from "semantic-ui-react"

interface Props {
	setFiles: (file: any) => void
}

export default function ImageWidgetDropzone({ setFiles }: Props) {
	const dropzoneStyles = {
		border: "dashed 3px #eee",
		borderColor: "#eee",
		borderRadius: "5px",
		paddingTop: "30px",
		textAlign: "center" as "center",
		height: 200,
	}

	const dropzoneActiveStyles = {
		borderColor: "green",
	}

	// note: set current selected image files
	// and pass down as child property to PhotosUploadWidget
	const onDrop = useCallback(
		acceptedFiles => {
			console.log(acceptedFiles)
			setFiles(
				acceptedFiles.map((file: any) =>
					Object.assign(file, {
						preview: (window.URL ? URL : webkitURL).createObjectURL(
							file
						), // preview is important, set image url to preview
					})
				)
			)
		},
		[setFiles]
	)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	})

	return (
		<div
			{...getRootProps()}
			style={
				isDragActive
					? { ...dropzoneStyles, ...dropzoneActiveStyles }
					: dropzoneStyles
			}>
			<input {...getInputProps()} />
			<Icon name="upload" size="huge" />
			<Header content="Drop image here" />
		</div>
	)
}
