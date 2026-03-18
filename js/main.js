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
      eleCont.addEventListener("click", () => restoClickListener(element.code));
      div.append(eleCont);
    });

} 
//mets à jour le menu quand on clique sur un restaurant CROUS
let restoClickListener = async function (event) { 
  //console.log(event);
  let monResto = await api.RestoData(event);
  //console.log(monResto);

  const elements = document.getElementsByClassName('repas_jour');
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
    //pour chaque jours
  monResto.data.forEach(element => {
      let unJour = document.createElement('div');
      unJour.append(element.date);
      unJour.classList.add('repas_jour');

      // console.log(element.repas[0]);
      // console.log(element.repas[0].categories[0]);
      // console.log(element.repas[0].categories[0].libelle);
      // console.log(element.repas[0].categories[0].plats);
      // console.log(element.repas[0].categories[0].plats[0].libelle);
      //pour aider à comprendre ces if dans ces if: décommenter les lignes du dessus
      //pour chaque jours
      element.repas[0].categories.forEach(typePlat => {
          //lui mettre un sous titre puis lui donner la liste de commestibles
          let soustitre = document.createElement('h3');
          soustitre.append(typePlat.libelle);
          //pour chaqueligne
          // console.log(typePlat);
          // console.log(typePlat.plats);
          typePlat.plats.forEach(lignePlat => {
            //console.log(lignePlat.libelle);
            //mettre le nom dans un p
            let platLigne = document.createElement('p');
            platLigne.append(lignePlat.libelle);
            
            soustitre.append(platLigne);
          });
          unJour.append(soustitre);
      });
      view.divRepas.append(unJour);
    });
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