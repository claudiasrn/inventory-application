const { Router } = require("express");
const {
	getItems,
	getItem,
	getItemForm,
	validateItem,
	postItemForm,
	getItemEditForm,
	postItemEditForm,
} = require("../controllers/itemsController");
const itemRouter = Router();

itemRouter.get("/", getItems);
itemRouter.get("/new", getItemForm);
itemRouter.post("/new", validateItem, postItemForm);
itemRouter.get("/:id", getItem);
itemRouter.get("/:id/edit", getItemEditForm);
itemRouter.post("/:id/edit", validateItem, postItemEditForm);

module.exports = itemRouter;
