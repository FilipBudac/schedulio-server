const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

exports.signUp = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const user = await User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
        });

        const accessToken = jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);

        res.status(201).json({
            user: user,
            token: accessToken,
            refreshToken: refreshToken,
            expiresIn: 86400
        });

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while user sign up."
            }
        );
    }
};

exports.logout = async (req, res) => {
    const refreshToken = req.headers.refresh_token;

    refreshTokens = refreshTokens.filter(token => token !== refreshToken);

    res.sendStatus(204);
};


exports.login = async (req, res) => {
    const email = req.body.email;
    if (email == null || !email.length) {
        res.sendStatus(500);
    }

    try {
        const user = await User.findOne({
            where: { email: email }
        });

        if (! user) {
            res.sendStatus(404);
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (! match) {
            res.sendStatus(403);
        }

        const accessToken = jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign({ data: user }, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);

        res.status(200).json({
            user: user,
            token: accessToken,
            refreshToken: refreshToken,
            expiresIn: 86400
        });

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while user log in."
            }
        );
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.headers.refresh_token;

        if (refreshToken == null) {
            res.sendStatus(401);
        }

        if (!refreshTokens.includes(refreshToken)) {
            res.sendStatus(403);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.sendStatus(403);
            }

            const accessToken = jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

            res.json({
                token: accessToken,
                expiresIn: 86400
            });
        });
    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while refreshing token."
            }
        );
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll();

        if (Array.isArray(users) && !users.length) {
            res.sendStatus(204);
        }

        res.json(users);

    } catch (err) {
        res.status(500).json({
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
            res.sendStatus(204);
        }

        res.json(user);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while retrieving user."
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
            res.status(404).json({
                    message: `Cannot update User with id=${id}. User not found.`
                }
            );
        }

        res.json(isUpdated);

    } catch (err) {
        res.status(500).json({
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
            res.status(404).json({
                    message: `Cannot delete User with id=${id}. User not found.`
                }
            );
        }

        res.json(isDeleted);

    } catch (err) {
        res.status(500).json({
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
            res.status(404).json({
                    message: `No User was deleted.`
                }
            );
        }

        res.json(deletedUsers);

    } catch (err) {
        res.status(500).json({
                message: err.message || "Some error occurred while users deletion."
            }
        );
    }
};
