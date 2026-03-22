import { view } from './vue.js';
//import { afficherResto } from './main.js';
import * as api from "./api.js";

//s'occupe d'afficher les régions
function afficherRegions(data) {
    // Tri par ordre alphabétique
    data.sort((a, b) => a.libelle.localeCompare(b.libelle));

    // Construire tout le HTML d'un coup
    let html = '';
    data.forEach(element => {
        html += `
            <a href="liste_restaurants.html?region=${element.code}">
                <p class="res">${element.libelle}</p>
            </a>
        `;
    });

    // Injecter une seule fois
    view.divResult.innerHTML = html;
}

//cherche dans l'API toutes les régions possibles
async function appelRegion() {
    try {
        let mesRegions = await api.allRegion();
        afficherRegions(mesRegions.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des régions :", error);
    }
}

appelRegion();

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


//affiche le menu du favoris(plus commenté dans main, c'est une version raccourcis(pas mettre en fav))
//optimisable
let restoClickListener = async function (code) {   
    const elements = document.getElementsByClassName('repas_favoris');
        while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }  
    try{
        let monResto = await api.menuData(code);  
        
        //pour chaque jours
        monResto.data.forEach(element => {
        let unJour = document.createElement('div');
        unJour.append(element.date);
        unJour.classList.add('repas_favoris');
        //pour chaque jours
        element.repas[0].categories.forEach(typePlat => {
            //lui mettre un sous titre puis lui donner la liste de commestibles
            let soustitre = document.createElement('h3');
            soustitre.append(typePlat.libelle);
            //pour chaqueligne
            typePlat.plats.forEach(lignePlat => {
                //mettre le nom dans un p
                let platLigne = document.createElement('p');
                platLigne.append(lignePlat.libelle);
                soustitre.append(platLigne);
            });
            unJour.append(soustitre);
        });        
        view.divFavRepas.append(unJour);
        });
    }catch (error) {
        let info = document.createElement('p');
        info.classList.add('repas_favoris');
        info.append("Aucune information donnée par ce CROUS");
        view.divFavRepas.append(info);
    }
};

//parcours la liste des favoris, si existe, du locale storage
async function appelFavoris() {
    let listeFavoris = await api.retrieveStateFromClient();
    if (listeFavoris) {        
        listeFavoris.forEach(element => {
            let resto = document.createElement('li');
            resto.append(element["nom"]);         
            resto.addEventListener("click", () => {                
                restoClickListener(element["code"]);
            });
            view.divFav.append(resto)
        });
    } else{
        let pasFav = document.createElement('li');
        pasFav.id = "no_favoris";
        pasFav.append("Pas encore de favoris enregistrés");
        view.divFav.append(pasFav);
    }
}

//appel les favoris
appelFavoris();

//appel toutes les région
appelRegion();

