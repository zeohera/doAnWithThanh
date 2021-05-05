module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function(item, id) {
        var cartItem = this.items[id];
        // console.log(cartItem)
        if (!cartItem) {
            cartItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }
        cartItem.quantity++;
        if (cartItem.item.discountedPrice){
            cartItem.price = cartItem.item.discountedPrice * cartItem.quantity
            this.totalItems++;
            this.totalPrice += cartItem.item.discountedPrice;
        }
        else {
            cartItem.price = cartItem.item.price * cartItem.quantity;
            this.totalItems++;
            this.totalPrice += cartItem.item.price;
        } 
        
    };
    this.minus = function (id) {
        this.items[id].quantity -= 1;
        this.totalPrice -= this.items[id].price;
      }
    this.remove = function(id) {
        this.totalItems -= this.items[id].quantity;
        this.quantity -= 1;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};