const { Model, DataTypes } = require('sequelize');
const db = require('./index');
const Company = require("../models/Company");

class Contact extends Model {}


Contact.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobTitle: {
        type: DataTypes.STRING,
        field: 'job_title'
    },
    // company: {
    //     type: DataTypes.INTEGER,
    //     field: 'company_id',
    //     references: {
    //         model: 'company',
    //         key: 'id'
    //     },
    // },
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    birthday: DataTypes.STRING,

}, {
    tableName: 'contact',
    timestamps: true,
    createdAt: false,
    sequelize: db.sequelize,
    modelName: 'Contact'
});

Contact.Company = Contact.belongsTo(Company);


(async() => {
    try {
        await Contact.sync();
    } catch (error) {
        console.error('Unable to sync Contact:', error);
    }
})();

module.exports = Contact;