import express from "express";
import dotenv from "dotenv";
import * as dbRequest from "./dbRequests";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.get("/getCart.json", async (req, res) => {
  const cart = await dbRequest.getCart();

  res.status(cart.status).send(cart.res);
});

app.get("/getItems.json", async (req, res) => {
  const items = await dbRequest.getItems();

  res.status(items.status).send(items.res);
});

app.get("/:itemId/getItem.json", async (req, res) => {
  const item = await dbRequest.getItem(req);

  res.status(item.status).send(item.res);
});

app.put("/:itemId/:quantity/addToCard.json", async (req, res) => {
  const items = await dbRequest.addItemsToCart(req);

  res.status(items.status).send(items.res);
});

app.delete("/:itemId/deleteItemFromCart.json", async (req, res) => {
  const response = await dbRequest.deleteItemFromCart(req);

  res.status(response.status).send(response.res);
});

app.get("/getCartTotal.json", async (req, res) => {
  const response = await dbRequest.getCartTotal();

  res.status(response.status).send(response.res);
});

app
  .listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });

