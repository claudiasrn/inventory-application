const { Router } = require("express");
const { getSuppliers } = require("../controllers/suppliersController");
const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);

module.exports = supplierRouter;