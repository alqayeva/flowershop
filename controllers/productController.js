const { readProducts, writeProducts } = require("../utils/fileDb");

function getProducts(req, res) {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  let result = readProducts();

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (minPrice) {
    result = result.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }
  if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  }

  res.json(result);
}

function getProductById(req, res) {
  const id = Number(req.params.id);
  const product = readProducts().find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product is not found" });
  }
  res.json(product);
}

function createProduct(req, res) {
  const { name, price, category } = req.body || {};

  if (!name || price === undefined || !category) {
    return res.status(400).json({ message: "name, price və category məcburidir" });
  }

  const products = readProducts();
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    price,
    category,
  };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
}

function updateProduct(req, res) {
  const id = Number(req.params.id);
  const products = readProducts();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product is not found" });
  }

  const { name, price, category } = req.body || {};
  if (!name || price === undefined || !category) {
    return res.status(400).json({ message: "name, price və category reuqired" });
  }

  product.name = name;
  product.price = price;
  product.category = category;

  writeProducts(products);
  res.json(product);
}

function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const products = readProducts();
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product is not found" });
  }

  const deleted = products.splice(index, 1);
  writeProducts(products);
  res.json(deleted[0]);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};