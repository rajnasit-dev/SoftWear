import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {clearCart} from '../redux/slices/cartSlice'


const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  //Get order from localStorage
  useEffect(() => {
    const finalOrder = localStorage.getItem('finalOrder');
    console.log('Final order from localStorage:', finalOrder); // Debug log
    
    if (finalOrder) {
      try {
        const parsedOrder = JSON.parse(finalOrder);
        setOrder(parsedOrder);
        localStorage.removeItem('finalOrder'); // Clean up after use
        setLoading(false);
      } catch (error) {
        console.error('Error parsing final order:', error);
        navigate('/my-orders');
      }
    } else {
      console.log('No final order found in localStorage, redirecting to my-orders');
      navigate('/my-orders');
    }
  }, [navigate]);


  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); //Add 10 days to the orderDate
    return orderDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">Loading your order confirmation...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for your order!
      </h1>

      {order && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID : {order._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mb-20">
            {order.orderItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">₹{item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">{order.paymentMethod}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">{order.shippingAddress?.address}</p>
              <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.country} </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
