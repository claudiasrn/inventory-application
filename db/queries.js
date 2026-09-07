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

async function getCounts() {
	const { rows } = await pool.query(
		"SELECT (SELECT COUNT(*) FROM items) AS items, (SELECT COUNT(*) FROM categories) AS categories, (SELECT COUNT(*) FROM suppliers) AS suppliers",
	);
	return rows[0];
}

async function getRecentItems() {
	const { rows } = await pool.query(
		"SELECT * FROM items ORDER BY added_at DESC LIMIT 5",
	);
	return rows;
}

async function getLowStockItems() {
	const { rows } = await pool.query(
		"SELECT * FROM items WHERE stock < 5 ORDER BY stock ASC",
	);
	return rows;
}

module.exports = {
	getAllCategories,
	getCategoryById,
	getItemById,
	getItemsByCategory,
	getCounts,
	getRecentItems,
	getLowStockItems,
};
