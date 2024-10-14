const mongoose = require('mongoose');

// Check the number of command-line arguments
if (process.argv.length < 3) {
    console.log('Give password as argument');
    process.exit(1); // Exit if no password is provided
}
console.log(process.argv);


const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.xwopx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

console.log('Connecting to: ', url);

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

// Check if arguments were provided to add a new person
if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else if (process.argv.length === 3) {
    // If only password is provided, list all people
    Person.find({}).then((result) => {
        console.log('Phonebook:');
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}

module.exports = mongoose.model('Person', personSchema)