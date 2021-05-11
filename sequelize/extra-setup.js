function applyExtraSetup(sequelize) {
	const { user, role,user_role_mappings } = sequelize.models;

	user.belongsToMany(role, { through: user_role_mappings })
	role.belongsToMany(user, { through: user_role_mappings })
	// role.belongsTo(user);
}

module.exports = { applyExtraSetup };