import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { removeFromCart, updateQuantity } from "./cartSlice";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Sepetim</h1>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center border p-4 rounded-lg"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="ml-4 flex-grow">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.price} TL</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity - 1)
                  }
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity + 1)
                  }
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Kaldır
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {(item.price * item.quantity).toFixed(2)} TL
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg">Toplam Ürün: {totalQuantity}</p>
            <p className="text-xl font-bold">
              Toplam Tutar: {totalAmount.toFixed(2)} TL
            </p>
          </div>
          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Siparişi Tamamla
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
