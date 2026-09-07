const db = require("../db/queries");
const { formatRelativeDate } = require("../utils/date");

async function indexGet(req, res) {
	const [counts, recent, lowStock] = await Promise.all([
		db.getCounts(),
		db.getRecentItems(),
		db.getLowStockItems(),
	]);
	res.render("index", { counts, recent, lowStock, formatRelativeDate });
}

module.exports = {
	indexGet,
};
