
// const sequelize = require('./sequelize')
// const Sequelize = require('sequelize');
// const User = require('./user');

// const Role = sequelize.define('role', {
//     // attributes

//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     },
//     createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW
//     },
//     updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW
//     }
// });

// Role.hasMany(User, {
//     foreignKey: "userId",
//     as: "user",
// });

// module.exports = Role;

