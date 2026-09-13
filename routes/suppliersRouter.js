const { Router } = require("express");
const {
	getSuppliers,
	getSupplier,
	getSupplierForm,
	validateSupplier,
	postSupplierForm,
	getSupplierEditForm,
	postSupplierEditForm,
	getSupplierDeleteForm,
	postSupplierDeleteForm,
} = require("../controllers/suppliersController");
const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/new", getSupplierForm);
supplierRouter.post("/new", validateSupplier, postSupplierForm);
supplierRouter.get("/:id", getSupplier);
supplierRouter.get("/:id/edit", getSupplierEditForm);
supplierRouter.post("/:id/edit", validateSupplier, postSupplierEditForm);
supplierRouter.get("/:id/delete", getSupplierDeleteForm);
supplierRouter.post("/:id/delete", postSupplierDeleteForm);

module.exports = supplierRouter;
