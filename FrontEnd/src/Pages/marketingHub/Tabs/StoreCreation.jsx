import { useState } from "react";

const StoreCreation = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    storeType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      storeName: formData.storeName,
      ownerName: formData.ownerName,
      phone: formData.phone,
      address: formData.address,
      location: {
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      },
      storeType: formData.storeType,
    };

    console.log("Create Store Payload:", payload);
  };

  return (
    <div className="max-w-[750px] mx-auto mt-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Header */}
        <h2 className="text-base font-semibold mb-1">Create New Store</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter store details registered by the agent
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {/* Row 1 */}
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
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Row 2 */}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Store Type — Radio Buttons */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Store Type *
              </label>

              <div className="flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="storeType"
                    value="RETAILER"
                    checked={formData.storeType === "RETAILER"}
                    onChange={handleChange}
                    required
                    className="accent-indigo-600"
                  />
                  Retailer
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="storeType"
                    value="WHOLESALER"
                    checked={formData.storeType === "WHOLESALER"}
                    onChange={handleChange}
                    className="accent-indigo-600"
                  />
                  Wholesaler
                </label>
              </div>
            </div>

            {/* Spacer for alignment */}
            <div className="hidden md:block" />

            {/* Button Row */}
            <div className="md:col-span-3 flex justify-end mt-6">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-sm shadow">
                Create Store
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreCreation;
