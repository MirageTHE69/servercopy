class CartItem {
    constructor(title, image, price, quantity = 0) {
        this.title = title;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }
};

class Cart {
    constructor(cart = {}) {
        this.items = cart.items || {};
        this.totalPrice = cart.totalPrice || 0;
    }

    addItem(id, title, image, price, quantity = 0) {
        let storedItem = this.items[id];
        if (!storedItem)
            storedItem = this.items[id] = new CartItem(title, image, price, quantity);

        storedItem.quantity++;

        // Increase grand total in cart
        this.totalPrice += storedItem.price;
    }

    removeItem(id){
        let storedItem = this.items[id];
    
        if(storedItem.quantity <= 1 ){
            delete this.items[id];
        }else{
            storedItem.quantity--;
        }
    
        this.totalPrice -= storedItem.price;
    }
    
};

module.exports = Cart;


