const { Router } = require("express");
const { getItems } = require("../controllers/itemsController");
const itemRouter = Router();

itemRouter.get("/", getItems);

module.exports = itemRouter;
