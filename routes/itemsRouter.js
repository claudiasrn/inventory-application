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
} = require("../controllers/itemsController");
const itemRouter = Router();

itemRouter.get("/", getItems);
itemRouter.get("/new", getItemForm);
itemRouter.post("/new", validateItem, postItemForm);
itemRouter.get("/:id", getItem);
itemRouter.get("/:id/edit", getItemEditForm);
itemRouter.post("/:id/edit", validateItem, postItemEditForm);
itemRouter.get("/:id/delete", getItemDeleteForm);
itemRouter.post("/:id/delete", postItemDeleteForm);

module.exports = itemRouter;
