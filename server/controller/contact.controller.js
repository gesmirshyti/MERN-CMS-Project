const Contact = require('../model/contact.model'); 

module.exports.createContact = (req, res) => {
    const { contactName, contactEmail, contactDescription, location } = req.body;
    
    Contact.create({
        contactName,
        contactEmail,
        contactDescription,
        location
    })
    .then((contact) => {
        console.log(contact);
        res.json(contact);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json(err);
    });
}



module.exports.getAllContact = (req ,res) =>{
    Contact.find({}).sort({ name: 'asc' })
    .then(contact => {
        res.json(contact);
    })
    .catch(err => {
        res.json(err)
    })
    }
