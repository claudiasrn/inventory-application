const db = require("../db/queries");

async function getCategories(req, res) {
	const categories = await db.getAllCategories();
	res.render("categories", { categories });
}

async function getCategory(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [category, items] = await Promise.all([
		db.getCategoryById(id),
		db.getItemsByCategory(id),
	]);

	if (!category) {
		return res.status(404).render("404");
	}

	res.render("category", { category, items });
}

module.exports = { getCategories, getCategory };
