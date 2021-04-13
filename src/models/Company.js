const { Model, DataTypes } = require('sequelize');
const db = require('./index');

class Company extends Model {}


Company.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    },
}, {
    tableName: 'company',
    timestamps: true,
    createdAt: false,
    sequelize: db.sequelize,
    modelName: 'Company'
});


(async() => {
    try {
        await Company.sync();
    } catch (error) {
        console.error('Unable to sync Contact:', error);
    }
})();

module.exports = Company;