const { Router } = require("express");
const {
	getItems,
	getItem,
	getItemForm,
	validateItem,
	postItemForm,
	getItemEditForm,
	postItemEditForm,
	getItemDeleteForm,
	postItemDeleteForm,
	validateLink,
	getItemLinkForm,
	postItemLinkForm,
	postItemSupplierRemove,
} = require("../controllers/itemsController");
const { requireAdmin } = require("../middleware/adminAuth");
const itemRouter = Router();

itemRouter.get("/", getItems);
itemRouter.get("/new", getItemForm);
itemRouter.post("/new",requireAdmin, validateItem, postItemForm);
itemRouter.get("/:id", getItem);
itemRouter.get("/:id/edit", getItemEditForm);
itemRouter.post("/:id/edit",requireAdmin, validateItem, postItemEditForm);
itemRouter.get("/:id/delete", getItemDeleteForm);
itemRouter.post("/:id/delete", requireAdmin, postItemDeleteForm);
itemRouter.get("/:id/link", getItemLinkForm);
itemRouter.post("/:id/link",requireAdmin, validateLink, postItemLinkForm);
itemRouter.post("/:id/suppliers/:supplierId/remove", requireAdmin, postItemSupplierRemove);

module.exports = itemRouter;
