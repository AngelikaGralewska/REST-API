const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");


const listContacts = async () => {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    return parsedContacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact)=> contact.id === contactId);
  return contact;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactRemove = contacts.filter((contact)=> contact.id !== contactId)
  const parsedContactsRemove = JSON.stringify(contactRemove);
  await fs.writeFile(contactsPath, parsedContactsRemove);
  return contacts;
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const contactAdd = { id: `${contacts.length + 10}`, ...body };
  contacts.push(contactAdd);
  const parsedContactsAdded = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, parsedContactsAdded);
  return contactAdd;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((contact)=> contact.id === contactId);
  if (contactIndex === -1) {
    return null;}
  contacts[contactIndex] = {...contacts[contactIndex], ...body};
  const parsedContactsUp = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, parsedContactsUp);
  return contacts[contactIndex];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}