import React, { Component } from "react"
import { gql } from "apollo-boost"
import { graphql, compose } from "react-apollo"
import { Book } from "./BookList"
import GenreTag from "./GenreTag"
import { trashIcon } from "./icons.js"
import "./Recommended.css"

const getRecommendedBooksQuery = gql`
  {
    recommendedBooks {
      title
      genre
      author {
        name
      }
    }
  }
`

type Props = any

class Recommended extends Component<Props, {}> {
  render() {
    return (
      <div className="book-list">
        <div className="recommended-books" />
        {this.props.getRecommendedBooksQuery && this.props.getRecommendedBooksQuery.recommendedBooks ? (
          <div>
            {this.props.getRecommendedBooksQuery.recommendedBooks.map((book: Book, index: number) => (
              <div className="book" key={`book-${Math.random()}`}>
                <div className="book-left">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author"> {book.author.name}</div>
                </div>
                <div className="book-right">
                  {/* {this.state.submittedCount > 0 &&
                    index >= this.props.getRecommendedBooksQuery.recommendedBooks.length - this.state.submittedCount ? (
                      <button className="delete-new-book-button" onClick={() => this.deleteBook(index, book.title)}>
                        {trashIcon}
                      </button>
                    ) : null} */}
                  <GenreTag genre={book.genre} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}

export default compose(graphql(getRecommendedBooksQuery, { name: "getRecommendedBooksQuery" }))(Recommended)
