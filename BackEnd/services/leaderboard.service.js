import Agent from "../models/Agent.js";
import Order from "../models/Order.js";
import Return from "../models/Return.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import Store from "../models/store.js";

export const getLeaderboard = async ({ from, to, limit = 10 }) => {
  const start = new Date(from);
  const end = new Date(to);

  const startStr = start.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const endStr = end.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  // =========================
  // 🟢 ORDERS
  // =========================
  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$agentId",
        ordersDelivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0],
          },
        },
        sales: { $sum: "$totalAmount" },
        collected: { $sum: "$paidAmount" },
      },
    },
  ]);

  // =========================
  // 🔴 RETURNS
  // =========================
  const returns = await Return.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$agentId",
        returns: { $sum: 1 },
      },
    },
  ]);

  // =========================
  // 🟡 TARGET (NEW SYSTEM)
  // =========================
  const progress = await AgentTargetProgress.aggregate([
    {
      $match: {
        date: { $gte: startStr, $lte: endStr }, // ✅ FIXED
      },
    },
    {
      $group: {
        _id: "$agentId",
        earnedAmount: { $sum: "$earnedAmount" }, // ✅ NEW FIELD
        completedTargets: {
          $sum: {
            $cond: ["$isCompleted", 1, 0], // ✅ NEW FIELD
          },
        },
      },
    },
  ]);

  // =========================
  // 🟣 STORES
  // =========================
  const stores = await Store.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$registeredBy",
        storesCreated: { $sum: 1 },
      },
    },
  ]);

  // =========================
  // 🧠 MERGE
  // =========================
  const map = {};

  orders.forEach((o) => {
    map[o._id] = {
      agentId: o._id,
      ordersDelivered: o.ordersDelivered,
      sales: o.sales,
      collected: o.collected,
      returns: 0,
      earnedAmount: 0,
      completedTargets: 0,
      storesCreated: 0,
    };
  });

  returns.forEach((r) => {
    if (!map[r._id]) map[r._id] = { agentId: r._id };
    map[r._id].returns = r.returns;
  });

  progress.forEach((p) => {
    if (!map[p._id]) map[p._id] = { agentId: p._id };
    map[p._id].earnedAmount = p.earnedAmount;
    map[p._id].completedTargets = p.completedTargets;
  });

  stores.forEach((s) => {
    if (!map[s._id]) map[s._id] = { agentId: s._id };
    map[s._id].storesCreated = s.storesCreated;
  });

  // =========================
  // 👤 AGENT DETAILS
  // =========================
  const agentIds = Object.keys(map);

  const agents = await Agent.find({
    agentId: { $in: agentIds },
  }).select("agentId name documents.photo addressDetails.state");

  const agentMap = {};
  agents.forEach((a) => {
    agentMap[a.agentId] = a;
  });

  // =========================
  // 🏆 FINAL LEADERBOARD
  // =========================
  const leaderboard = Object.values(map)
    .sort((a, b) => b.earnedAmount - a.earnedAmount) // 🔥 FIXED
    .slice(0, limit)
    .map((agent, index) => {
      const agentInfo = agentMap[agent.agentId] || {};

      return {
        rank: index + 1,
        medal:
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null,

        agentId: agent.agentId,
        name: agentInfo.name || "Unknown",
        profileImage: agentInfo?.documents?.photo || null,
        state: agentInfo?.addressDetails?.state || "N/A",

        // 📊 METRICS
        earnedAmount: agent.earnedAmount || 0, // 🔥 MAIN KPI
        completedTargets: agent.completedTargets || 0,

        ordersDelivered: agent.ordersDelivered || 0,
        sales: agent.sales || 0,
        collected: agent.collected || 0,
        returns: agent.returns || 0,
        storesCreated: agent.storesCreated || 0,
      };
    });

  return leaderboard;
};
