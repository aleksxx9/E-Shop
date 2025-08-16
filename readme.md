# SETUP

To setup firstly you will need to setup .env file. You can copy everything from `.env.example`.
After .env is setup we can build and run mySql database in docker image by running `docker compose up -d mysql` command.
Then we need to run database table migration. There are three tables - cart, items and promotions. Each table needs file in migration needs to be run: `ts-node migrations/cart.ts`, `ts-node migrations/items.ts`, `ts-node migrations/promotions.ts`. (**Note that only items table populates with mock data**)
After all comands have been succesfully launched we can finaly start program by running `npm start`

# USAGE

Every api can be found in `src/server.ts` file. There are their methods and needed params:

**In this example all api's will be written with localhost, if it's not working it can be replaced with local ip aka `127.0.0.1`. In `.example.env` defined port is 300 so all api's will be also displayed with such port**

## Items requests

`localhost:300/getItems.json` - shows all available items from items table;

`localhost:300/:itemId/getItems.json` - gets item by itemId; itemId - number;

## Cart requests

`localhost:300/getCart.json` - shows all available items from cart table;

`localhost:300/:itemId/:quantity/addToCard.json` - adds item to cart table; itemId - number, quantity - number; **Note. there's no cart update request as add to card handles add, update, and delete if count falls below zero itself!**

`localhost:300/:itemId/deleteItemFromCart.json` - deletes item from cart table; itemId - number

## Promotions

`localhost:300/getFree/:itemId/addItemDiscount.json` - adds `Buy one get one free` discount to promotions table; itemId - number;

`localhost:300/percentage/:discountPrice/:discountPercentage/addPercentageDiscount.json` - adds `percentage discount from selected value`; discountPrice - number, discountPercentage - number;

`localhost:300/getPromotions.json` - gets all available promotions from promotions table;

`localhost:300/:promotionId/deletePromotion.json` - deletes selected promotion by id; promotionId - number

## Mixed

`localhost:300/getCartTotal.json` - get all cart items, checks and applies promotions and calculates cart and items totals.
