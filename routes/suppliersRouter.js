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
	getSupplierLinkForm,
	validateLink,
	postSupplierItemRemove,
	postSupplierLinkForm,
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
supplierRouter.get("/:id/link", getSupplierLinkForm);
supplierRouter.post("/:id/link", validateLink, postSupplierLinkForm);
supplierRouter.post("/:id/items/:itemId/remove", postSupplierItemRemove);

module.exports = supplierRouter;
