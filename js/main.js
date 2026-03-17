import { view } from './vue.js';
import * as api from "./api.js";
//import { afficher } from './appel_region.js';

export function afficher(data) {
    // Tri par ordre alphabétique
    //data.sort((a, b) => a.libelle.localeCompare(b.libelle));

    // Construire tout le HTML d'un coup
    //let html = '';
    let div = view.divResult;
    data.forEach(element => {
      //let afficheMenu = createELement();

      div.append(element.nom);
      //div.append(afficheMenu);
        // html += `
        //     <a href="liste_restaurants.html?region=${element.code}">
        //         <p class="res">${element.libelle}</p>
        //     </a>
        // `;
    });

    // Injecter une seule fois
    //view.divResult.innerHTML = html;
}

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
        
        afficher(mesResto);
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