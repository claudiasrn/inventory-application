const { Router } = require("express");
const {
	getItems,
	getItem,
	getItemForm,
	validateItem,
	postItemForm,
} = require("../controllers/itemsController");
const itemRouter = Router();

itemRouter.get("/", getItems);
itemRouter.get("/new", getItemForm);
itemRouter.post("/new", validateItem, postItemForm);
itemRouter.get("/:id", getItem);

module.exports = itemRouter;
