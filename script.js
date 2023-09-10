document.addEventListener("DOMContentLoaded", function () {
    const addProductBtn = document.getElementById("addProductBtn");
    const showProductBtn = document.getElementById("showProductBtn");
    const addProductForm = document.getElementById("addProductForm");
    const showProductList = document.getElementById("showProductList");
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");

    // Event listener for "Add Product" button
    addProductBtn.addEventListener("click", function () {
        addProductForm.style.display = "block";
        showProductList.style.display = "none";
    });

    // Event listener for "Show Products" button
    showProductBtn.addEventListener("click", function () {
        addProductForm.style.display = "none";
        showProductList.style.display = "block";
        displayProducts();
    });

    // Event listener for submitting the product form
    productForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const productName = document.getElementById("productName").value;
        const productQuantity = document.getElementById("productQuantity").value;
        const productPrice = document.getElementById("productPrice").value;

        if (productName && productQuantity && productPrice) {
            const product = {
                name: productName,
                quantity: parseInt(productQuantity),
                price: parseFloat(productPrice)
            };

            // Check if a product with the same name and price exists
            const existingProductIndex = findProductIndexByNameAndPrice(productName, productPrice);

            if (existingProductIndex !== -1) {
                // Increment the quantity of the existing product
                updateProductQuantity(existingProductIndex, product.quantity);
            } else {
                // Add the new product to the list
                saveProduct(product);
            }

            // Clear form fields
            productForm.reset();

            // Display success message
            alert("Product added successfully!");
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Function to save a product to localStorage
    function saveProduct(product) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Function to find the index of a product by name and price
    function findProductIndexByNameAndPrice(name, price) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        return products.findIndex(product => product.name === name && product.price === parseFloat(price));
    }

    // Function to update the quantity of an existing product
    function updateProductQuantity(index, newQuantity) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products[index].quantity += newQuantity;
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Function to display all products from localStorage
    function displayProducts() {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        productList.innerHTML = "";

        products.forEach(function (product, index) {
            const productItem = document.createElement("div");
            productItem.className = "product";
            productItem.innerHTML = `
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
            `;
            productList.appendChild(productItem);
        });
    }

    // Function to delete a product with a specified quantity
    window.deleteProduct = function (index) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const productToDelete = products[index];

        const quantityToDelete = prompt(`How much quantity of ${productToDelete.name} do you want to delete?`, "1");

        if (quantityToDelete === null) {
            // User canceled the deletion
            return;
        }

        const quantityToDeleteNumber = parseInt(quantityToDelete);

        if (isNaN(quantityToDeleteNumber) || quantityToDeleteNumber <= 0) {
            alert("Please enter a valid quantity to delete.");
            return;
        }

        if (quantityToDeleteNumber < productToDelete.quantity) {
            // Reduce the quantity of the existing product
            productToDelete.quantity -= quantityToDeleteNumber;
        } else {
            // Remove the entire product if the quantity to delete is equal or greater
            products.splice(index, 1);
        }

        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
    };
});