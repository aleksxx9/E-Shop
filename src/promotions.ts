import { PercentageDiscountParams, JoinedCart } from "./types";

abstract class Promotion {
  abstract discount(item: JoinedCart): JoinedCart;
}

export class itemPromotion extends Promotion {
  itemId: number;

  constructor(id: number) {
    super();
    this.itemId = id;
  }

  discount(item: JoinedCart): JoinedCart {
    const newItem = item;

    if (item.itemId === this.itemId) {
      newItem.quantity = Math.ceil(item.quantity / 2);
    }

    return newItem;
  }
}

export class percentagePromotion extends Promotion {
  discountParams: PercentageDiscountParams;

  constructor(discountParams: PercentageDiscountParams) {
    super();
    this.discountParams = discountParams;
  }

  discount(item: JoinedCart): JoinedCart {
    const newItem = item;

    if (item.price >= this.discountParams.price) {
      newItem.price = Number(
        (
          item.price -
          (item.price / 100) * this.discountParams.percentage
        ).toFixed(2)
      );
    }

    return newItem;
  }
}
