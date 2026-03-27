import { useState } from "react";
import { assignLocation } from "../../../../api/services";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

export default function AssignLocation() {
  const [form, setForm] = useState({
    agentId: "",
    pincodes: "",
    state: "",
    city: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.agentId || !form.pincodes || !form.state || !form.city) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      agentId: form.agentId,
      pincodes: form.pincodes.split(",").map((p) => p.trim()),
      state: form.state,
      city: form.city,
    };

    try {
      await assignLocation(payload);
      toast.success("Location assigned successfully");

      setForm({
        agentId: "",
        pincodes: "",
        state: "",
        city: "",
      });
    } catch (err) {
      toast.error("Failed to assign location");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* HEADER */}
      <div
        className="fixed top-0 left-[3%] right-0 z-10 bg-white border-b border-slate-200 px-8 flex items-center justify-between"
        style={{ height: 64 }}>
        <h1 className="text-base font-bold tracking-tight text-lg text-slate-800">
          Assign Location
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* CARD */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
          style={{
            background:
              "linear-gradient(140deg, rgba(222, 245, 255, 1), rgba(120, 208, 255, 0.68))",
          }}>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              Assign location to agent
            </h2>
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AGENT ID */}
            <div>
              <label className="text-xs text-gray-900 mb-1 block font-medium">
                Agent ID
              </label>
              <input
                type="text"
                placeholder="Enter agent ID"
                value={form.agentId}
                onChange={(e) => handleChange("agentId", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              />
            </div>

            {/* STATE */}
            <div>
              <label className="text-xs text-gray-900 mb-1 block font-medium">
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              />
            </div>

            {/* CITY */}
            <div>
              <label className="text-xs text-gray-900 mb-1 block font-medium">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              />
            </div>

            {/* PINCODES (FULL WIDTH) */}
            <div className="col-span-3">
              <label className="text-xs text-gray-900 mb-1 block font-medium">
                Pincodes
              </label>
              <input
                type="text"
                placeholder="Enter pincodes separated by commas (e.g. 700082,700041)"
                value={form.pincodes}
                onChange={(e) => handleChange("pincodes", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
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
                backgroundColor: "#0071bd",
                boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",

                "&:hover": {
                  backgroundColor: "#00548c",
                  boxShadow: "0 6px 14px rgba(79, 70, 229, 0.4)",
                },

                "&:active": {
                  transform: "scale(0.97)",
                },
              }}>
              Assign Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
