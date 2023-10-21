import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createClothes, deleteClothes, getClothes, patchClothes } from '../api/clothes-api'
import Auth from '../auth/Auth'
import { ClothesType } from '../types/ClothesType'

interface ClothesProps {
  auth: Auth
  history: History
}

interface ClothesState {
  clothes: ClothesType[]
  newClothesName: string
  loadingClothes: boolean
}

export class Clothes extends React.PureComponent<ClothesProps, ClothesState> {
  state: ClothesState = {
    clothes: [],
    newClothesName: '',
    loadingClothes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newClothesName: event.target.value })
  }

  onEditButtonClick = (clothesId: string) => {
    this.props.history.push(`/clothes/${clothesId}/edit`)
  }

  onClothesCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newClothes = await createClothes(this.props.auth.getIdToken(), {
        name: this.state.newClothesName,
        dueDate
      })
      this.setState({
        clothes: [...this.state.clothes, newClothes],
        newClothesName: ''
      })
      alert('Clothes creation Success')
    } catch {
      alert('Clothes creation failed')
    }
  }

  onClothesDelete = async (clothesId: string) => {
    try {
      await deleteClothes(this.props.auth.getIdToken(), clothesId)
      alert('Clothes deletion Success')
      this.setState({
        clothes: this.state.clothes.filter(item => item.clothesId !== clothesId)
      })
    } catch {
      alert('Clothes deletion failed')
    }
  }

  onClothesCheck = async (pos: number) => {
    try {
      const item = this.state.clothes[pos]
      await patchClothes(this.props.auth.getIdToken(), item.clothesId, {
        name: item.name,
        dueDate: item.dueDate,
        done: !item.done
      })
      this.setState({
        clothes: update(this.state.clothes, {
          [pos]: { done: { $set: !item.done } }
        })
      })
    } catch {
      alert('Clothes deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const clothes = await getClothes(this.props.auth.getIdToken())
      this.setState({
        clothes,
        loadingClothes: false
      })
    } catch (e) {
      alert(`Failed to fetch clothes: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">CLOTHES SHOP</Header>

        {this.renderCreateClothesInput()}

        {this.renderClothes()}
      </div>
    )
  }

  renderCreateClothesInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Clothes',
              onClick: this.onClothesCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Please enter the words or it may get error..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderClothes() {
    if (this.state.loadingClothes) {
      return this.renderLoading()
    }

    return this.renderClothesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Clothes...
        </Loader>
      </Grid.Row>
    )
  }

  renderClothesList() {
    return (
      <Grid padded>
        {this.state.clothes.map((item, pos) => {
          return (
            <Grid.Row key={item.clothesId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onClothesCheck(pos)}
                  checked={item.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {item.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {item.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(item.clothesId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onClothesDelete(item.clothesId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {item.attachmentUrl && (
                <Image src={item.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
