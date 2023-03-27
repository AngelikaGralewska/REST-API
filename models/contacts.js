const fs = require("fs").promises;

const {Contact} = require("../schema/contactSchema")

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (_id) => {
  const contact = await Contact.findOne({_id})
  return contact;
}

const removeContact = async (_id) => {
  await Contact.findByIdAndDelete({ _id });
}

const addContact = async (name, email, phone, favorite) => {
    const contact = new Contact({ name, email, phone, favorite });
    contact.save();
    return contact;
}


const updateContact = async (id, newContact) => {
    const upContact = await Contact.findByIdAndUpdate(id, newContact);
    return upContact;
}

const updateStatusContact = async (id, favorite) =>{
    const updatedStatus = await Contact.findByIdAndUpdate(id, { favorite });
    return updatedStatus;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}