import { useEffect, useState } from "react";
import { getLeaderboard } from "../../../../api/services";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard();
      if (res.success) {
        const sorted = res.data.sort((a, b) => a.rank - b.rank);
        setLeaders(sorted.slice(0, 3));
        setData(sorted); // full list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Leaderboard</h2>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {leaders.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">
            <div className="text-2xl mb-2">{user.medal}</div>

            <img
              src={user.profileImage}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto object-cover mb-3"
            />

            <h3 className="font-semibold text-gray-800">{user.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{user.agentId}</p>

            <div className="flex justify-between text-sm mt-4">
              <div>
                <p className="text-gray-400 text-xs">Sales</p>
                <p className="font-semibold text-indigo-600">₹{user.sales}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Orders</p>
                <p className="font-semibold">{user.ordersDelivered}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Stores</p>
                <p className="font-semibold">{user.storesCreated}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Improved Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-5 py-3 border-b text-sm text-gray-500 font-medium">
          All staff
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Agent</th>

                {/* Center aligned headers */}
                <th className="px-4 py-3 text-center">Orders</th>
                <th className="px-4 py-3 text-center">Sales</th>
                <th className="px-4 py-3 text-center">Collected</th>
                <th className="px-4 py-3 text-center">Returns</th>
                <th className="px-4 py-3 text-center">Stores</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.map((user, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-none hover:bg-gray-50 transition ${
                    user.rank <= 3 ? "bg-yellow-50/40" : ""
                  }`}>
                  {/* Rank */}
                  <td className="px-4 py-3 flex items-center gap-2">
                    <span>{user.medal}</span>
                    <span>{user.rank}</span>
                  </td>

                  {/* Agent */}
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.agentId}</p>
                    </div>
                  </td>

                  {/* Center aligned values */}
                  <td className="px-4 py-3 text-center">
                    {user.ordersDelivered}
                  </td>
                  <td className="px-4 py-3 text-center text-indigo-600 font-medium">
                    ₹{user.sales}
                  </td>
                  <td className="px-4 py-3 text-center">₹{user.collected}</td>
                  <td className="px-4 py-3 text-center">{user.returns}</td>
                  <td className="px-4 py-3 text-center">
                    {user.storesCreated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="p-5 text-center text-gray-400">
            No leaderboard data
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
