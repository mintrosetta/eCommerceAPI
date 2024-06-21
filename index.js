require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const cardRoutes = require('./routes/card.route');
const orderRoutes = require('./routes/order.route');
const authRoutes = require('./routes/auth.route');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('DB connection successful')
})
.catch((err) => console.log(err));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cards", cardRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/auths", authRoutes);


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});