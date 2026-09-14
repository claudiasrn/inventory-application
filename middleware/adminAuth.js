function requireAdmin(req, res, next) {
	if (req.body.password !== process.env.ADMIN_PASSWORD) {
		return res.status(403).render("forbidden");
	}
	next();
}

module.exports = { requireAdmin };