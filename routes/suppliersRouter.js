const { Router } = require("express");
const {
	getSuppliers,
	getSupplier,
	getSupplierForm,
	validateSupplier,
	postSupplierForm,
	getSupplierEditForm,
	postSupplierEditForm,
} = require("../controllers/suppliersController");
const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/new", getSupplierForm);
supplierRouter.post("/new", validateSupplier, postSupplierForm);
supplierRouter.get("/:id", getSupplier);
supplierRouter.get("/:id/edit", getSupplierEditForm);
supplierRouter.post("/:id/edit", validateSupplier, postSupplierEditForm);

module.exports = supplierRouter;
