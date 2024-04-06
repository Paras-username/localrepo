import {Button, Container, Navbar, Modal, Form} from 'react-bootstrap';
import { useState, useContext } from 'react';
import { CartContext } from "../CartContext";
import CartProduct from './CartProduct';

function NavbarComponent() {
    const cart = useContext(CartContext);

    const [show, setShow] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(""); // State to store shipping address

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAddressChange = (e) => {
        setShippingAddress(e.target.value);
    }

    const checkout = async () => {
        const checkoutData = {
            items: cart.items,
            shippingAddress: shippingAddress // Include shipping address in the checkout data
        };

        await fetch('http://localhost:4000/checkout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutData)
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if(response.url) {
                window.location.assign(response.url); // Forwarding user to Stripe
            }
        });
    }

    const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    return (
        <>
            <Navbar expand="sm">
                <Navbar.Brand href="/">Ecommerce Store</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button onClick={handleShow}>Cart ({productsCount} Items)</Button>
                </Navbar.Collapse>
            </Navbar>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shopping Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productsCount > 0 ?
                        <>
                            <p>Items in your cart:</p>
                            {cart.items.map( (currentProduct, idx) => (
                                <CartProduct key={idx} id={currentProduct.id} quantity={currentProduct.quantity}></CartProduct>
                            ))}

                            <h1>Total: {"\u20B9"}{cart.getTotalCost().toFixed(2)}</h1>

                            {/* Shipping Address Input */}
                            <Form.Group controlId="formShippingAddress">
                                <Form.Label>Shipping Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter shipping address" value={shippingAddress} onChange={handleAddressChange} />
                            </Form.Group>

                            <Button variant="success" onClick={checkout}>
                                Purchase items!
                            </Button>
                        </>
                    :
                        <h1>There are no items in your cart!</h1>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

export default NavbarComponent;
