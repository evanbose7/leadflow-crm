const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const Lead = require("../models/Lead");

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const leadValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Converted", "Lost"])
    .withMessage("Invalid status"),
  body("value").optional().isNumeric().withMessage("Value must be a number"),
];

// GET /api/leads — get all leads with search, filter, sort, pagination
router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      source,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET /api/leads/stats — dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const [statusCounts, sourceCounts, totalValue, recentLeads, monthlyTrend] = await Promise.all([
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: null, total: { $sum: "$value" } } }]),
      Lead.find().sort({ createdAt: -1 }).limit(5).select("name company status createdAt"),
      Lead.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
    ]);

    const total = await Lead.countDocuments();
    const converted = statusCounts.find((s) => s._id === "Converted")?.count || 0;

    res.json({
      success: true,
      data: {
        total,
        conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0,
        totalValue: totalValue[0]?.total || 0,
        byStatus: statusCounts,
        bySource: sourceCounts,
        recentLeads,
        monthlyTrend,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET /api/leads/:id
router.get("/:id", param("id").isMongoId().withMessage("Invalid lead ID"), handleValidationErrors, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// POST /api/leads
router.post("/", leadValidation, handleValidationErrors, async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ success: true, data: lead, message: "Lead created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "A lead with this email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// PUT /api/leads/:id
router.put(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid lead ID"), ...leadValidation],
  handleValidationErrors,
  async (req, res) => {
    try {
      const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
      res.json({ success: true, data: lead, message: "Lead updated successfully" });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ success: false, message: "A lead with this email already exists" });
      }
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
);

// PATCH /api/leads/:id/status — quick status update
router.patch(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid lead ID"),
    body("status").isIn(["New", "Contacted", "Qualified", "Converted", "Lost"]).withMessage("Invalid status"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
      if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
      res.json({ success: true, data: lead, message: "Status updated" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
);

// DELETE /api/leads/:id
router.delete("/:id", param("id").isMongoId().withMessage("Invalid lead ID"), handleValidationErrors, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// DELETE /api/leads — bulk delete
router.delete("/", body("ids").isArray({ min: 1 }).withMessage("IDs array required"), handleValidationErrors, async (req, res) => {
  try {
    const result = await Lead.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true, message: `${result.deletedCount} leads deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;