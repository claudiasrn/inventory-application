const pool = require("./pool");

async function getAllCategories() {
	const { rows } = await pool.query(
		"SELECT id, name, description, (SELECT COUNT(*) FROM items WHERE items.category_id = categories.id) AS item_count FROM categories ORDER BY name",
	);
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
		"SELECT * FROM items WHERE category_id = $1 ORDER BY name",
		[categoryId],
	);

	return rows;
}

async function getItemById(id) {
	const { rows } = await pool.query(
		"SELECT items.id, items.name, items.description, items.price, items.stock, items.category_id, items.added_at, categories.name AS category_name FROM items JOIN categories ON items.category_id = categories.id WHERE items.id = $1",
		[id],
	);
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
		"SELECT * FROM items ORDER BY added_at DESC, name LIMIT 5",
	);
	return rows;
}

async function getLowStockItems() {
	const { rows } = await pool.query(
		"SELECT * FROM items WHERE stock < 5 ORDER BY stock ASC, name",
	);
	return rows;
}

async function getAllItems() {
	const { rows } = await pool.query(
		"SELECT items.id, items.name, items.price, items.stock, categories.name AS category_name FROM items JOIN categories ON items.category_id = categories.id ORDER BY items.name",
	);
	return rows;
}

async function getSuppliersByItem(itemId) {
	const { rows } = await pool.query(
		"SELECT suppliers.id, suppliers.name, item_suppliers.wholesale_price FROM item_suppliers JOIN suppliers ON item_suppliers.supplier_id = suppliers.id WHERE item_suppliers.item_id = $1 ORDER BY suppliers.name",
		[itemId],
	);
	return rows;
}

async function getAllSuppliers() {
	const { rows } = await pool.query(
		"SELECT id, name, contact_email, country, (SELECT COUNT(*) FROM item_suppliers WHERE item_suppliers.supplier_id = suppliers.id) AS item_count FROM suppliers ORDER BY name",
	);
	return rows;
}

async function getSupplierById(id) {
	const { rows } = await pool.query("SELECT * FROM suppliers WHERE id = $1", [
		id,
	]);
	return rows[0];
}

async function getItemsBySupplier(supplierId) {
	const { rows } = await pool.query(
		"SELECT items.id, items.name, items.price, item_suppliers.wholesale_price FROM item_suppliers JOIN items ON item_suppliers.item_id = items.id WHERE item_suppliers.supplier_id = $1 ORDER BY items.name",
		[supplierId],
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
	getAllItems,
	getSuppliersByItem,
	getAllSuppliers,
	getSupplierById,
	getItemsBySupplier,
};
