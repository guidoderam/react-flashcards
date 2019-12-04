import React from 'react';
import {db} from "../../firebase.js";

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: 'js',
            question: '',
            answer: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        const question = this.state.question;
        const answer = this.state.answer;
        const tags = [this.state.tag];
        const user = this.props.user.uid;

        if (question.length === 0 ||
            answer.length === 0 ||
            !user) {
            return;
        }

        const newCard = {
            question,
            answer,
            tags,
            user
        };

        db.collection("cards").add(newCard)
            .then((docRef) => {
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
                <h1>Create</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Question:
                <input type="text" name="question" value={this.state.question} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Answer:
                <textarea name="answer" value={this.state.answer} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Tag:
                <select name="tag" value={this.state.tag} onChange={this.handleInputChange}>
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