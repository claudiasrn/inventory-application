const { Router } = require("express");
const { getItems, getItem } = require("../controllers/itemsController");
const itemRouter = Router();

itemRouter.get("/", getItems);
itemRouter.get("/:id", getItem);

module.exports = itemRouter;
