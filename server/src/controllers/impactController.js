const { getStorage } = require('../data/storage');

// @desc    Get environmental impact dashboard data
// @route   GET /api/impact
const getImpact = async (req, res) => {
  try {
    const storage = getStorage();
    const userId = req.user ? req.user.id : null;
    const stats = await storage.getImpactStats(userId);

    return res.json({
      success: true,
      data: {
        ...stats,
        methodology: {
          note: 'Estimates are modeled after the US EPA Waste Reduction Model (WARM) durable goods lifecycle averages. Values reflect estimated waste diverted from landfill and associated embodied emissions prevented via reuse. Actual savings may vary depending on material composition and logistics.',
          conversionFactors: {
            co2PerKgWasteDiverted: '1.85 kg CO2e per kg durable good reused',
            treeAbsorptionRate: '21.77 kg CO2 per mature tree annually',
          },
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getImpact };
