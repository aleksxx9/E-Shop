# SETUP

To setup firstly .env file needs to be created. You can copy everything from `.env.example`.

After .env is setup we can build and run mySql database in docker image by running `docker compose up -d mysql` command.

Then we need to run database table migrations. There are two tables - cart and items. Each table has it's migration that needs to be run: `ts-node migrations/cart.ts`, `ts-node migrations/items.ts`.

**Note that only items table populates with mock data**

Then we need to install node packages by running `npm install`

After all comands have been succesfully launched we can finaly start program by running `npm start`

# USAGE

Every api can be found in `src/server.ts` file. There are their methods and needed params:

**In this example all api's will be written with localhost, if it's not working it can be replaced with local ip aka `127.0.0.1`. In `.example.env` defined port is 300 so all api's will be also displayed with such port**

### Items requests

`localhost:300/getItems.json` - shows all available items from items table;

`localhost:300/:itemId/getItems.json` - gets item by itemId;
**itemId - number;**

### Cart requests

`localhost:300/getCart.json` - shows all available items from cart table;

`localhost:300/:itemId/:quantity/addToCard.json` - adds item to cart table;
**itemId - number, quantity - number;**
**Note. there's no cart update request as add to card handles add, update, and delete if count falls below zero itself!**

`localhost:300/:itemId/deleteItemFromCart.json` - deletes item from cart table;
**itemId - number**

### Mixed requests

`localhost:300/getCartTotal.json` - gets joined cart and item table, checks and applies promotions and calculates cart and items totals.
