import React, { Component } from "react"
import BookList from "./BookList"
import AddBook from "./AddBook"
import Recommended from "./Recommended"
import ViewOption from "./ViewOption"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import "./App.scss"

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV == "production" ? "https://booklist-api.onrender.com/graphql" : "http://localhost:4000/graphql"
})

type State = {
  view: "favs" | "recommended by others" | "add a book"
}

class App extends Component<{}, State> {
  state: State = {
    view: "favs"
  }

  viewFavs = () => {
    this.setState({ view: "favs" })
  }

  viewRecommendedBooks = () => {
    this.setState({ view: "recommended by others" })
  }
  viewAddBookForm = () => {
    this.setState({ view: "add a book" })
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h2 className="title">
            Nicole's Reading List <span>📚</span>
          </h2>
          <div>
            <div className="view-toggler-container">
              <ViewOption view="favs" setView={this.viewFavs} currView={this.state.view} />
              <ViewOption view="recommended by others" setView={this.viewRecommendedBooks} currView={this.state.view} />
              <ViewOption view="add a book" setView={this.viewAddBookForm} currView={this.state.view} />
            </div>
            {this.state.view == "favs" ? <BookList /> : this.state.view == "add a book" ? <AddBook /> : <Recommended />}
          </div>
        </div>
      </ApolloProvider>
    )
  }
}

export default App
