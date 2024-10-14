const mongoose = require('mongoose');

const url = process.env.MONGODB_URI
//const url = `mongodb+srv://fullstack:${password}@cluster0.xwopx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

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
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(v){
          return /^\d{2,3}-\d+$/.test(v)
        },
        message: props => `${props.value} is not valid`
      },
      minLength: 8
    }
});


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Person', personSchema)