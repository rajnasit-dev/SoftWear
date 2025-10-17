import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import PaypalButton from "./PaypalButton";
import {createCheckout} from '../../redux/slices/checkoutSlice'
import { clearCart } from '../../redux/slices/cartSlice'
import { toast } from "sonner";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
  const { loading: checkoutLoading, error: checkoutError } = useSelector((state) => state.checkout || {});
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  //Prevent checkout if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  //Create checkout session
  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment SDK not loaded. Please retry in a moment.");
      return;
    }

    if (cart && cart.products.length > 0) {
      const mappedItems = cart.products.map((p) => ({
        productId: p.productId,
        name: p.name,
        image: p.image || p.Image,
        price: Number(p.price),
        quantity: p.quantity,
        size: p.size,
        color: p.color,
      }));

      // quick client-side validation to avoid 500s on server
      const missingImage = mappedItems.find((i) => !i.image);
      if (missingImage) {
        toast.error("Some items are missing images. Please refresh your cart.");
        return;
      }

      const res = await dispatch(
        createCheckout({
          checkoutItems: mappedItems,
          shippingAddress,
          paymentMethod: "Razorpay",
          totalPrice: cart.totalPrice,
        })
      );

      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        handleRazorpayPayment(res.payload._id);
      } else if (res.error) {
        toast.error(res.payload?.message || "Failed to create checkout.");
      }
    }
  };

//Initialize Razorpay payment
  const handleRazorpayPayment = async (id) => {
    try {
      // Create Razorpay order in backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/create-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const options = {
        key: data.key, // Razorpay key_id from backend
        amount: data.amount,
        currency: data.currency,
        name: "ElectroMart",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          await verifyPayment(id, response);
        },
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: user?.email,
          contact: shippingAddress.phone,
        },
        notes: {
          address: shippingAddress.address,
        },
        theme: {
          color: "#65ccb7",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Error initiating payment. Please try again.");
    }
  };

  //Verify Razorpay Payment
  const verifyPayment = async (id, response) => {
    try {
      console.log('Verifying payment for checkout ID:', id);
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/verify-payment`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      console.log('Payment verified successfully, finalizing checkout...');

      // Finalize checkout after successful payment
      const finalizeResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      console.log('Checkout finalized, order created:', finalizeResponse.data);

      // Store the final order in localStorage for order confirmation page
      localStorage.setItem('finalOrder', JSON.stringify(finalizeResponse.data));
      
      // Clear cart after successful payment
      dispatch(clearCart());

      console.log('Navigating to order confirmation page...');
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  if (cartLoading) return <p>Loading cart...</p>;
  if (cartError) return <p>Error: {cartError}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your Cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />

            {/* Delivery Section */}
            <h3 className="text-lg mb-4">Delivery</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Postal Code</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-900 cursor-pointer disabled:opacity-60"
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Proceed to Payment"}
            </button>
            {checkoutError && (
              <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">₹{product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>₹{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>₹{cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
