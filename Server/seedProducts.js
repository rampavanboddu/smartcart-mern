require("dotenv").config();

const axios = require("axios");
const connectDB = require("./config/db");
const Product = require("./models/Product");

connectDB();

const importProducts = async () => {
  try {

    const { data } = await axios.get("https://dummyjson.com/products");

    const products = data.products
      .filter(
        (item) =>
          item.category === "smartphones" ||
          item.category === "laptops" ||
          item.category === "mens-shoes" ||
          item.category === "womens-shoes"
      )
      .map((item) => ({
        name: item.title,
        image: item.thumbnail,
        brand: item.brand || "Generic",
        category:
          item.category === "smartphones"
            ? "Mobile"
            : item.category === "laptops"
            ? "Laptop"
            : item.category === "mens-shoes" || item.category === "womens-shoes"
            ? "Shoes"
            : "Other",
        description: item.description,
        price: item.price,
        countInStock: item.stock || 10,
      }));

    await Product.insertMany(products);

    console.log("✅ Electronics & Shoes Products Imported Successfully");
    process.exit();

  } catch (error) {
    console.log("❌ Import Error:", error.message);
    process.exit(1);
  }
};

importProducts();