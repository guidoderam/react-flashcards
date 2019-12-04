import React from 'react';
import {db} from "../../firebase.js";

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            card: {
                tag: '',
                question: '',
                answer: '',
                id: '',
                tags: []
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //this.getTags();
        this.getCard(this.props.match.params.id);
    }

    getCard = (id) => {
        db.collection("cards").doc(id).get()
            .then((card) => {
                if (card.exists) {
                    const data = card.data();
                    this.setState({
                        card: {
                            id: card.id,
                            question: data.question,
                            answer: data.answer,
                            tags: data.tags
                        }
                    });
                }
            })
            .catch(function (error) {
                console.error("Error getting document: ", error);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.question.length === 0 ||
            this.state.answer.length === 0) {
            return;
        }

        const updatedCard = {
            question: this.state.question,
            answer: this.state.answer,
            tags: [this.state.tag],
            user: this.props.user.uid
        };

        db.collection("cards").update(updatedCard)
            .then(function (docRef) {
                this.setState({
                    question: '',
                    answer: ''
                });
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    render() {
        return (
            <div>
                <h1>Edit</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Question:
                <input type="text" name="question" value={this.state.card.question} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Answer:
                <textarea name="answer" value={this.state.card.answer} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Tag:
                <select name="tag" value={this.state.card.tag} onChange={this.handleInputChange}>
                            <option value="css">CSS</option>
                            <option value="react">ReactJS</option>
                            <option value="js">JS</option>
                            <option value="node">NodeJS</option>
                            <option value="express">Express</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}