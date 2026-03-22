import { view } from './vue.js';
import * as api from "./api.js";

export function afficherRegions(data) {
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