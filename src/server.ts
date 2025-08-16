import express from "express";
import dotenv from "dotenv";
import * as serverUtils from "./serverUtils";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.get("/getCart.json", async (req, res) => {
  const cart = await serverUtils.getCart();

  res.status(cart.status).send(cart.res);
});

app.get("/getItems.json", async (req, res) => {
  const items = await serverUtils.getItems();

  res.status(items.status).send(items.res);
});

app.get("/:itemId/getItem.json", async (req, res) => {
  const item = await serverUtils.getItem(req);

  res.status(item.status).send(item.res);
});

app.put("/:itemId/:quantity/addToCard.json", async (req, res) => {
  const items = await serverUtils.addItemsToCart(req);

  res.status(items.status).send(items.res);
});

app.delete("/:itemId/deleteItemFromCart.json", async (req, res) => {
  const response = await serverUtils.deleteItemFromCart(req);

  res.status(response.status).send(response.res);
});

app.get("/getCartTotal.json", async (req, res) => {
  const response = await serverUtils.getCartTotal();

  res.status(response.status).send(response.res);
});

app.post("/getFree/:itemId/addItemDiscount.json", async (req, res) => {
  const response = await serverUtils.addItemDiscount(req);

  res.status(response.status).send(response.res);
});

app.post(
  "/percentage/:discountPrice/:discountPercentage/addPercentageDiscount.json",
  async (req, res) => {
    const response = await serverUtils.addPercentageDiscount(req);

    res.status(response.status).send(response.res);
  }
);

app.get("/getPromotions.json", async (req, res) => {
  const response = await serverUtils.getPromotions();

  res.status(response.status).send(response.res);
});

app.delete("/:promotionId/deletePromotion.json", async (req, res) => {
  const response = await serverUtils.deleteDiscount(req);

  res.status(response.status).send(response.res);
});

app
  .listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
