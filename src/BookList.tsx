import React, { Component } from "react"
import { gql } from "apollo-boost"
import { graphql, ChildProps } from "react-apollo"
import GenreTag from "./GenreTag"
import "./BookList.css"

export type Book = {
  title: string
  genre: string
  id: number
  author: Author
}

export type Author = {
  name: string
}

export type Props = {
  data?: Data
}

export type Data = {
  loading: boolean
  books?: Array<Book>
}

const getBooksQuery = gql`
  {
    books {
      title
      genre
      author {
        name
      }
    }
  }
`

class BookList extends Component<ChildProps<Props>> {
  render() {
    return (
      <div>
        {this.props.data && this.props.data.loading ? (
          "loading.."
        ) : (
          <div className="book-list">
            {this.props.data && this.props.data.books ? (
              <div>
                {this.props.data.books.map(book => (
                  <div className="book" key={`book-${Math.random()}`}>
                    <div className="book-left">
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">{book.author.name}</div>
                    </div>
                    <GenreTag genre={book.genre} />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                no books <span style={{ fontSize: "10px" }}>😕</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default graphql(getBooksQuery)(BookList)
