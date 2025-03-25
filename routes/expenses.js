import express from "express"
import auth from "../middleware/auth.js"
import Expense from "../models/Expense.js"

const router = express.Router()

// @route   GET /api/expenses
// @desc    Get all expenses for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.user.id }).sort({ date: -1 })
    res.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { category, amount, date } = req.body

    const newExpense = new Expense({
      user: req.user.user.id,
      category,
      amount,
      date: new Date(date),
    })

    const expense = await newExpense.save()
    res.status(201).json(expense)
  } catch (error) {
    console.error("Error creating expense:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(expense)
  } catch (error) {
    console.error("Error fetching expense:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { category, amount, date } = req.body

    // Find expense by ID
    let expense = await Expense.findById(req.params.id)

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update expense
    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: { category, amount, date: new Date(date) } },
      { new: true },
    )

    res.json(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find expense by ID
    const expense = await Expense.findById(req.params.id)

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Delete expense
    await Expense.findByIdAndRemove(req.params.id)

    res.json({ message: "Expense removed" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

