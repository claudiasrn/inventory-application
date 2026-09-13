const db = require("../db/queries");

async function getCategories(req, res) {
	const categories = await db.getAllCategories();
	res.render("categories", { categories });
}

async function getCategory(req, res) {
	const id = Number(req.params.id);

	const [category, items] = await Promise.all([
		db.getCategoryById(id),
		db.getItemsByCategory(id),
	]);

	res.render("category", { category, items });
}

module.exports = { getCategories, getCategory };
