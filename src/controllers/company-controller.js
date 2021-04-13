const db = require("../models");
const Company = db.company;

exports.findAll = async (req, res) => {
    try {
        const companies = await Company.findAll();

        if (Array.isArray(companies) && !companies.length) {
            res.sendStatus(204);
        }

        res.json(companies);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while retrieving Companies."
            }
        );
    }
};

exports.create = async (req, res) => {
    try {

        const company = await Company.create({
            name: req.body.name
        });

        res.status(201).json(company);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while creating Company."
            }
        );
    }
};

exports.findByName = async (req, res) => {
    try {
        const name = req.params.name;

        const company = await Company.findOne({
            where: { name: name }
        });

        if (company == null) {
            res.status(404).json({
                    message: `Company with name ${name} wasn't found.`
                }
            );
        }

        res.json(company);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while finding Company."
            }
        );
    }
};

