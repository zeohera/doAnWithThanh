
window.onload=function(){
    document.querySelector('.searchBar form').addEventListener('submit' , deliverySearch)
    function deliverySearch(e) {
        var form = new FormData(form);
        var billID = document.querySelector('.searchBar form').elements.namedItem("BillID").value
        var CustomerName = document.querySelector('.searchBar form').elements.namedItem("customerName").value
        console.log(form)
        axios({
            method: 'get',
            url: '/api/product/getDeliveryInfo?customerName='+ CustomerName +'&BillID='+ billID,    
        }).then( res=> {
            if (res.data == null){
                console.log('bill not found');
            }
            else{
                document.querySelector('.shippingInfo').classList.remove('d-none');
                console.log(res.data)
                if(res.data.state === 0){
                    document.querySelector('.confirm').classList.add('done')
                    document.querySelector('.shipping').classList.remove('done')
                    document.querySelector('.complete').classList.remove('done')
                    document.querySelector('.cancel').classList.remove('done')
                }else if(res.data.state === 1){
                    document.querySelector('.confirm').classList.add('done')
                    document.querySelector('.shipping').classList.add('done')
                    document.querySelector('.complete').classList.remove('done')
                    document.querySelector('.cancel').classList.remove('done')
                } else if (res.data.state == 2){
                    document.querySelector('.confirm').classList.add('done')
                    document.querySelector('.shipping').classList.add('done')
                    document.querySelector('.complete').classList.add('done')
                    document.querySelector('.cancel').classList.remove('done')
                } else if ((res.data.state == -1)) {
                    document.querySelector('.confirm').classList.remove('done')
                    document.querySelector('.shipping').classList.remove('done')
                    document.querySelector('.complete').classList.remove('done')
                    document.querySelector('.cancel').classList.add('done')
                }
            }
            document.querySelector('.packageText .email').innerHTML = 'email :' + res.data.email
            
            document.querySelector('.packageText .customerName').innerHTML = 'Họ tên :' + res.data.name
        })
        e.preventDefault()

    }
}