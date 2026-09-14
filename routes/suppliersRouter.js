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
const { requireAdmin } = require("../middleware/adminAuth");
const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/new", getSupplierForm);
supplierRouter.post("/new",requireAdmin, validateSupplier, postSupplierForm);
supplierRouter.get("/:id", getSupplier);
supplierRouter.get("/:id/edit", getSupplierEditForm);
supplierRouter.post("/:id/edit",requireAdmin, validateSupplier, postSupplierEditForm);
supplierRouter.get("/:id/delete", getSupplierDeleteForm);
supplierRouter.post("/:id/delete",requireAdmin, postSupplierDeleteForm);
supplierRouter.get("/:id/link", getSupplierLinkForm);
supplierRouter.post("/:id/link",requireAdmin, validateLink, postSupplierLinkForm);
supplierRouter.post("/:id/items/:itemId/remove",requireAdmin, postSupplierItemRemove);

module.exports = supplierRouter;
