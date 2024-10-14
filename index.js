require('dotenv').config()
const express = require("express");
const morgan = require("morgan")
const app = express();
const cors = require('cors')
const Person = require('./models/person')


/* let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]; */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
  
    next(error)
  }
  

const date = new Date();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/', (req, res)=>{
    res.send('Hello, world');
});


app.get('/api/persons', (req, res)=>{
    //res.json(persons)
    Person.find({})
    .then(persons =>{
        console.log(persons);
        
        res.json(persons)
    })
    .catch(error =>{
        console.log("Error fetching persons: ", error);
        res.status(500).send('Error fetching persons')
    })
});

app.get('/info', (req, res)=>{
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `)
})

app.get('/api/persons/:id', (req, res, next)=>{
    /* const id = req.params.id;
    console.log(id);
    
    const person = persons.find(person=>(person.id == id))
    if (!person) {
        return res.status(404).send('Person not found')
    }
    res.json(person) */
    Person.findById(req.params.id)
    .then( person =>{
        if(person){
            res.json(person)
        }else{
            res.status(404).end()
        }
    })
    .catch(error =>next(error))
})

app.delete('/api/persons/:id', (req, res, next)=>{
    /* const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end(); */
    Person.findByIdAndDelete(req.params.id)
    .then(result =>{
        res.status(204).end();
    })
    .catch(error=> next (error));
})


app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

app.post('/api/persons', (req, res, next)=>{
    //const id = Math.ceil(Math.random() * (9999999) - 5 + 5)

    if(!req.body.number || ! req.body.name){
        return res.status(400).json(
            {
            error: 'no proper content'
        }
        )
    }
    
    const {name, number} = req.body;

    /* const found = persons.find(person => person.name === name)
    if (found) {
        return res.status(400).json(
            {
            error: 'Name already in the phonebook'
        })
    }else{
        const person = {
            id: id,
            name: name,
            number: number
        }
    
        persons = persons.concat(person)
    
        res.json(person)
    } */

    const person = new Person({
        name : name,
        number: number
    })

    console.log(person);
    

    person.save().then( savedPerson =>{
        res.json(savedPerson)
    })
    .catch(error=> next(error))
})

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    
})