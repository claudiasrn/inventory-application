const { Router } = require("express");
const {
	getSuppliers,
	getSupplier,
} = require("../controllers/suppliersController");
const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplier);

module.exports = supplierRouter;
