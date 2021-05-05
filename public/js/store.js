

window.onload=function(){
    document.getElementById('citySelect').addEventListener('change', selectCity);
    function selectCity (e){
        console.log('hehe')
        var thisCity = document.getElementById('citySelect').value
        if (thisCity == ''){
            axios.get('/api/product/getAllCity').then(res=>{
                console.log(res.data);
                document.querySelectorAll('select#district').innerHTML = '<option value="">Chọn Quận/Huyện</option>';
                var string = '<option value="">Chọn quận / huyện</option>'
                res.data.forEach(e => {
                    string += '<option value="'+e._id+'">'+e.name+'</option>';
                });
                document.getElementById('districtSelect').innerHTML = string;

            })
        }else{
            axios.get('/api/product/getDistrictByCity/' + thisCity).then(res=>{
                // console.log(res.data)
                console.log(res.data.district)
                document.querySelectorAll('select#district').innerHTML = '';
                var string = '<option value="">Chọn quận / huyện</option>'
                res.data.district.forEach(e => {
                    string += '<option value="'+e._id+'">'+e.name+'</option>';
                });
                document.getElementById('districtSelect').innerHTML = string;
                var string2 = ''
                res.data.store.forEach(e =>{
                    string2 += '<div class="col-12 col-lg-4 mt-3"><div class="card"><li class="list-group-item">'+e.address+'</li><iframe src="'+e.embeddedLink+'" width="100%" height="300px" style="border:0;" allowfullscreen="true" loading="lazy"></iframe></div></div>'
                })
                document.getElementById('storeCardHolder').innerHTML = string2;
            })
        }
    }
    document.getElementById('districtSelect').addEventListener('change', selectDistrict);
    function selectDistrict (e){
        var thisDistrict = document.getElementById('districtSelect').value
        console.log(thisDistrict);
        axios.get('/api/product/getStoreByDistrict/' + thisDistrict).then(res=>{
            var string2 = ''
            res.data.forEach(e =>{
                string2 += '<div class="col-12 col-lg-4 mt-3"><div class="card"><li class="list-group-item">'+e.address+'</li><iframe src="'+e.embeddedLink+'" width="100%" height="300px" style="border:0;" allowfullscreen="true" loading="lazy"></iframe></div></div>'
            })
            document.getElementById('storeCardHolder').innerHTML = string2;
        })
    }
    

}
