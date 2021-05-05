// const { default: axios } = require("axios");

window.onload=function(){
    console.log('heheh')
    // document.getElementById('btn-minus').addEventListener('click',minusQuantity)
    function minusQuantity(e){
        var number = parseInt(document.getElementById('quantity').value)
        number -= 1
        number < 0 ? number = 0 :  number;
        document.getElementById('quantity').value = number;
    }
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    })
    var priceTagArr = document.querySelectorAll('.numberPrice')
    console.log(priceTagArr)
    priceTagArr.forEach(function(e){
        var price = parseInt(e.innerText)
        console.log(price)
        e.innerText = formatter.format(price)
    })
}