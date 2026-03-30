import Agent from "../models/Agent.js";
import Order from "../models/Order.js";
import Return from "../models/Return.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import Store from "../models/store.js";

export const getLeaderboard = async ({ from, to, limit = 10 }) => {
  const start = new Date(from);
  const end = new Date(to);

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
  // 🟡 TARGET + INCENTIVE
  // =========================
  const progress = await AgentTargetProgress.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$agentId",
        incentive: { $sum: "$incentiveEarned" },
        targetAchieved: {
          $sum: {
            $cond: ["$targetAchieved", 1, 0],
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
  // 🧠 MERGE DATA
  // =========================
  const map = {};

  orders.forEach((o) => {
    map[o._id] = {
      agentId: o._id,
      ordersDelivered: o.ordersDelivered,
      sales: o.sales,
      collected: o.collected,
      returns: 0,
      incentive: 0,
      targetAchieved: 0,
      storesCreated: 0,
    };
  });

  returns.forEach((r) => {
    if (!map[r._id]) map[r._id] = { agentId: r._id };
    map[r._id].returns = r.returns;
  });

  progress.forEach((p) => {
    if (!map[p._id]) map[p._id] = { agentId: p._id };
    map[p._id].incentive = p.incentive;
    map[p._id].targetAchieved = p.targetAchieved;
  });

  stores.forEach((s) => {
    if (!map[s._id]) map[s._id] = { agentId: s._id };
    map[s._id].storesCreated = s.storesCreated;
  });

  // =========================
  // 👤 FETCH AGENT DETAILS
  // =========================
  const agentIds = Object.keys(map);

  const agents = await Agent.find({
    agentId: { $in: agentIds },
  }).select("agentId name documents.photo addressDetails.state");

  const agentMap = {};
  agents.forEach((a) => {
    agentMap[a.agentId] = a;
  });

  const leaderboard = Object.values(map)
    .sort((a, b) => b.sales - a.sales)
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

        // ✅ NEW FIELD
        state: agentInfo?.addressDetails?.state || "N/A",

        ordersDelivered: agent.ordersDelivered || 0,
        sales: agent.sales || 0,
        collected: agent.collected || 0,
        returns: agent.returns || 0,
        incentive: agent.incentive || 0,
        targetAchieved: agent.targetAchieved || 0,
        storesCreated: agent.storesCreated || 0,
      };
    });
  return leaderboard;
};
