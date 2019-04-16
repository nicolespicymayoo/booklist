const graphql = require("graphql")

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql

// dummy data
const books = [
  {
    title: "Never Split the Difference",
    genre: "Negotiation",
    id: 3,
    authorID: 3
  },
  {
    title: "Man's Search for Meaning",
    genre: "Autobiography",
    id: 6,
    authorID: 4
  },
  {
    title: "Wild",
    genre: "Autobiography",
    id: 6,
    authorID: 7
  },
  {
    title: "Cracking the Code Interview",
    genre: "Technology",
    id: 1,
    authorID: 1
  },
  { title: "The Alchemist", genre: "Fantasy", id: 2, authorID: 2 }
]

const authors = [
  { name: "Gayle Laakman McDowell", id: 1 },
  { name: "Paulo Coelho", id: 2 },
  { name: "Chris Voss", id: 3 },
  { name: "Viktor E. Frankl", id: 4 },
  { name: "Michael Talbot", id: 5 },
  { name: "Trevor Noah", id: 6 },
  { name: "Cheryl Strayed", id: 7 }
]

const recommendedBooks = [
  { title: "Holographic Universe", genre: "Fantasy", id: 01, authorID: 5 },
  { title: "Born a Crime", genre: "Autobiography", id: 02, authorID: 6 }
]

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return authors.find(obj => obj.id == parent.authorID)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books.filter(obj => obj.authorID == parent.id)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return books.find(obj => obj.id == args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authors.find(obj => obj.id == args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors
      }
    },
    recommendedBooks: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return recommendedBooks
      }
    }
  }
})

let newID = 11

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addRecommendedBook: {
      type: new GraphQLList(BookType),
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let authorid
        let recommendedBook
        let currAuthor = authors.find(obj => obj.name.toLowerCase() === args.author.toLowerCase())

        if (args.title && args.genre && args.author) {
          if (currAuthor == undefined || currAuthor == null) {
            authorid = newID + 1
            newID = newID + 1
            let promise = new Promise((resolve, reject) => {
              authors.push({ name: args.author, id: authorid })
              resolve()
              reject("error")
            })
            promise.then(() => {
              recommendedBook = {
                title: args.title,
                genre: args.genre,
                authorID: authorid
              }
              recommendedBooks.push(recommendedBook)
            })
          }
          if (currAuthor !== undefined) {
            recommendedBook = {
              title: args.title,
              genre: args.genre,
              authorid: currAuthor.id
            }
            recommendedBooks.push(recommendedBook)
          }
          return recommendedBooks
        }
      }
    },
    deleteRecommendedBook: {
      type: new GraphQLList(BookType),
      args: {
        index: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        // find the recommended book with args.id
        // delete it
        // return recommended books :D
        if (recommendedBooks[args.index].title == args.title) {
          recommendedBooks.splice(args.index, 1)
        }
        return recommendedBooks
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
