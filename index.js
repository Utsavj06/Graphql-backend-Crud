const express = require('express')

const { graphqlHTTP } = require('express-graphql')
const { GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLString, GraphQLScalarType, GraphQLList, GraphQLError } = require('graphql')

const app = express()

const userList = [
    {
      id: 1,
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com"
    },
    {
      id: 2,
      "name": "Bob Smith",
      "email": "bob.smith@example.com"
    },
    {
      id: 3,
      "name": "Charlie Brown",
      "email": "charlie.brown@example.com"
    },
    {
      id: 4,
      "name": "Diana Prince",
      "email": "diana.prince@example.com"
    },
    {
      id: 5,
      "name": "Ethan Hunt",
      "email": "ethan.hunt@example.com"
    }
  ]
  

const UserType = new GraphQLObjectType({
    name : "UserType",
    fields: () => ({
        id: {type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        //to get all users
        users: {
            type: new GraphQLList(UserType),
            resolve(){
                return userList
            }
        },
        // to get user by id
        user: {
            type: UserType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args){
                return userList.find((user)=> user.id == args.id)
            }
        }
    }
})

const mutations = new GraphQLObjectType({
    name: 'mutations',
    fields:{
        //adding user
        addUser: {
            type: UserType,
            args:{ name: {type: GraphQLString}, email: {type: GraphQLString} },
            resolve(parent, {name, email}){
                const newUser = { name, email, id: Date.now().toString()}
                userList.push(newUser)
                return newUser
            }
        },
        updateUser: {
            type: UserType,
            args: { id: {type: GraphQLID}, name: {type: GraphQLString}, email: {type: GraphQLString} },
            resolve(parent, {id, name, email}){
                const user = userList.find(u => u.id == id)
                user.email = email
                user.name = name
                return user
            }
        },
        deleteUser: {
            type: UserType,
            args: { id: {type: GraphQLID} },
            resolve(parent, {id}){
                const user = userList.find((u) => u.id == id)
                userList.filter((u) => u.id !== id)
                return user
            }
        }
    }
})

const schema = new GraphQLSchema({ query: RootQuery , mutation: mutations})

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(5000, ()=>console.log('start'))