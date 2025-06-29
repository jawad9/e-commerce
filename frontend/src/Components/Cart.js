import Alert from "./Alert"
import { useEffect, useState } from "react"
import { useAlert } from "../AlertContext"
export default function Cart() {
    const [cart, setCart] = useState([])
    const { showAlert } = useAlert()
    useEffect(() => {
        fetch("http://localhost:5000/cart", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
            }
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data === "" || data === null || data === undefined) {
                showAlert("Error", "No item added to cart. Add an item to cart to view changes")
            } else {
                showAlert(data)
                console.log(data)
            }
        }).catch((err) => {
            console.log(err)
            showAlert("Error", "Failed to fetch cart items")
        })
    }, [])
    const removeItem = (item) => {
        fetch("http://localhost:5000/cart", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                cartItem: [{
                    image: item.image,
                    name: item.name,
                    price: item.price,
                    description: item.description
                }]
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            setAlert([data[0], data[1]])
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className="body">
            <h1>Cart Items</h1>
            {cart.length === 0 ? (
                <h2>Your cart is empty</h2>
            ) : (<>
                <h2>Here are the products you added to cart:</h2>
            <div className="clist">
                {cart.map((item, index) => (
                    <div key={index} className="icard">
                        <img src={item.cartItem[0].image} className="cimg" />
                        <div className="pinfo">
                            <h3>{item.cartItem[0].name}</h3>
                            <p className="price">Price: {item.cartItem[0].price}</p>
                            <p className="description">Description: {item.cartItem[0].description}</p>
                        </div>
                        <div className="a2cBtn">
                            <button className="bodyBtn">Buy Now</button>
                            <button className="bodyBtn" onClick={() => removeItem(item.cartItem[0])}>Remove Item</button>
                        </div>
                    </div>
                ))}
            </div>
            </>)}
            {alert.length > 0 && <Alert heading={alert[0]} message={alert[1]} onClose={() => showAlert("", "")} />}
        </div>
    )
}
