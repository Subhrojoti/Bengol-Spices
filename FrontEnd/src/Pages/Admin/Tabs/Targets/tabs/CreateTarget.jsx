import { useState } from "react";
import { createTarget } from "../../../../../api/services";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

export default function CreateTarget() {
  const [form, setForm] = useState({
    name: "",
    type: "STORE_CREATION",
    requiredCount: "",
    incentiveAmount: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createTarget({
        ...form,
        requiredCount: Number(form.requiredCount),
        incentiveAmount: Number(form.incentiveAmount),
      });

      toast.success("Target created successfully");

      setForm({
        name: "",
        type: "STORE_CREATION",
        requiredCount: "",
        incentiveAmount: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      toast.error("Failed to create target");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ===== CARD ===== */}
      <div
        className="rounded-xl shadow-sm border border-gray-100 p-5 space-y-4"
        style={{
          background:
            "linear-gradient(140deg, rgba(222, 245, 255, 1), rgba(120, 208, 255, 0.68))",
        }}>
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Define target rules and incentives for agents
          </h2>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAME */}
          <div className="col-span-2">
            <label className="text-xs text-gray-900 mb-1 block font-medium">
              Target Name
            </label>
            <input
              type="text"
              placeholder="e.g. Create 2 Stores"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-xs text-gray-900 mb-1 block font-medium">
              Target Type
            </label>
            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="STORE_CREATION">Store Creation</option>
              <option value="ORDER_COLLECTION">Order Collection</option>
            </select>
          </div>

          {/* REQUIRED COUNT */}
          <div>
            <label className="text-xs text-gray-900 mb-1 block font-medium">
              Required Count
            </label>
            <input
              type="number"
              placeholder="e.g. 2"
              value={form.requiredCount}
              onChange={(e) => handleChange("requiredCount", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>

          {/* INCENTIVE */}
          <div>
            <label className="text-xs text-gray-900 mb-1 block font-medium">
              Incentive Amount (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 200"
              value={form.incentiveAmount}
              onChange={(e) => handleChange("incentiveAmount", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>

          {/* START DATE */}
          <div>
            <label className="text-xs text-gray-900 mb-1 block font-medium">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="text-xs text-gray-900 mb-1 block font-medium">
              End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end pt-2">
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              textTransform: "none",
              borderRadius: "10px",

              fontSize: "1rem",
              fontWeight: 600,

              backgroundColor: "#0071bd", // indigo-600
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",

              "&:hover": {
                backgroundColor: "#00548c", // indigo-700
                boxShadow: "0 6px 14px rgba(79, 70, 229, 0.4)",
              },

              "&:active": {
                transform: "scale(0.97)",
              },
            }}>
            Create Target
          </Button>
        </div>
      </div>
    </div>
  );
}
