document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const cartContainer = document.getElementById('cartItem');
    const totalElement = document.getElementById('total');
    const cartItemCountElement = document.getElementById('cartItemCount');
    let data = null;
    let cart = {}; // Object to store cart items

    const fetchDataAndRender = async () => {
        try {
            const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            data = await response.json();
            renderCategories(data.categories);
        } catch (error) {
            console.error('Error fetching and rendering data:', error);
        }
    };

    const renderCategories = (categories) => {
        cardsContainer.innerHTML = '';

        categories.forEach(category => {
            category.category_products.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');

                const title = document.createElement('div');
                title.classList.add('title');
                title.innerText = item.title;

                const image = document.createElement('img');
                image.classList.add('images');
                image.src = item.image;
                image.alt = item.title;

                const description = document.createElement('p');
                description.innerText = item.description;

                const categoryElement = document.createElement('p');
                categoryElement.classList.add('category');
                categoryElement.innerText = category.category_name;

                const price = document.createElement('p');
                price.classList.add('price');
                price.innerText = `$${item.price}`;

                const addToCartButton = document.createElement('button');
                addToCartButton.innerText = 'Add to Cart';
                addToCartButton.classList.add('addToCartButton');
                addToCartButton.addEventListener('click', () => {
                    addToCart(item);
                });

                card.appendChild(title);
                card.appendChild(image);
                card.appendChild(description);
                card.appendChild(categoryElement);
                card.appendChild(price);
                card.appendChild(addToCartButton);

                cardsContainer.appendChild(card);
            });
        });
    };

    const addToCart = (item) => {
        if (cart[item.id]) {
            cart[item.id].quantity++;
        } else {
            cart[item.id] = { ...item, quantity: 1 };
        }
        renderCart();
    };

    const removeFromCart = (itemId) => {
        if (cart[itemId]) {
            if (cart[itemId].quantity === 1) {
                delete cart[itemId];
            } else {
                cart[itemId].quantity--;
            }
            renderCart();
        }
    };

    const renderCart = () => {
        let total = 0;
        let cartItemsHtml = '';

        Object.values(cart).forEach(cartItem => {
            total += cartItem.price * cartItem.quantity;
            cartItemsHtml += `
                <div class="cartItemBox">
                    <div class="cartItem">${cartItem.title} x ${cartItem.quantity}</div>
                    <div class="removeButtonBox"><button class="removeButton" data-id="${cartItem.id}">Remove</button></div>
                </div>`;
        });

        cartContainer.innerHTML = cartItemsHtml;
        totalElement.innerText = `$${total.toFixed(2)}`;

        const cartItemCount = Object.values(cart).reduce((acc, curr) => acc + curr.quantity, 0);
        cartItemCountElement.innerText = cartItemCount;

        const removeButtons = document.querySelectorAll('.removeButton');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id');
                removeFromCart(itemId);
            });
        });
    };

    fetchDataAndRender();

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredCategories = data.categories.filter(category => category.category_name.toLowerCase() === searchTerm);
        renderCategories(filteredCategories);
    });
});

