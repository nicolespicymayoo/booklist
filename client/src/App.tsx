import React, { Component } from 'react'
import BookList from './BookList'
import AddBook from './AddBook'
import  ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './App.css';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
})

type State = {
  view: 'booklist' | 'recommend'
}

class App extends Component<{}, State> {
  state: State = {
    view: 'booklist'
  }

  viewBookList = () => {
    this.setState({ view: 'booklist' })
  }

  viewRecommendedBooks = () => {
    this.setState({ view: 'recommend' })
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h2 className="title">
            Nicole's Reading List  <span>📚</span>
          </h2>
            <div>
              <div className="view-toggler-container">
                <div className={`view-option ${this.state.view === 'booklist' ? "active" : null}`} onClick={this.viewBookList}> my list </div>
              <div className={`view-option ${this.state.view === 'recommend' ? "active" : null}`} onClick={this.viewRecommendedBooks}> recommend a book </div>
              </div>
              {this.state.view == 'booklist' ?
                <BookList /> : <AddBook/>
              }
            </div>
            
        </div>
      </ApolloProvider>
    )
  }
}

export default App
