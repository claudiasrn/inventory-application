const db = require("../db/queries");

async function getCategories(req, res) {
	const categories = await db.getAllCategories();
	res.render("categories", { categories });
}

module.exports = { getCategories };
