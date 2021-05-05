window.onload=function(){
    var currentLink = window.location.href
    if (currentLink.includes('?page')){
        var currentPage = currentLink.split('=')[1]
        console.log('currentPage', currentPage)
        document.querySelectorAll("#orderPagination li .page-link").forEach((e, i)=>{
            var newLink = currentLink.split('=')[0] +'='+ e.innerHTML
            e.href = newLink
        })
    }
}