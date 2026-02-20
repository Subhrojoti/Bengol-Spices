import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createEmployee,
  getAllEmployees,
  updateProductPermission,
} from "../../../../api/services";
import { Tabs, Tab } from "@mui/material";

const HEADER_HEIGHT = 64;

const EmpCreation = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [permissionLoadingId, setPermissionLoadingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch Employee details
  useEffect(() => {
    if (activeTab === "all") {
      fetchEmployees();
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      setEmpLoading(true);
      const response = await getAllEmployees();

      if (response.success) {
        setEmployees(response.employees || []);
      } else {
        toast.error("Failed to fetch employees");
      }
    } catch (error) {
      toast.error("Error fetching employees");
    } finally {
      setEmpLoading(false);
    }
  };

  console.log("Updating permission for:", confirmModal);

  const handleConfirmPermission = async (employee) => {
    if (!employee?.employeeId) {
      toast.error("Invalid employee ID");
      return;
    }

    console.log("Updating permission for:", employee);

    const newPermission = !employee.canManageProducts;

    try {
      setPermissionLoadingId(employee.employeeId);

      const response = await updateProductPermission(employee.employeeId, {
        canManageProducts: newPermission,
      });

      if (response.success) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employeeId === employee.employeeId
              ? { ...emp, canManageProducts: newPermission }
              : emp,
          ),
        );

        toast.success(
          newPermission ? "Product access granted" : "Product access removed",
        );
      } else {
        toast.error("Failed to update permission");
      }
    } catch (error) {
      toast.error("Error updating permission");
    } finally {
      setPermissionLoadingId(null);
      setConfirmModal(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await createEmployee(form);
      toast.success("Employee created successfully");
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create employee",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div
        className="fixed top-0 left-[3%] right-0 z-10 bg-white border-b border-slate-200 px-8 flex items-center justify-between"
        style={{ height: HEADER_HEIGHT }}>
        <h1 className="text-base font-medium tracking-tight text-slate-800">
          Employee Management
        </h1>

        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{
            minHeight: 48,

            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "#000 !important", // force black
            },

            "& .MuiTab-root.Mui-selected": {
              color: "#000 !important", // keep black when selected
              fontWeight: 600,
            },
          }}
          slotProps={{
            indicator: {
              sx: {
                height: 3,
                borderRadius: 2,
                backgroundColor: "#2563eb",
              },
            },
          }}>
          <Tab value="create" label="Employee Creation" />
          <Tab value="all" label="All Employees" />
        </Tabs>
      </div>

      <div
        className="h-full flex items-center justify-center px-6 min-h-screen overflow-y-auto"
        style={{ paddingTop: HEADER_HEIGHT }}>
        {activeTab === "create" ? (
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
              <div className="px-8 py-7 bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-900">
                <h2 className="text-white text-base font-medium tracking-tight">
                  New Employee Account
                </h2>
                <p className="text-white/70 text-xs mt-2">
                  Create a new account for secure access.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                <ModernInput
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />

                <ModernInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />

                <div>
                  <ModernInput
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <p className="mt-2 text-[11px] text-slate-400">
                    At least 8 characters with uppercase, lowercase, number and
                    symbol.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium
                             hover:bg-blue-700
                             active:scale-[0.995]
                             disabled:opacity-60
                             transition-all duration-200">
                  {loading ? "Creating..." : "Create Employee"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full my-10 max-w-6xl h-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-base font-medium text-slate-800 tracking-tight">
                  All Employees
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {employees.length} employees found
                </p>
              </div>
            </div>

            {empLoading ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                Loading employees...
              </div>
            ) : employees.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                No employees found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-8 py-4">Employee ID</th>
                      <th className="px-8 py-4">Name</th>
                      <th className="px-8 py-4">Email</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4">Permissions</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Created</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {employees.map((emp) => (
                      <tr
                        key={emp._id}
                        className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-medium text-slate-800">
                          {emp.employeeId || "-"}
                        </td>

                        <td className="px-8 py-4 text-slate-700">{emp.name}</td>

                        <td className="px-8 py-4 text-slate-600">
                          {emp.email}
                        </td>

                        <td className="px-8 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                            {emp.role}
                          </span>
                        </td>

                        <td className="px-8 py-4">
                          <button
                            disabled={permissionLoadingId === emp.employeeId}
                            onClick={() => setConfirmModal(emp)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition
      ${
        emp.canManageProducts
          ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600"
          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
      }
    `}>
                            {permissionLoadingId === emp.employeeId
                              ? "Updating..."
                              : emp.canManageProducts
                                ? "Can Manage Products"
                                : "Limited Access"}
                          </button>
                        </td>

                        <td className="px-8 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                            {emp.status}
                          </span>
                        </td>

                        <td className="px-8 py-4 text-slate-500">
                          {new Date(emp.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
            <div>
              <h3 className="text-base font-medium text-slate-800 tracking-tight">
                {confirmModal?.canManageProducts
                  ? "Remove Product Access"
                  : "Grant Product Access"}
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                {confirmModal?.canManageProducts
                  ? `Remove product management access from ${confirmModal.name}?`
                  : `Allow ${confirmModal.name} to manage products?`}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>

              <button
                onClick={() => handleConfirmPermission(confirmModal)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                {confirmModal?.canManageProducts
                  ? "Remove Permission"
                  : "Grant Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModernInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700 tracking-tight">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm
                 focus:border-blue-600
                 focus:ring-2 focus:ring-blue-600/20
                 outline-none
                 transition-all duration-200"
    />
  </div>
);

export default EmpCreation;
