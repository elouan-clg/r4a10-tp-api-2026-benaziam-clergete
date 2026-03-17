import { view } from './vue.js';
import * as api from "./api.js";
import { afficherRegions } from './appel_region.js';

let listeRegion = [];

let regionClickListener = function (event, codeRegion) {
    console.log(codeRegion);
    api.allRestoFromRegion(codeRegion);
};

view.reserachBtn.addEventListener("click", async function () {
    try {
        let idRegion = window.location.search.replace("?", "").split("&")[0].split("=")[1];

        console.log(idRegion);
        let eleRecherche = view.reserachInput.value;
        //console.log(eleRecherche);
        let mesResto;
        if (eleRecherche != null && eleRecherche != '') {
          mesResto = await api.allRestoFromRegion(idRegion, eleRecherche);
        }
        else{
          mesResto = await api.allRestoFromRegion(idRegion);
        }
        console.log(mesResto);
        
        //afficherRegions(mesRegions.data);
    } catch(err) {
        console.error(err);
    }
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