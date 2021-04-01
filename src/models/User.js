const { Model, DataTypes } = require('sequelize');
const db = require('./index');

class User extends Model {}


User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    email: DataTypes.STRING,
    firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
    },
    password: DataTypes.STRING
}, {
    tableName: 'user',
    timestamps: true,
    createdAt: false,
    sequelize: db.sequelize,
    modelName: 'User'
});

module.exports = User;
