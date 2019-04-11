import React, { Component } from "react"
import './BookList';
export default class GenreTag extends Component {
  render() {
    return (
      <div>
        <div className="book-genre">{this.props.genre}</div>
      </div>
    )
  }
}
