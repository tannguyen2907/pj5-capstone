import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/clothes-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditClothesProps {
  match: {
    params: {
      clothesId: string
    }
  }
  auth: Auth
}

interface EditClothesState {
  file: any
  uploadState: UploadState
}

export class EditClothes extends React.PureComponent<
  EditClothesProps,
  EditClothesState
> {
  state: EditClothesState = {
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.clothesId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image of Clothes</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Images</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading Images</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Submit
        </Button>
      </div>
    )
  }
}
