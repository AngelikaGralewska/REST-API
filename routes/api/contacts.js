const express = require('express');
const Joi = require('joi');

const{
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

const {contactSchema} = require("../../schema/contactSchema");

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
      const { name, email, phone, favorite } = req.body;
      const addedContact = await addContact(name, email, phone, favorite);
      return res.status(201).json(addedContact);
    } catch (error){
      return res.status(400).json({message: "Missing required fields"})
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
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: "missing fields"});
  }
  try {
    if (!contactId) {
      return res.status(404).json({message: "Not found"});
    } else {
    const upContact = await updateContact(contactId, req.body);
    return res.status(200).json(upContact);}
  } catch {
    res.status(500).json({message: "something wrong"});
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: "missing field favorite"});
  }
  try {
    const upStatus = await updateStatusContact(contactId, favorite);
    if (upStatus) {
      res.status(200).json(upStatus);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch {
    res.status(500).json({message: "something wrong"});
  }
});

module.exports = router