const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId ;// Id mongo assigns all database entries (primary key)

let err;

const getAll = (req, res) => {
  // swagger.tags=['contacts']
  /*
    #swagger.description = 'Returns all contacts in the database.';
    */
    mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .find()
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      };
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    });
};


const getSingle = (req, res) => {
  // swagger.tags=['contacts']
  /*
    #swagger.description = 'Returns a contact from the database using the contacts ID number';
    */
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to find a contact.');
    }
    const contactId = new ObjectId(req.params.id);
    mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find({ _id: contactId })
      .toArray((err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
      });
  };

const createContact = async (req, res) => {
  // swagger.tags=['contacts']
  /*
    #swagger.description = 'Create a contact in the database, every field is required. The contacted ID number is automatically assigned by the database after submition.
     Any field that is ommitted will be set to "NULL"';
    */
     const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
  };

const updateContact = async (req, res) => {
  // swagger.tags=['contacts']
  /*
    #swagger.description = 'Update a contacts information using the contacts ID number.The contacted ID number is automatically assigned by the database after submition.
    Any field that is ommitted will be set to "NULL"';
    */
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to update a contact.');
    }
    const userId = new ObjectId(req.params.id);
    // be aware of updateOne if you only want to update specific fields
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .replaceOne({ _id: contactId }, contact);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
  };
  

const deleteContact = async (req, res) => {
  // swagger.tags=['contacts']
  /*
    #swagger.description = 'Delete a contact from the database using the contacts ID number.';
    */
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to delete a contact.');
    }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
  };

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
}