import express from "express"
import auth from "../middleware/auth.js"
import Saving from "../models/Saving.js"

const router = express.Router()

// @route   GET /api/savings
// @desc    Get all savings for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const savings = await Saving.find({ user: req.user.user.id }).sort({ createdAt: -1 })
    res.json(savings)
  } catch (error) {
    console.error("Error fetching savings:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/savings
// @desc    Add a new saving
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { goal, amount, date, targetAmount } = req.body

    const newSaving = new Saving({
      user: req.user.user.id,
      goal,
      amount,
      date: new Date(date),
      targetAmount: targetAmount || amount * 2.5, // Default target if not provided
    })

    const saving = await newSaving.save()
    res.status(201).json(saving)
  } catch (error) {
    console.error("Error creating saving:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/savings/:id
// @desc    Get saving by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const saving = await Saving.findById(req.params.id)

    // Check if saving exists
    if (!saving) {
      return res.status(404).json({ message: "Saving not found" })
    }

    // Check if user owns the saving
    if (saving.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(saving)
  } catch (error) {
    console.error("Error fetching saving:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/savings/:id
// @desc    Update saving
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { goal, amount, date, targetAmount } = req.body

    // Find saving by ID
    let saving = await Saving.findById(req.params.id)

    // Check if saving exists
    if (!saving) {
      return res.status(404).json({ message: "Saving not found" })
    }

    // Check if user owns the saving
    if (saving.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update saving
    saving = await Saving.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          goal,
          amount,
          date: new Date(date),
          targetAmount: targetAmount || saving.targetAmount,
        },
      },
      { new: true },
    )

    res.json(saving)
  } catch (error) {
    console.error("Error updating saving:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/savings/:id
// @desc    Delete saving
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find saving by ID
    const saving = await Saving.findById(req.params.id)

    // Check if saving exists
    if (!saving) {
      return res.status(404).json({ message: "Saving not found" })
    }

    // Check if user owns the saving
    if (saving.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Delete saving
    await Saving.findByIdAndRemove(req.params.id)

    res.json({ message: "Saving removed" })
  } catch (error) {
    console.error("Error deleting saving:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

