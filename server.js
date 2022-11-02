//mongodb
require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

//cors
const cors = require("cors");
app.use(cors());

const UserRouter = require("./api/User");
const ProductRouter = require("./api/Product");
const StoreRouter = require("./api/Store");
const CartRouter = require("./api/Cart");
const OrderRouter = require("./api/Order");
const UserProductRouter = require("./api/UserProduct");
//const authRouter = require("./api/auth");

//For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use("/user", UserRouter);
app.use("/product", ProductRouter);
app.use("/store", StoreRouter);
app.use("/cart", CartRouter);
app.use("/order", OrderRouter);
app.use("/userProduct", UserProductRouter);
//app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})