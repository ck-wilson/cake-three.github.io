
   let chkoutfrmtDom = document.querySelector('#chkoutfrm');
   let cart = JSON.parse(localStorage.getItem('cart')) ;   
   let chkouttotal =0;
   let cartlength = cart.length;

   document.querySelector('.cart-icon').innerText = cart.length; 
   cart.forEach( (cart) => {
         // 0. index -> item_name_1, 1. index -> item_name_2, stb.
         chkoutfrmtDom.insertAdjacentHTML('beforeend',
               `<div class="cart__item">
                   <img class="cart__item__image" src="${cart.image}" alt="${cart.name}">
                   <p class="cart__item__name"> ${cart.name} </p>
                   <p class="cart__item__price"> ${cart.price} </p>
                   <p class="cart__item__quantity"> ${cart.quantity} </p>
                   <p class="cart__item__price"> ${(cart.price * cart.quantity)} </p>
                   </div>`);
                                      
         chkouttotal += (cart.price * cart.quantity);                      
     });
   
     chkoutfrmtDom.insertAdjacentHTML('afterend',
               `<div class="cart__footer">
                   
                   <h4 class="text-right">Total = $  ${chkouttotal} </h4>
                   </div>`);
    
    function gopayment() {
    alert(" Thank you for your order. Will deliver shortly. Enjoy !! "); 
    clearcart();
    window.history.go(-2);
    // window.history.back();
   
   };
   
   function clearcart()
   {     
       cart = [];
       localStorage.setItem('cartlength','0');
       localStorage.removeItem('cart');
       
   
   }
   
       