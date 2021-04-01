const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const rounds = 10;
const secret = "secret";

exports.signUp = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(rounds);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const user = await User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            password: hash,
        });

        res.status(201).send({
            user: user,
            token: jwt.sign({ data: user}, secret, { expiresIn: '24h'})
        });

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while user sign up."
            }
        );
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll();

        if (Array.isArray(users) && !users.length) {
            res.status(204).send();
        }

        res.send(users);

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            }
        );
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);

        if (! user) {
            res.status(204).send();
        }

        res.send(user);

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            }
        );
    }
};

exports.login = async (req, res) => {
    const email = req.body.email;

    if (email == null || !email.length) {
        res.status(500).send();
    }

    try {
        const user = await User.findOne({ where: { email: email } });

        if (! user) {
            res.status(404).send();
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (! match) {
            res.status(403).send();
        }

        res.status(201).send({
            user: user,
            token: jwt.sign({ data: user }, secret, { expiresIn: '24h' })
        });

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while logging user."
            }
        );
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        const isUpdated = await User.update(req.body, {
            where: { id: id }
        });

        if (! isUpdated) {
            res.status(404).send({
                    message: `Cannot update User with id=${id}. User not found.`
                }
            );
        }

        res.json(isUpdated);

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while user update."
            }
        );
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const isDeleted = await User.destroy({
            where: { id: id }
        });

        if (! isDeleted) {
            res.status(404).send({
                    message: `Cannot delete User with id=${id}. User not found.`
                }
            );
        }

        res.json(isDeleted);

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while user deletion."
            }
        );
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const deletedUsers = await User.destroy({
            where: {},
            truncate: false
        });

        if (! deletedUsers.length) {
            res.status(404).send({
                    message: `No User was deleted.`
                }
            );
        }

        res.json(deletedUsers);

    } catch (err) {
        res.status(500).send({
                message: err.message || "Some error occurred while users deletion."
            }
        );
    }
};
