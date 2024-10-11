const express = require("express");
const morgan = require("morgan")
const app = express();
const cors = require('cors')


let persons = [
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
];

const date = new Date();

app.use(morgan('tiny'))
app.use(express.json());
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Hello, world');
});


app.get('/api/persons', (rq, res)=>{
    res.json(persons)
});

app.get('/info', (req, res)=>{
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `)
})

app.get('/api/persons/:id', (req, res)=>{
    const id = req.params.id;
    console.log(id);
    
    const person = persons.find(person=>(person.id == id))
    if (!person) {
        return res.status(404).send('Person not found')
    }
    res.json(person)
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end();
})

app.post('/api/persons', (req, res)=>{
    const id = Math.ceil(Math.random() * (9999999) - 5 + 5)

    if(!req.body.number || ! req.body.name){
        return res.status(400).json(
            {
            error: 'no proper content'
        }
        )
    }
    
    const {name, number} = req.body;

    const found = persons.find(person => person.name === name)
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
    }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    
})