const { Router } = require("express");
const {
	getSuppliers,
	getSupplier,
	getSupplierForm,
	validateSupplier,
	postSupplierForm,
} = require("../controllers/suppliersController");
const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/new", getSupplierForm);
supplierRouter.post("/new", validateSupplier, postSupplierForm);
supplierRouter.get("/:id", getSupplier);

module.exports = supplierRouter;
