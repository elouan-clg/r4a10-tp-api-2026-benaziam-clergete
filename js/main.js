import { view } from './vue.js';
import * as api from "./api.js";

/**
 * Vérifie si un restaurant est déjà dans les favoris
 * @param {string} code - Le code du restaurant à vérifier
 * @returns {boolean} true si le restaurant est en favoris
 */
function estEnFavoris(code) {
    let liste = api.retrieveStateFromClient();
    if (!liste) return false;
    return liste.some(r => r.code == code);
}

/**
 * Affiche la liste des restaurants CROUS dans le bloc résultats
 * @param {Array} data - Tableau d'objets {nom, code}
 */
export function afficherResto(data) {
    let div = view.divResult;

    // vide l'affichage
    const wrappers = document.getElementsByClassName('res-wrapper');
    while(wrappers.length > 0){
        wrappers[0].parentNode.removeChild(wrappers[0]);
    }
    // vide aussi les p.res qui traînent (placeholders HTML etc.)
    const elements = document.getElementsByClassName('res');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    // vide le message "aucun résultat" si présent
    const msgsVides = document.getElementsByClassName('info-vide');
    while(msgsVides.length > 0){
        msgsVides[0].parentNode.removeChild(msgsVides[0]);
    }

    // si aucun résultat, on l'indique
    if (data.length === 0) {
        let msgVide = document.createElement('p');
        msgVide.classList.add('info-vide');
        msgVide.append("(Aucun résultat trouvé)");
        div.append(msgVide);
        return;
    }

    // affiche chaque restaurant avec son bouton étoile
    data.forEach(element => {
      // wrapper = nom + étoile dans un seul bloc
      let wrapper = document.createElement('div');
      wrapper.classList.add('res-wrapper');

      let eleCont = document.createElement('p');
      eleCont.append(element.nom);
      eleCont.classList.add('res');
      eleCont.id = element.code;
      // passe aussi le nom pour l'afficher dans le titre de la modale
      eleCont.addEventListener("click", () => {
          restoClickListener(element.code, element.nom);
      });

      // bouton étoile - pleine si déjà en favoris, vide sinon
      let boutonFav = document.createElement('button');
      boutonFav.classList.add('btn-favoris');
      boutonFav.type = "button";
      boutonFav.title = "Ajouter la recherche aux favoris";

      let etoile = document.createElement('img');
      etoile.src = estEnFavoris(element.code) ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
      etoile.alt = "Favori";
      etoile.width = "22";
      boutonFav.append(etoile);

      boutonFav.addEventListener("click", () => {
        try {
            // si déjà en favoris, on demande confirmation avant de retirer
            if (estEnFavoris(element.code) && !confirm(`Voulez-vous vraiment retirer "${element.nom}" de vos favoris ?`)) return;
            api.saveStateToClient(element.nom, element.code);
            // met à jour l'étoile
            etoile.src = estEnFavoris(element.code) ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
        }
        catch (err) { console.error(err); }
      });

      // on regroupe avant d'insérer
      wrapper.append(eleCont);
      wrapper.append(boutonFav);
      div.append(wrapper);
    });
}

/**
 * Ouvre la modale et met le nom du restaurant dans le titre
 * @param {string} nomResto - Le nom du restaurant sélectionné
 */
function ouvrirModal(nomResto) {
    let modal = document.getElementById('modal-menu');
    document.getElementById('modal-titre').textContent = nomResto;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // bloque le scroll de la page
    document.getElementById('modal-fermer').focus();
}

/**
 * Ferme la modale et vide son contenu pour le prochain restaurant
 */
function fermerModal() {
    document.activeElement.blur();
    let modal = document.getElementById('modal-menu');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // rétablit le scroll
    document.getElementById('modal-corps').innerHTML = '';
}

/**
 * Charge et affiche le menu du jour dans la modale
 * @param {string|number} code - Le code du restaurant
 * @param {string} nom - Le nom du restaurant (pour le titre de la modale)
 */
let restoClickListener = async function (code, nom) {
  ouvrirModal(nom);
  let corps = document.getElementById('modal-corps');

  try {
    let monResto = await api.menuData(code);

    // null = ce CROUS n'a pas publié son menu
    if (!monResto) {
      let info = document.createElement('p');
      info.textContent = "Ce CROUS n'a pas encore publié son menu.";
      corps.append(info);
      return;
    }

    // pour chaque jour du menu
    monResto.data.forEach(element => {
      let unJour = document.createElement('div');
      unJour.append(element.date);
      unJour.classList.add('repas_jour');

      // on check si y a bien un repas prevu et si les categories existent
      if (element.repas && element.repas.length > 0 && element.repas[0].categories) {
          element.repas[0].categories.forEach(typePlat => {
              let soustitre = document.createElement('h3');
              soustitre.append(typePlat.libelle);
              typePlat.plats.forEach(lignePlat => {
                let platLigne = document.createElement('p');
                platLigne.append(lignePlat.libelle);
                soustitre.append(platLigne);
              });
              unJour.append(soustitre);
          });
      } else {
          let msgVide = document.createElement('p');
          msgVide.append("Pas de menu pour ce jour");
          unJour.append(msgVide);
      }

      corps.append(unJour);
    });
  }
  catch (error) {
    // l'API n'a pas de menu pour ce resto (404 ou autre), on le signale
    let info = document.createElement('p');
    info.classList.add('repas_jour');
    info.append("Aucune information disponible pour ce CROUS");
    corps.append(info);
  }
};

let tousLesRestos = []; // on garde tout en mémoire pour éviter de spam l'API

/**
 * Initialise la page en chargeant les restaurants de la région passée dans l'URL
 */
async function initPage() {
    let idRegion = new URLSearchParams(window.location.search).get("region");
    if (!idRegion) return;

    // affiche le gif pendant que l'API cherche les données
    view.gifAttente.classList.add('visible');

    try {
        tousLesRestos = await api.allRestoFromRegion(idRegion);
        afficherResto(tousLesRestos);
    } catch(err) {
        console.error(err);
    } finally {
        // cache le gif quoi qu'il arrive une fois que c'est terminé
        view.gifAttente.classList.remove('visible');
    }
}

/**
 * Filtre les restaurants affichés selon la valeur du champ de recherche
 */
function filtrerRestos() {
    let texte = view.reserachInput.value.toLowerCase();

    let resultats = tousLesRestos.filter(resto =>
        resto.nom.toLowerCase().includes(texte)
    );

    afficherResto(resultats);
}

// active/désactive le bouton loupe selon si le champ est vide ou non
view.reserachInput.addEventListener("input", () => {
    view.reserachBtn.disabled = view.reserachInput.value.trim() === '';
    filtrerRestos();
});

// lance aussi la recherche si on clique sur le bouton
view.reserachBtn.addEventListener("click", filtrerRestos);

// fermeture via le bouton ✕
document.getElementById('modal-fermer').addEventListener('click', fermerModal);

// fermeture en cliquant sur le fond de la modale (pas sur la carte elle-même)
document.getElementById('modal-menu').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) fermerModal();
});

// fermeture avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fermerModal();
});

/**
 * Supprime tous les éléments d'une classe donnée du DOM
 * @param {string} nomChamp - Le nom de la classe CSS à vider
 */
function viderClass(nomChamp) {
    const elements = document.getElementsByClassName(nomChamp);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// lance le chargement au démarrage
initPage();
