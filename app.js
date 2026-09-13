const path = require("node:path");
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const categoryRouter = require("./routes/categoriesRouter");
const itemRouter = require("./routes/itemsRouter");
const supplierRouter = require("./routes/suppliersRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/categories", categoryRouter);
app.use("/items", itemRouter);
app.use("/suppliers", supplierRouter);

app.listen(process.env.PORT || 8080, () => {
	console.log("Server running");
});
