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

  const createTable = `CREATE TABLE eShop.items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) not null,
    price float 
  );`;

  const addItems = `INSERT INTO  eShop.items (name, price)
    VALUES ("Scizzors", 5.99),
    ("Monitor", 180.2),
    ("Lightbulb", 3.99),
    ("Hoodie", 59.49),
    ("Phone", 880.8),
    ("Electric scooter", 269.55),
    ("Keyboard", 59.99);
  `;

  con.query(createTable, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Item table was succesfully added!");
    }
  });

  con.query(addItems, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Items succesfully added!");
    }
  });

  con.end();
});
