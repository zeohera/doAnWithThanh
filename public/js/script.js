
window.onload=function(){
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    })
    var priceTagArr = document.getElementsByClassName('numberPrice')
    console.log('priceTagArr', priceTagArr) 
    $(".numberPrice").each(
        function(i,e){
            var price = parseInt(e.innerText)
            console.log(price)
            e.innerText = formatter.format(price)
        }
    )
    
    // priceTagArr.forEach(function(e){
    //     var price = parseInt(e.innerText)
    //     console.log(price)
    //     e.innerText = formatter.format(price)
    // })
}