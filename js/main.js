import { view } from './vue.js';
import * as api from "./api.js";
//import { afficher } from './appel_region.js';

const idRegion = window.location.search.replace("?", "").split("&")[0].split("=")[1];

async function listeResto() {
  try{ return await api.allRestoFromRegion(idRegion); }
  catch(err) { console.error(err); }
}
function afficher(data) {
  let div = view.divResult;
  //nettoie les résultats trouvées en amont
  div.forEach(element => {
    element.remove();
  });
  //ajoute les elements voulu dans l'affichage
  data.forEach(element => {
    div.append(element.nom);
  });
}


async function avecResp() {
  
  //listeTtResto contient tous les restaurants de la région choisis la page précédente
  const listeTtResto = await api.RestoWith(listeResto(idRegion));
  console.log(listeTtResto);
  

  view.reserachBtn.addEventListener("click", async function () {
    let listeRestoWValue = await api.RestoWith(listeTtResto, view.reserachInput.value);
    //console.log(listeRestoWValue);
    afficher(listeRestoWValue);
    
  });

  //roulette de favoris
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
}//fait le code dans une fonction async, TODO: afficher un squelette
avecResp();