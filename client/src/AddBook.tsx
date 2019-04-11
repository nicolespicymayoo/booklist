import React, { Component } from "react"
import { gql } from "apollo-boost"
import { graphql, ChildProps, compose } from "react-apollo"
import "./AddBook.css"
import GenreTag from "./GenreTag"
import { Book, Author } from "./BookList"
import { trashIcon } from "./icons.js"

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

const addRecommendedBook = gql`
  mutation($title: String!, $genre: String!, $author: String!) {
    addRecommendedBook(title: $title, genre: $genre, author: $author) {
      title
      id
    }
  }
`

const deleteRecommendedBook = gql`
  mutation($index: Int!, $title: String!) {
    deleteRecommendedBook(index: $index, title: $title) {
      title
      author {
        name
      }
      genre
    }
  }
`

type State = {
  bookForm: {
    title: string
    author: string
    genre: string
  }
  submittedCount: number
}

type Props = any

type RecommendedBook = Array<Book>

export type Data = {
  loading: boolean
  recommendedBooks?: Array<Book>
}

class AddBook extends Component<Props, State> {
  state: State = {
    bookForm: {
      title: "",
      author: "",
      genre: ""
    },
    submittedCount: 0
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedBookForm = { ...this.state.bookForm, title: e.target.value }
    this.setState({ bookForm: updatedBookForm })
  }

  handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedBookForm = { ...this.state.bookForm, author: e.target.value }
    this.setState({ bookForm: updatedBookForm })
  }

  handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedBookForm = { ...this.state.bookForm, genre: e.target.value }
    this.setState({ bookForm: updatedBookForm })
  }

  submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props
      .addRecommendedBook({
        variables: {
          title: this.state.bookForm.title,
          genre: this.state.bookForm.genre,
          author: this.state.bookForm.author
        }
      })
      .then(() => {
        this.props.getRecommendedBooksQuery.refetch()
      })
      .then(() => {
        let emptyBookForm = { ...this.state.bookForm }
        emptyBookForm.title = ""
        emptyBookForm.author = ""
        emptyBookForm.genre = ""

        this.setState({ submittedCount: this.state.submittedCount + 1, bookForm: emptyBookForm })
      })
  }

  deleteBook = (index: number, title: string) => {
    this.props
      .deleteRecommendedBook({
        variables: {
          index: index,
          title: title
        }
      })
      .then(() => this.props.getRecommendedBooksQuery.refetch())

    this.setState({ submittedCount: this.state.submittedCount - 1 })
  }

  render() {
    return (
      <div className="add-book-container">
        <div className="add-book-intro">
          Feel free to add your fav book or an interesting book you read recently :) Some topics I{" "}
          <span style={{ fontSize: "14px" }}>💙</span>are tech, space, psychology, self-improvement, and poerty (but
          open to anything). Thank you!
        </div>
        <div className="book-form-container">
          <div className="book-form-title">Awesome Book</div>
          <form id="add-book-form" onSubmit={this.submitForm}>
            <input
              placeholder="title"
              className="add-book-field"
              value={this.state.bookForm.title}
              onChange={this.handleTitleChange}
              type="text"
            />
            <input
              placeholder="author"
              className="add-book-field"
              value={this.state.bookForm.author}
              onChange={this.handleAuthorChange}
              type="text"
            />
            <input
              placeholder="genre"
              className="add-book-field"
              value={this.state.bookForm.genre}
              onChange={this.handleGenreChange}
              type="text"
            />
            <button className="add-book-submit-button" type="submit">
              submit
            </button>
          </form>

          <div className="recommended-books-title">Recommended</div>
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
                    {this.state.submittedCount > 0 &&
                    index >= this.props.getRecommendedBooksQuery.recommendedBooks.length - this.state.submittedCount ? (
                      <button className="delete-new-book-button" onClick={() => this.deleteBook(index, book.title)}>
                        {trashIcon}
                      </button>
                    ) : null}
                    <GenreTag genre={book.genre} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(getRecommendedBooksQuery, { name: "getRecommendedBooksQuery" }),
  graphql(addRecommendedBook, { name: "addRecommendedBook" }),
  graphql(deleteRecommendedBook, { name: "deleteRecommendedBook" })
)(AddBook)
