import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import Button from "../components/ui/Button";

const CartPage = () => {
  const {
    cartItems,
    itemCount,
    cartTotal,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-24 w-24 text-gray-300" />
        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Keranjang Anda Kosong
        </h1>
        <p className="mt-2 text-gray-500">
          Sepertinya Anda belum menambahkan produk apa pun.
        </p>
        <Link to="/products">
          <Button className="mt-6">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        Keranjang Belanja
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Daftar Item */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h2 className="font-semibold text-lg">{item.product.name}</h2>
                <p className="text-gray-500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(item.product.price)}
                </p>
              </div>
              {/* Kontrol Kuantitas */}
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <button
                  onClick={() => decreaseQuantity(item.product.id)}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addToCart(item.product)}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <Plus size={16} />
                </button>
              </div>
              {/* Total per Item */}
              <p className="font-bold w-32 text-right">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.product.price * item.quantity)}
              </p>
              {/* Tombol Hapus */}
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Kolom Ringkasan Belanja */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28">
          <h2 className="text-xl font-bold border-b pb-4 mb-4">
            Ringkasan Belanja
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal ({itemCount} item)</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(cartTotal)}
              </p>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
              <p>Total</p>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(cartTotal)}
              </p>
            </div>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-6">Lanjutkan ke Checkout</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
