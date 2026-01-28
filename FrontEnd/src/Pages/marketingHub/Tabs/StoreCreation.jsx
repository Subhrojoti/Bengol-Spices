import { useState } from "react";
import { toast } from "react-toastify";
import { createStore } from "../../../api/services";

const StoreCreation = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    address: "",
    storeType: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject("Location access denied. Please allow location access.");
        },
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      alert("Please allow location access to register the store.");

      const { latitude, longitude } = await getLocation();

      const payload = {
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        address: formData.address,
        latitude,
        longitude,
        storeType: formData.storeType,
      };

      await createStore(payload);

      toast.success("Store created successfully");

      setFormData({
        storeName: "",
        ownerName: "",
        phone: "",
        address: "",
        storeType: "",
      });
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Failed to create store",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[750px] mx-auto mt-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-semibold mb-1">Create New Store</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter store details registered by the agent
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Store Type *
              </label>
              <div className="flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="storeType"
                    value="RETAILER"
                    checked={formData.storeType === "RETAILER"}
                    onChange={handleChange}
                    required
                  />
                  Retailer
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="storeType"
                    value="WHOLESALER"
                    checked={formData.storeType === "WHOLESALER"}
                    onChange={handleChange}
                  />
                  Wholesaler
                </label>
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-sm shadow disabled:opacity-60">
                {loading ? "Creating..." : "Create Store"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreCreation;
