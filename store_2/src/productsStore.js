// coffee
// price_1P2VaoSF1GEbJBIHieBBiCGl

// sunglasses
// price_1P2VceSF1GEbJBIH0JocGexA

// camera
// price_1P2VdhSF1GEbJBIHmdrQfQ7O

const productsArray = [
    {
        id: "price_1P2VaoSF1GEbJBIHieBBiCGl",
        title: "Coffee",
        price: 49
    },
    {
        id: "price_1P2VceSF1GEbJBIH0JocGexA",
        title: "Sunglasses",
        price: 1999
    },
    {
        id: "price_1P2VdhSF1GEbJBIHmdrQfQ7O",
        title: "Camera",
        price: 39999
    }
];

function getProductData(id) {
    let productData = productsArray.find(product => product.id === id);

    if (productData == undefined) {
        console.log("Product data does not exist for ID: " + id);
        return undefined;
    }

    return productData;
}

export { productsArray, getProductData };