const pool = require("./pool");

async function getAllCategories() {
	const { rows } = await pool.query("SELECT * FROM categories");
	return rows;
}

async function getCategoryById(id) {
	const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [
		id,
	]);
	return rows[0];
}

async function getItemsByCategory(categoryId) {
	const { rows } = await pool.query(
		"SELECT * FROM items WHERE category_id = $1",
		[categoryId],
	);

	return rows;
}

async function getItemById(id) {
	const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
	return rows[0];
}

module.exports = {
	getAllCategories,
	getCategoryById,
	getItemById,
	getItemsByCategory,
};
