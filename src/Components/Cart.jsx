import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Cart as CartContext } from "../Store/CartContextProvider";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [final, setFinal] = useState(0);
  const { getCart } = useContext(CartContext);

  useEffect(() => {
    getCartData();
  }, []);

  const getCartData = async () => {
    const response = await getCart();
    const items = response.data;

    setCart(items);

    let total = 0;
    items.forEach((item) => {
      total += item.productId?.price * item.quantity || 0;
    });

    const shipping = total < 1000 && items.length >= 1 ? 150 : 0;
    setTotal(total);
    setShipping(shipping);
    setFinal(total + shipping);
  };

  return (
    <div className="container-fluid">
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.productId?.pic || "/default-image.jpg"}
                    alt="Product"
                    width="100"
                    height="70"
                    className="rounded"
                  />
                </td>
                <td>{item.productId?.name || "N/A"}</td>
                <td>&#8377;{item.productId?.price?.toFixed(2) || "N/A"}</td>
                <td>{item.quantity}</td>
                <td>
                  &#8377;
                  {(item.productId?.price * item.quantity)?.toFixed(2) || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h4>Total: &#8377;{total.toFixed(2)}</h4>
        <h4>Shipping: &#8377;{shipping.toFixed(2)}</h4>
        <h4>Final Amount: &#8377;{final.toFixed(2)}</h4>
        <Link to="/checkout" className="btn btn-primary">
          Checkout
        </Link>
      </div>
    </div>
  );
}
