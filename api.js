
function randomCall(){
//     donne une API random
//     https://www.freepublicapis.com/api/random
//     donne une liste d'api selon critère
//     https://freepublicapis.com/api/apis?sort=best&limit=20
//     donne l'api avec lID donnée
//     https://www.freepublicapis.com/api/apis/275
//     semble pareil que liste API selon critère
//     https://www.freepublicapis.com/api/apis?limit=10&sort=best

    let promiseObj = fetch("https://www.freepublicapis.com/api/random");
    promiseObj.then( (resp) => resp.json())
    .then((data) => {
        //let data = data;
        console.log(data);
    })
}

randomCall();













// Toggle favoris - déplier/replier
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('btn-toggle-favoris');
  const favorisContent = document.getElementById('favoris-content');

  if (toggleBtn && favorisContent) {
    toggleBtn.addEventListener('click', function() {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      favorisContent.classList.toggle('open');
    });
  }
});