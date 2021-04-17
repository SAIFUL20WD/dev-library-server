const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnwxy.mongodb.net/tasks?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const booksCollection = client.db("tasks").collection("todo");
  const ordersCollection = client.db("tasks").collection("orders");

    
  app.get('/books', (req, res) => {
    booksCollection.find({}).toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addBook', (req, res) => {
    const bookDetail = req.body
    booksCollection.insertOne(bookDetail)
    .then( result => {
      res.send(result.insertedCount > 0)
    })
    .catch(error => console.log(error))
  })

  app.get('/book/:_id', (req, res) => {
    const bookId = ObjectID(req.params._id)
    booksCollection.findOne({_id: bookId})
    .then(result => res.send(result))
    .catch(error => console.log(error))
  })

  app.delete('/delete/:id', (req, res) => {
    const bookId = ObjectID(req.params.id)
    booksCollection.findOneAndDelete({_id: bookId})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
    .catch(error => console.log(error))
  })

  app.post('/placeOrder', (req, res) => {
    const orderDetail = req.body
    ordersCollection.insertOne(orderDetail)
    .then( result => {
      res.send(result.insertedCount > 0)
    })
    .catch(error => console.log(error))
  })

  app.get('/orders', (req, res) => {
    const userEmail = req.query.email
    ordersCollection.find({email: userEmail}).toArray( (err, documents) => {
      res.send(documents)
    })
  })

  //   client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
