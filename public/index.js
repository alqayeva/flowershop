const API = "/api/products";
const list = document.getElementById("list");
const msg = document.getElementById("msg");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category");
const sortEl = document.getElementById("sort");

function show(text, type) {
  msg.textContent = text;
  msg.className = type || "";
}

async function loadCategories() {
  const res = await fetch(API);
  const all = await res.json();
  const current = categoryEl.value;
  const names = [...new Set(all.map((p) => p.category))].sort();

  categoryEl.replaceChildren(new Option("All categories", ""));
  names.forEach((n) => categoryEl.add(new Option(n, n)));
  categoryEl.value = names.includes(current) ? current : "";
}

async function loadProducts() {
  const params = new URLSearchParams();
  if (searchEl.value.trim()) params.set("search", searchEl.value.trim());
  if (categoryEl.value) params.set("category", categoryEl.value);
  if (sortEl.value) params.set("sort", sortEl.value);

  try {
    const res = await fetch(API + "?" + params);
    if (!res.ok) throw new Error("Server returned " + res.status);
    render(await res.json());
  } catch (err) {
    show("Failed to load products: " + err.message, "error");
  }
}

function render(products) {
  list.replaceChildren();

  if (products.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No products found. Add a new one using the form above.";
    list.append(li);
    return;
  }

  products.forEach((p) => {
    const li = document.createElement("li");

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = p.name;

    const cat = document.createElement("div");
    cat.className = "cat";
    cat.textContent = p.category;
    left.append(name, cat);

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = p.price + " ₼";

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete " + p.name);
    del.addEventListener("click", () => removeProduct(p));

    li.append(left, price, del);
    list.append(li);
  });
}

async function removeProduct(p) {
  if (!confirm("Delete " + p.name + "?")) return;

  try {
    const res = await fetch(API + "/" + p.id, { method: "DELETE" });
    if (!res.ok) throw new Error("Server returned " + res.status);
    show(p.name + " deleted", "ok");
    await loadCategories();
    await loadProducts();
  } catch (err) {
    show("Failed to delete: " + err.message, "error");
  }
}

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const body = {
    name: form.name.value.trim(),
    price: Number(form.price.value),
    category: form.category.value.trim(),
  };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Server " + res.status);

    form.reset();
    show(data.name + " added successfully", "ok");
    await loadCategories();
    await loadProducts();
  } catch (err) {
    show("Failed to add product: " + err.message, "error");
  }
});

let timer;

searchEl.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(loadProducts, 250);
});

categoryEl.addEventListener("change", loadProducts);
sortEl.addEventListener("change", loadProducts);

loadCategories().then(loadProducts);