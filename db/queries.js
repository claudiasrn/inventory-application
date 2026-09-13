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

async function insertCategory(name, description) {
	const { rows } = await pool.query(
		"INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id",
		[name, description],
	);
	return rows[0].id;
}

async function insertSupplier(name, contactEmail, country) {
	const { rows } = await pool.query(
		"INSERT INTO suppliers (name, contact_email, country) VALUES ($1, $2, $3) RETURNING id",
		[name, contactEmail || null, country || null],
	);
	return rows[0].id;
}

async function insertItem(name, description, price, stock, categoryId) {
	const { rows } = await pool.query(
		`INSERT INTO items (name, description, price, stock, category_id)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		[name, description || null, price, stock, categoryId],
	);
	return rows[0].id;
}

async function updateCategory(id, name, description) {
	await pool.query(
		`UPDATE categories
		 SET name = $2, description = $3
		 WHERE id = $1`,
		[id, name, description || null],
	);
}

async function updateSupplier(id, name, contactEmail, country) {
	await pool.query(
		`UPDATE suppliers
		 SET name = $2, contact_email = $3, country = $4
		 WHERE id = $1`,
		[id, name, contactEmail || null, country || null],
	);
}

async function updateItem(id, name, description, price, stock, categoryId) {
	await pool.query(
		`UPDATE items
		 SET name = $2, description = $3, price = $4, stock = $5, category_id = $6
		 WHERE id = $1`,
		[id, name, description || null, price, stock, categoryId],
	);
}

async function deleteCategory(id) {
	await pool.query("DELETE FROM categories WHERE id = $1", [id]);
}

async function deleteItem(id) {
	await pool.query("DELETE FROM items WHERE id = $1", [id]);
}

async function deleteSupplier(id) {
	await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
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
	insertCategory,
	insertSupplier,
	insertItem,
	updateCategory,
	updateSupplier,
	updateItem,
	deleteCategory,
	deleteItem,
	deleteSupplier,
};
