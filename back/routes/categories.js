const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Получить все категории
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить категорию по ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать категорию
router.post("/new-category", async (req, res) => {
  try {
    const { name, type } = req.body; // можно добавить icon, color если хочешь
    if (!name || !type) return res.status(400).json({ message: "Name and type are required" });

    const category = await Category.create({ name, type });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить категорию
router.put("/update/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.update(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить категорию
router.delete("/delete/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
