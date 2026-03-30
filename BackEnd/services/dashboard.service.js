import Order from "../models/Order.js";
import Return from "../models/Return.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import Store from "../models/store.js";

export const getAgentDashboard = async ({ agentId, from, to }) => {
  const start = new Date(from);
  const end = new Date(to);

  // 🔥 COMMON MATCH
  const orderMatch = {
    agentId,
    createdAt: { $gte: start, $lte: end },
  };

  const returnMatch = {
    agentId,
    createdAt: { $gte: start, $lte: end },
  };

  const progressMatch = {
    agentId,
    createdAt: { $gte: start, $lte: end },
  };

  const storeMatch = {
    registeredBy: agentId,
    createdAt: { $gte: start, $lte: end },
  };

  // 🚀 PARALLEL EXECUTION (VERY IMPORTANT)
  const [orderData, returnData, progressData, storeCount] = await Promise.all([
    // =========================
    // 🟢 ORDER AGGREGATION
    // =========================
    Order.aggregate([
      { $match: orderMatch },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,

                totalOrdersDelivered: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0],
                  },
                },

                totalCancelled: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0],
                  },
                },

                totalSalesAmount: { $sum: "$totalAmount" },
                totalCollected: { $sum: "$paidAmount" },
                totalDue: { $sum: "$dueAmount" },
              },
            },
          ],

          monthly: [
            {
              $group: {
                _id: {
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" },
                },

                ordersDelivered: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0],
                  },
                },

                cancelled: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0],
                  },
                },

                sales: { $sum: "$totalAmount" },
                collected: { $sum: "$paidAmount" },
                due: { $sum: "$dueAmount" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
        },
      },
    ]),

    // =========================
    // 🔴 RETURNS
    // =========================
    Return.aggregate([
      { $match: returnMatch },
      {
        $group: {
          _id: null,
          totalReturns: { $sum: 1 },
        },
      },
    ]),

    // =========================
    // 🟡 TARGET + INCENTIVE
    // =========================
    AgentTargetProgress.aggregate([
      { $match: progressMatch },
      {
        $group: {
          _id: null,
          totalIncentive: { $sum: "$incentiveEarned" },
          targetAchievedCount: {
            $sum: {
              $cond: ["$targetAchieved", 1, 0],
            },
          },
        },
      },
    ]),

    // =========================
    // 🟣 STORE COUNT
    // =========================
    Store.countDocuments(storeMatch),
  ]);

  // =========================
  // 🧠 FORMAT DATA
  // =========================

  const summary = orderData[0]?.summary[0] || {};

  const returns = returnData[0]?.totalReturns || 0;
  const progress = progressData[0] || {};

  // 🗓️ MONTH FORMAT
  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthly = (orderData[0]?.monthly || []).map((m) => ({
    month: monthNames[m._id.month],
    year: m._id.year,
    ordersDelivered: m.ordersDelivered,
    cancelled: m.cancelled,
    sales: m.sales,
    collected: m.collected,
    due: m.due,
  }));

  // =========================
  // 🧠 FILL MISSING MONTHS (VERY IMPORTANT)
  // =========================

  const fillMissingMonths = (monthly, from, to) => {
    const result = [];
    const start = new Date(from);
    const end = new Date(to);

    const monthMap = {};
    monthly.forEach((m) => {
      monthMap[`${m.month}-${m.year}`] = m;
    });

    const current = new Date(start);

    while (current <= end) {
      const month = current.toLocaleString("default", { month: "short" });
      const year = current.getFullYear();

      const key = `${month}-${year}`;

      result.push(
        monthMap[key] || {
          month,
          year,
          ordersDelivered: 0,
          cancelled: 0,
          sales: 0,
          collected: 0,
          due: 0,
        },
      );

      current.setMonth(current.getMonth() + 1);
    }

    return result;
  };

  // =========================
  // 🎯 FINAL RESPONSE
  // =========================
  const finalMonthly = fillMissingMonths(monthly, from, to);

  const calculateGrowth = (monthly) => {
    if (monthly.length < 2) return 0;

    const last = monthly[monthly.length - 1].sales;
    const prev = monthly[monthly.length - 2].sales;

    if (prev === 0) return 100;

    return (((last - prev) / prev) * 100).toFixed(2);
  };

  return {
    summary: {
      totalOrdersDelivered: summary.totalOrdersDelivered || 0,
      totalCancelled: summary.totalCancelled || 0,
      totalReturns: returns,
      totalSalesAmount: summary.totalSalesAmount || 0,
      totalCollected: summary.totalCollected || 0,
      totalDue: summary.totalDue || 0,
      totalIncentive: progress.totalIncentive || 0,
      targetAchievedCount: progress.targetAchievedCount || 0,
      totalStoresCreated: storeCount || 0,
    },

    monthly: finalMonthly,
    growth: {
      salesGrowth: calculateGrowth(finalMonthly),
    },
  };
};
