import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { auth } from "../firebase";
import FirestoreApi from "../api/firestoreApi";

class DeckList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: null,
      deleteModal: false,
      selectedDeletionDeck: null
    };
  }

  removeDeckFromLocalState = deckId => {
    const decks = this.state.decks.filter(deck => deck.id !== deckId);
    this.setState({ decks });
  };

  toggleDeleteModal = () =>
    this.setState({ deleteModal: !this.state.deleteModal });

  handleDeleteConfirmationClick = async () => {
    const deckId = this.state.selectedDeletionDeck;

    await FirestoreApi.deleteDeck(deckId);

    this.removeDeckFromLocalState(deckId);

    this.toggleDeleteModal();
  };

  handleDeleteClick = e => {
    const deckId = e.target.dataset.deck;

    this.setState({ selectedDeletionDeck: deckId });

    this.toggleDeleteModal();
  };

  async componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        this.props.onLoading(true);

        const decks = await FirestoreApi.getDecks();

        this.setState({
          decks
        });

        this.props.onLoading(false);
      }
    });
  }

  render() {
    return (
      <>
        <Modal
          isOpen={this.state.deleteModal}
          toggle={this.toggleDeleteModal}
          backdrop={false}
        >
          <ModalHeader toggle={this.toggleDeleteModal}>
            Confirm Deck Deletion
          </ModalHeader>
          <ModalBody>
            Are you sure want to delete this deck? This action is irreversible.
            All cards in this deck and the progress associated with these cards
            will be purged.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleDeleteConfirmationClick}>
              Delete Deck
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {this.state.decks === null ? (
          <p>Loading...</p>
        ) : this.state.decks.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: "1px" }}>Cards</th>
                <th style={{ width: "1px" }}></th>
                <th style={{ width: "1px" }}></th>
              </tr>
            </thead>
            <tbody>
              {this.state.decks.map(deck => {
                return (
                  <tr key={deck.id}>
                    <td>{deck.name}</td>
                    <td>{deck.cards ? Object.values(deck.cards).length : 0}</td>
                    <td>
                      <Link to={`/decks/${deck.id}`}>
                        <Button color="primary">View</Button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/decks/edit/${deck.id}`}>
                        <Button color="secondary">Edit</Button>
                      </Link>
                    </td>
                    <td>
                      <Button
                        color="danger"
                        data-deck={deck.id}
                        onClick={this.handleDeleteClick}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No decks</p>
        )}
      </>
    );
  }
}

export default DeckList;
