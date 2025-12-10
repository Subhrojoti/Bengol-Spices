import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/addToCart/addToCart";

export default function AddToCart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.addToCart.items);

  // Sample product data (array)
  const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      price: 1499,
    },
    {
      id: 2,
      name: "Phone",
      price: 149000,
    },
  ];

  const handleAdd = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">Add to Cart Example</h2>

      {/* List all products */}
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-gray-600">Price: ₹{product.price}</p>

            <button
              onClick={() => handleAdd(product)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Cart Items ({items.length})</h3>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No items in cart</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="border p-2 rounded-md flex justify-between"
              >
                <span>{item.name}</span>
                <span className="font-medium">₹{item.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
