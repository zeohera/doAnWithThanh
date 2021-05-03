
function testFunction()
{
    var city = document.getElementById('cityName').value
    console.log(city)
    axios.post('/admin/addCity', {
        name : city
    })
    .then(function (response) {
    console.log(response);
    })
    .catch(function (error) {
    console.log(error);
    });
}

function viewAllCity()
{
    console.log(document.getElementById('listCity').style.display)
    if (document.getElementById('listCity').style.display == 'none')
        document.getElementById('listCity').style.display = 'block'
    else
        document.getElementById('listCity').style.display = 'none'
}

function viewAllDistrict()
{
    if (document.getElementById('listDistrict').style.display == 'none')
        document.getElementById('listDistrict').style.display = 'block'
    else
        document.getElementById('listDistrict').style.display = 'none'
}


function cityOnChange(){
    var thisCity = document.getElementById('city').value
    var city = document.querySelectorAll('#listDistrict li p')
    city.forEach(function(e){
        console.log(e.textContent)
        if (e.textContent != thisCity){
            console.log(e.parentElement)
            e.parentElement.style.setProperty( "display", "none", "important")
        } else{
            e.parentElement.style.setProperty( "display", "flex", "important")
        }
    })
}

function citySelect(){
    var thisCity = document.getElementById('city').value
    console.log('thiss ' , thisCity)
    var city = document.querySelectorAll('#district option ')
    console.log('city', city)
    city.forEach(function(e){
        e.style.display = "none"
        var stringValue = e.innerText
        if (stringValue.includes(thisCity))
        {
            e.style.display = "flex";
        }
    })
}

var storeList = document.getElementsByClassName('btn_editStore')
console.log(storeList)
function callStore(event) {
    var button = event.target
    var id = button.dataset.id
    console.log(id)
    axios.get('/api/admin/store/'+ id).then(res =>
    {
        var info = res.data[0]
        console.log(typeof(info))
        document.querySelector('#storeEditInfo #editID').innerText = info._id
        document.querySelector('#storeEditInfo #editViewAddress').innerText = info.city + '-' + info.district
        document.querySelector('#storeEditInfo #editAddress').setAttribute('placeholder', info.address)
        document.querySelector('#storeEditInfo #editLink').setAttribute('placeholder', info.embeddedLink)
        document.querySelector('#storeEditInfo #editAddress').value = info.address
        document.querySelector('#storeEditInfo #editLink').value = info.embeddedLink
    })
}
for (var i = 0; i < storeList.length; i++) {
    storeList[i].addEventListener('click', callStore, false);
}
var form = document.querySelector('#storeEditInfo')

form.addEventListener("submit", (e)=>
{
    var id = document.querySelector('#storeEditInfo #editID').innerText
    let data = new FormData(document.querySelector('#storeEditInfo'))
    var embeddedLink = data.get('embeddedLink')
    var address = data.get('address')
    axios({
        method : 'post',
        url : '/api/admin/store/edit/' + id,
        data : {address: address,embeddedLink:embeddedLink}
    }).then((res)=>{
        console.log(res);
    })
    .catch((err) => {throw err});
    form.style.display = 'none'
})
