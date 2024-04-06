const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51P2MI1SF1GEbJBIH3iXdJ95z9DSJMI6czsc2tj6Ei0ujraoEvyacjknTng9hsJnE59F8iEw6Uks1pLZ5H91SrBxs00gClNi3jN');

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
    const { address, currency, items } = req.body; // Add currency parameter

    let lineItems = [];
    items.forEach((item) => {
        lineItems.push({
            price: item.id,
            quantity: item.quantity
        });
    });

    let shippingAddress = null;

    // Check if the currency is INR
    if (currency === 'INR') {
        shippingAddress = {
            line1: address,
            // Add other address fields if necessary
        };
    } else {
        // For non-INR transactions, ensure shipping address is outside India
        // You may implement your own validation logic here
        const isOutsideIndia = true; // Implement your validation logic here
        if (isOutsideIndia) {
            shippingAddress = {
                line1: address,
                // Add other address fields if necessary
            };
        } else {
            return res.status(400).send('Shipping address must be outside India for non-INR transactions');
        }
    }

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
            shipping_address_collection: {
                allowed_countries: shippingAddress ? ['IN'] : ['*'], // Allow shipping address only for INR transactions
            },
            shipping_address: shippingAddress
        });

        res.send(JSON.stringify({
            url: session.url
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing payment');
    }
});

app.listen(4000, () => console.log("Listening on port 4000!"));
