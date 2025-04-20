const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const db = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/products", async (req, res) => {
  try {
    const products = await db.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await db.order.findMany();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = await db.order.create({
      data: req.body,
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = await db.product.create({
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.order.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.product.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Product deleted", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server started on https://fresh-bulk.onrender.com");
});
