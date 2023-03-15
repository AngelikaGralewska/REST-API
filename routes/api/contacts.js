const express = require('express');
const Joi = require('joi');

const{
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact
} = require("../../models/contacts");

const {schema} = require("../../schema/contactSchema");

const router = express.Router();


router.get('/', async (req, res, next) => {
    const contacts = await listContacts();
    res.status(200).json(contacts);
})

router.get('/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).send("Not found");
    }
    res.status(200).json(contact);
  })

router.post('/', async (req, res, next) => {
  try {
   await schema.validateAsync(req.body)
   const addedContact = await addContact(req.body);
   return res.status(201).json(addedContact);
  } catch (error){
    return res.status(400).json({message: "Missing required field"});
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    await removeContact(contactId);
    return res.status(200).json({message: "Contact deleted"});
  } catch {
    return res.status(404).json({ message: "Not found!" });
  }
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    if (!contactId) {
      return res.status(404).json({message: "Not found"});
    } else{
    await schema.validateAsync(req.body);
    const upContact = await updateContact(contactId, req.body);
    return res.status(200).json(upContact);}
  } catch (error){
    return res.status(400).json({message: "Missing fields"})
  }
})

module.exports = router
