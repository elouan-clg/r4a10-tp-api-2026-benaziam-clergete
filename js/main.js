import { view } from './vue.js';
import * as api from "./api.js";
//import { afficher } from './appel_region.js';

export function afficherResto(data) {
    let div = view.divResult;
    //vide l'affichage
    //console.log(data);
    
    const elements = document.getElementsByClassName('res');
    while(elements.length > 0){
      //console.log(elements[0]);
      
        elements[0].parentNode.removeChild(elements[0]);
    }
    //affiche les resto potentiels
    data.forEach(element => {
      let eleCont = document.createElement('p');
      eleCont.append(element.nom);
      eleCont.classList.add('res');
      eleCont.id = element.code;
      eleCont.addEventListener("click", restoClickListener(element.code));
      div.append(eleCont);
    });

}
//mets à jour le menu quand on clique sur un restaurant CROUS
let restoClickListener = async function (event) {
  monResto = await api.allRestoFromRegion(event.code);

};

//mets à jours les recherches de CROUS par appuie sur le bouton chercher
view.reserachBtn.addEventListener("click", async function () {
    try {
        let idRegion = window.location.search.replace("?", "").split("&")[0].split("=")[1];

        //console.log(idRegion);
        let eleRecherche = view.reserachInput.value;
        //console.log(eleRecherche);
        let mesResto;
        if (eleRecherche != null && eleRecherche != '') {
          mesResto = await api.allRestoFromRegion(idRegion, eleRecherche);
        }
        else{
          mesResto = await api.allRestoFromRegion(idRegion);
        }
        //console.log(mesResto);
        afficherResto(mesResto);
    } catch(err) {
        console.error(err);
    }
});

//mets à jours les recherches de CROUS par appuie d'une touche
view.reserachInput.addEventListener("keypress",  async function () {
    try {
        let idRegion = window.location.search.replace("?", "").split("&")[0].split("=")[1];

        //console.log(idRegion);
        let eleRecherche = view.reserachInput.value;
        //console.log(eleRecherche);
        let mesResto;
        if (eleRecherche != null && eleRecherche != '') {
          mesResto = await api.allRestoFromRegion(idRegion, eleRecherche);
        }
        else{
          mesResto = await api.allRestoFromRegion(idRegion);
        }
        //console.log(mesResto);
        
        afficherResto(mesResto);
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