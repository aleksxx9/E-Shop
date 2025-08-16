import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const password = process.env.SQL_PW || "";
const username = process.env.SQL_USER || "";

const con = mysql.createConnection({
  host: "localhost",
  user: username,
  password: password,
});

con.connect((err) => {
  if (err) throw err;

  console.log("Succesfully connected to database!");

  const createTable = `CREATE TABLE eShop.cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itemId INT,
    quantity INT
  );`;

  con.query(createTable, (error) => {
    if (error) console.log(error);

    console.log("Item table was succesfully added!");
  });

  con.end();
});
