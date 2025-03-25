import express from "express"
import auth from "../middleware/auth.js"
import Income from "../models/Income.js"

const router = express.Router()

// @route   GET /api/incomes
// @desc    Get all incomes for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.user.id }).sort({ date: -1 })
    res.json(incomes)
  } catch (error) {
    console.error("Error fetching incomes:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/incomes
// @desc    Add a new income
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { source, amount, date } = req.body

    const newIncome = new Income({
      user: req.user.user.id,
      source,
      amount,
      date: new Date(date),
    })

    const income = await newIncome.save()
    res.status(201).json(income)
  } catch (error) {
    console.error("Error creating income:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/incomes/:id
// @desc    Get income by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id)

    // Check if income exists
    if (!income) {
      return res.status(404).json({ message: "Income not found" })
    }

    // Check if user owns the income
    if (income.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(income)
  } catch (error) {
    console.error("Error fetching income:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/incomes/:id
// @desc    Update income
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { source, amount, date } = req.body

    // Find income by ID
    let income = await Income.findById(req.params.id)

    // Check if income exists
    if (!income) {
      return res.status(404).json({ message: "Income not found" })
    }

    // Check if user owns the income
    if (income.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update income
    income = await Income.findByIdAndUpdate(
      req.params.id,
      { $set: { source, amount, date: new Date(date) } },
      { new: true },
    )

    res.json(income)
  } catch (error) {
    console.error("Error updating income:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/incomes/:id
// @desc    Delete income
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find income by ID
    const income = await Income.findById(req.params.id)

    // Check if income exists
    if (!income) {
      return res.status(404).json({ message: "Income not found" })
    }

    // Check if user owns the income
    if (income.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Delete income
    await Income.findByIdAndRemove(req.params.id)

    res.json({ message: "Income removed" })
  } catch (error) {
    console.error("Error deleting income:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

