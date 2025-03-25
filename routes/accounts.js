import express from "express"
import auth from "../middleware/auth.js"
import Account from "../models/Account.js"

const router = express.Router()

// @route   GET /api/accounts
// @desc    Get all accounts for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.user.id }).sort({ createdAt: -1 })
    res.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/accounts
// @desc    Create a new account
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, balance } = req.body

    const newAccount = new Account({
      user: req.user.user.id,
      name,
      type,
      balance,
    })

    const account = await newAccount.save()
    res.status(201).json(account)
  } catch (error) {
    console.error("Error creating account:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/accounts/:id
// @desc    Get account by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)

    // Check if account exists
    if (!account) {
      return res.status(404).json({ message: "Account not found" })
    }

    // Check if user owns the account
    if (account.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(account)
  } catch (error) {
    console.error("Error fetching account:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/accounts/:id
// @desc    Update account
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, type, balance } = req.body

    // Find account by ID
    let account = await Account.findById(req.params.id)

    // Check if account exists
    if (!account) {
      return res.status(404).json({ message: "Account not found" })
    }

    // Check if user owns the account
    if (account.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update account
    account = await Account.findByIdAndUpdate(req.params.id, { $set: { name, type, balance } }, { new: true })

    res.json(account)
  } catch (error) {
    console.error("Error updating account:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/accounts/:id
// @desc    Delete account
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find account by ID
    const account = await Account.findById(req.params.id)

    // Check if account exists
    if (!account) {
      return res.status(404).json({ message: "Account not found" })
    }

    // Check if user owns the account
    if (account.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Delete account
    await Account.findByIdAndRemove(req.params.id)

    res.json({ message: "Account removed" })
  } catch (error) {
    console.error("Error deleting account:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

