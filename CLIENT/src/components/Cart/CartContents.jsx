import React from "react";
import {RiDeleteBin3Line} from 'react-icons/ri'

const CartContents = () => {
  const cartProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      quantity: 1,
      price: 15000,
      image: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      quantity: 1,
      price: 2500,
      image: "https://picsum.photos/200?random=2",
    },
  ];

  return (
    <div>
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex justify-between py-4 border-b"
        >

          <div className="flex">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover rounded mr-4"
            />
            <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm font-normal">size: {product.size} | color: {product.color}</p>
                <div className="flex items-center mt-2">
                    <button className="border rounded px-2.5 py-1 text-xl font-medium">-</button>
                    <span className="mx-4">{product.quantity}</span>
                    <button className="border rounded px-2 py-1 text-xl font-medium">+</button>
                </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="font-medium">$ {product.price.toLocaleString()}</p>
            <button className="cursor-pointer mt-2">
                <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default CartContents;
