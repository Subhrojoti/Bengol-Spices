import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../../../../api/services";
import { toast } from "react-toastify";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const HEADER_HEIGHT = 80;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct._id);
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateProduct(selectedProduct._id, formData);
      toast.success("Product updated successfully");
      setShowEditModal(false);
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      {/* HEADER */}
      <div
        className="fixed top-0 left-[3%] right-0 z-10 bg-white border-b px-8 flex items-center"
        style={{ height: HEADER_HEIGHT }}>
        <div>
          <h1 className="text-xl font-semibold">All Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        className="h-full overflow-y-auto px-8 py-6"
        style={{ paddingTop: HEADER_HEIGHT + 20 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => {
                setSelectedProduct(product);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setSelectedProduct(product);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <DeleteModal
          product={selectedProduct}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

/* ================= PRODUCT CARD ================= */

const ProductCard = ({ product, onEdit, onDelete }) => (
  <div className="bg-white border rounded-xl shadow-sm group">
    <div className="relative h-44 overflow-hidden">
      <img
        src={product.images?.front?.url}
        alt={product.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
        <button onClick={onEdit} className="p-2 bg-white rounded shadow">
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>
        <button onClick={onDelete} className="p-2 bg-white rounded shadow">
          <DeleteOutlineIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold truncate">{product.name}</h3>
      <p className="text-xs text-slate-500 truncate">{product.title}</p>
    </div>
  </div>
);

/* ================= DELETE MODAL ================= */

const DeleteModal = ({ product, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-[360px]">
      <h3 className="text-lg font-semibold">Delete Product</h3>
      <p className="text-sm mt-2">
        Delete <b>{product.name}</b>?
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button className="border px-4 py-2 rounded" onClick={onClose}>
          Cancel
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ================= EDIT MODAL ================= */

const EditProductModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [frontImage, setFrontImage] = useState(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    if (frontImage) formData.append("frontImage", frontImage);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[420px]">
        <h3 className="text-lg font-semibold mb-4">Edit Product</h3>

        <input
          className="w-full border px-3 py-2 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFrontImage(e.target.files[0])}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <button className="border px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
