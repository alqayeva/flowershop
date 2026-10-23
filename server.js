const express = require("express");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("Flowershop app isleyir");
});

app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "False json" });
  }
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server working: ${PORT}`);
});