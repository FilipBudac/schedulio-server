const db = require("../models");
const Company = require("../models/Company");
const Contact = db.contact;

exports.findAll = async (req, res) => {
    try {
        const contacts = await Contact.findAll();

        if (Array.isArray(contacts) && !contacts.length) {
            res.sendStatus(204);
        }

        res.json(contacts);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while retrieving Contacts."
            }
        );
    }
};

exports.create = async (req, res) => {
    try {
        const companyName = req.body.company.name;
        let company = await Company.findOne({
            where: { name: companyName }
        });

        if (company == null) {
            company = await Company.create({
                name: companyName
            });
        }

        const contact = await Contact.create({
            email: req.body.email,
            name: req.body.name,
            jobTitle: req.body.jobTitle,
            CompanyId: company.id,
            phoneNumber: req.body.phoneNumber,
            birthday: req.body.birthday,
        });

        // const Creator = Contact.belongsTo(Company);
        // const contact = await Contact.create({
        //     email: req.body.email,
        //     name: req.body.name,
        //     jobTitle: req.body.jobTitle,
        //     Company: {
        //         name: req.body.company.name
        //     },
        //     phoneNumber: req.body.phoneNumber,
        //     birthday: req.body.birthday,
        // }, {
        //     include: [ Creator ]
        // });

        res.status(201).json(contact);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while creating Contact."
            }
        );
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await Contact.findByPk(id);

        if (! contact) {
            res.sendStatus(204);
        }

        res.json(contact);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while retrieving Contact."
            }
        );
    }
};

exports.findByName = async (req, res) => {
    try {
        const name = req.params.name;

        const contact = await Contact.findOne({
            where: { name: name }
        });

        if (contact == null) {
            res.status(404).json({
                    message: `Contact with name ${name} wasn't found.`
                }
            );
        }

        res.json(contact);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while finding Contact."
            }
        );
    }
};

exports.findByPhone = async (req, res) => {
    try {
        const phoneNumber = req.params.phoneNumber;
        const contact = await Contact.findOne({
            where: { phoneNumber: phoneNumber }
        });

        if (contact == null) {
            res.status(404).json({
                    message: `Contact with name ${name} wasn't found.`
                }
            );
        }

        res.json(contact);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while finding Contact."
            }
        );
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        const isUpdated = await Contact.update(req.body, {
            where: { id: id }
        });

        if (! isUpdated) {
            res.status(404).json({
                    message: `Cannot update Contact with id=${id}. Contact not found.`
                }
            );
        }

        res.json(isUpdated);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while Contact update."
            }
        );
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const isDeleted = await Contact.destroy({
            where: { id: id }
        });

        if (! isDeleted) {
            res.status(404).json({
                    message: `Cannot delete Contact with id=${id}. Contact not found.`
                }
            );
        }

        res.json(isDeleted);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while Contact deletion."
            }
        );
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const deletedContacts = await Contact.destroy({
            where: {},
            truncate: false
        });

        if (! deletedContacts.length) {
            res.status(404).json({
                    message: `No Contact was deleted.`
                }
            );
        }

        res.json(deletedContacts);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while Contacts deletion."
            }
        );
    }
};
