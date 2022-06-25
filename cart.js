
    let addToCartButtons = document.querySelectorAll('[data-action=ADD_TO_CART]');
    let cartDom = document.querySelector('.cart');

    //let cart = [];
    // load cart array from localstorage , 
    // if no data,  empty array, null
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelector('.cart-icon').innerText = cart.length
    let cartlength = JSON.parse(localStorage.getItem('cartlength'));  
    // items are retained in storage after reloading, but DOM rendering must also be handled
    // for each element in the storage array, create a div

    // if there are items in the array, add them to the DOM same as Add item to cart button
    // then click events will not work on the buttons because they are originally outside the if

    if (cart.length > 0) {
        cart.forEach((product) => {
            insertProductToDOM(product);
            countCartTotal();

            // Handle those items in localstorage. i.e. loaded in "cart" array in previou let stm
            //  the "Add To Cart" button should be disabled
            // no need to create a separate eventListener
            addToCartButtons.forEach(button => {
                let currentProduct = button.parentNode;

                // if the name of the parent element is the same as the name of the product stored in localstorage, then disabled
                if (currentProduct.querySelector('.product__name').innerText === product.name) {
                    handleActionButtons(button, product);
                }
            })
        })
    }

    // adding item just trigger by clicking button "ADD To Cart"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            let currentProduct = button.parentNode;

            // when item is not added from storage, the default qty is 1, so
            // it is enough to test the btn-danger condition only when adding from localstorage
            const product = {
                image: currentProduct.querySelector('.product__image').getAttribute('src'),
                name: currentProduct.querySelector('.product__name').innerText,
                price: currentProduct.querySelector('.product__price').innerText,
                quantity: 1
            };

            //check to see if the product has been added before
            const isInCart = cart.filter(cartItem => (cartItem.name === product.name)).length > 0;
            //   console.log(isInCart);
            //if it is not already in the cart, add to cart DOM
            if (!isInCart) {
                insertProductToDOM(product);
                cart.push(product);
                saveCart();
                handleActionButtons(button, product);
            }
        });
    });

    // since we refer to a product within the function, it must be passed as a parameter
    function insertProductToDOM(product) {
        cartDom.insertAdjacentHTML('beforeend',
            `<div class="cart__item">
                <img class="cart__item__image" src="${product.image}" alt="${product.name}">
                <p class="cart__item__name"> ${product.name} </p>
                <p class="cart__item__price"> ${product.price} </p>
                <p class="cart__item__quantity"> ${product.quantity} </p>
                <button class="btn btn--primary btn--small ${(product.quantity === 1 ? 'btn--danger' : '')}" 
                    data-action="DECREASE_QUANTITY"> &minus; </button>
                <button class="btn btn--primary btn--small" data-action="INCREASE_QUANTITY"> &plus; </button>
                <button class="btn btn--danger btn--small" data-action="DELETE_PRODUCT"> &times; </button>
                
            </div>`
        );

        addCartFooter();
    }

    function handleActionButtons(button, product) {
        button.innerText = 'Already in cart';
        button.disabled = true;

        let cartItems = cartDom.querySelectorAll('.cart__item');

        cartItems.forEach(cartItem => {
            if (cartItem.querySelector('.cart__item__name').innerText === product.name) {
                cartItem.querySelector('[data-action="INCREASE_QUANTITY"]')
                    .addEventListener('click', () => increaseAction(product, cartItem));

                cartItem.querySelector('[data-action="DECREASE_QUANTITY"]')
                    .addEventListener('click', () => decreaseAction(product, cartItem, button));

                cartItem.querySelector('[data-action="DELETE_PRODUCT"]')
                    .addEventListener('click', () => deleteAction(product, cartItem, button));
            }
        });
    }

    function increaseAction(product, cartItem) {
        //  console.log('cartItem:', cartItem);
        cart.forEach(item => {
            if (item.name === product.name) {
                cartItem.querySelector('.cart__item__quantity').innerText = ++item.quantity;
                // item.quantity ++ does not increase the value on first click because then
                // the value is displayed first, then increments.
                // ++ item.quantity increments the value first, then displays
                cartItem.querySelector('[data-action="DECREASE_QUANTITY"]').classList.remove('btn--danger');
                // each change must also be saved in storage: 
                saveCart();
            }
        })
    }

    function decreaseAction(product, cartItem, button) {
        cart.forEach(item => {
            if (item.name === product.name) {
                if (item.quantity > 1) {
                    cartItem.querySelector('.cart__item__quantity').innerText = --item.quantity;
                    saveCart();
                }
                else {
                    deleteAction(product, cartItem, button);
                }

                if (item.quantity == 1) {
                    cartItem.querySelector('[data-action="DECREASE_QUANTITY"]').classList.add('btn--danger');
                }
            }
        })
    }

    function deleteAction(product, cartItem, button) {
        cartItem.classList.add('cart__item__removed');
        setTimeout(() => cartItem.remove(), 250);

        // the product still remains in the cart block itself
        
        cart = cart.filter(cartItem => cartItem.name !== product.name);
        saveCart();

        // reset button from disabled state
        button.innerText = 'Try It';
        button.disabled = false;


        // if the basket is empty, the buttons in the footer should also disappear
        if (cart.length < 1) {
            document.querySelector('.cart-footer').remove();
        }
    }

    function addCartFooter() {
        // insert after div.cart html
        /* each time a new product is added, the 2 buttons will be re-created, check
        whether the footer already exists. Only insert the 2 key if the .cart-footer null does not already exist (**)
         */
        // ***  add <h4> to show total amount
        if (document.querySelector('.cart-footer') === null) {
            cartDom.insertAdjacentHTML('afterend',
                `<div class="cart-footer">       
        <h4 class="cart-total">Total =$' + cartTotal<h4> 
        <button class="btn btn--danger" data-action="CLEAR_CART"> Clear Cart </button>
        <button class="btn btn--primary" data-action="CHECKOUT"> Pay </button> 
        </div>`
            );
            
            /* event listers. Only run clearCart if there is no footer, otherwise
               we get null errort ** */
            document.querySelector('[data-action="CLEAR_CART').addEventListener('click', () => clearCart());
            document.querySelector('[data-action="CHECKOUT').addEventListener('click', () => checkOut());
        }

    }

    /* deleteAction always filters the current array and stores it in storage,
      here, however, we always get an empty array because all elements have been deleted
      + must also be deleted from localStorage */
    function clearCart() {
        document.querySelectorAll('.cart__item').forEach(cartItem => {
            cartItem.classList.add('.cart__item__removed');
            setTimeout(() => cartItem.remove(), 250);
        })

        cart = [];
        document.querySelector('.cart-icon').innerText = cart.length;
        localStorage.setItem('cartlength', '0');
        localStorage.removeItem('cart');

        if (cart.length < 1) {
            document.querySelector('.cart-footer').remove();
        }

        // enable addcart button "Try it" *** 06/19
        addToCartButtons.forEach(button => {
            button.innerText = 'Try It';
            button.disabled = false;
        })
    }

    // return back to the order page
    function checkOut() {       
        window.location.href = "checkout.html";
        //window.history.back(); 
    };

    /*store the amount in the cart. We call domInsert at and whenever we went to
    to localStorage */
    function countCartTotal() {
        let cartTotal = 0;

        cart.forEach(cartItem => {
            cartTotal += (cartItem.quantity * cartItem.price);
        })

        // ***UPDT <p class="cart-total">Total =$' + cartTotal<p> 

        document.querySelector('[class="cart-total"]').innerText = 'Total = $' + cartTotal;
        // *** document.querySelector('[data-action="CHECKOUT"]').innerText = 'Pay $' + cartTotal;
        document.querySelector('[data-action="CHECKOUT"]').innerText = 'Checkout';
      //   console.log(cartTotal);
    }

    function saveCart() {
        // convert an array to a string, setItem only accepts a string format
        localStorage.setItem('cart', JSON.stringify(cart));
        document.querySelector('.cart-icon').innerText = cart.length;
        // save cart length ( no. of items) to storage , for other pages to access
        localStorage.setItem('cartlength', JSON.stringify(cart.length));
        countCartTotal();
    }

    function addorder() {
        window.location.href = "order.html";
    };
   
  