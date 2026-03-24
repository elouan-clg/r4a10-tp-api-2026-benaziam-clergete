import { view } from './vue.js';
import * as api from "./api.js";

/**
 * Affiche les régions CROUS disponibles dans le bloc résultats
 * @param {Array} data - Tableau d'objets région avec {code, libelle}
 */
function afficherRegions(data) {
    // tri par ordre alphabétique
    data.sort((a, b) => a.libelle.localeCompare(b.libelle));

    // construit tout le HTML d'un coup puis injecte une seule fois
    let html = '';
    data.forEach(element => {
        html += `
            <a href="liste_restaurants.html?region=${element.code}">
                <p class="res">${element.libelle}</p>
            </a>
        `;
    });

    view.divResult.innerHTML = html;
}

/**
 * Récupère et affiche toutes les régions disponibles via l'API
 */
async function appelRegion() {
    try {
        let mesRegions = await api.allRegion();
        afficherRegions(mesRegions.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des régions :", error);
    }
}

/**
 * Ouvre la modale avec le nom du restaurant dans le titre
 * @param {string} nomResto - Le nom du restaurant
 */
function ouvrirModal(nomResto) {
    document.activeElement.blur();
    let modal = document.getElementById('modal-menu');
    document.getElementById('modal-titre').textContent = nomResto;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // bloque le scroll de la page
    document.getElementById('modal-fermer').focus();
}

/**
 * Ferme la modale et vide son contenu
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
 * Charge et affiche le menu d'un favori dans la modale
 * @param {string|number} code - Le code du restaurant
 * @param {string} nom - Le nom du restaurant
 */
let restoClickListener = async function (code, nom) {
    ouvrirModal(nom);
    let corps = document.getElementById('modal-corps');

    try {
        let monResto = await api.menuData(code);

        // null = pas de menu publié pour ce CROUS
        if (!monResto) {
            let info = document.createElement('p');
            info.textContent = "Ce CROUS n'a pas encore publié son menu.";
            corps.append(info);
            return;
        }

        // pour chaque jour
        monResto.data.forEach(element => {
            let unJour = document.createElement('div');
            unJour.append(element.date);
            unJour.classList.add('repas_jour');

            // on check si y a bien un repas prévu
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
    } catch (error) {
        let info = document.createElement('p');
        info.textContent = "Impossible de récupérer le menu de ce CROUS.";
        corps.append(info);
    }
};

/**
 * Récupère les favoris du localStorage et les affiche dans la liste,
 * avec un bouton pour supprimer chaque entrée
 */
async function appelFavoris() {
    let listeFavoris = await api.retrieveStateFromClient();

    // on check si la liste existe ET n'est pas vide
    if (listeFavoris && listeFavoris.length > 0) {
        listeFavoris.forEach(element => {
            let resto = document.createElement('li');

            // span cliquable pour afficher le menu dans la modale
            let nom = document.createElement('span');
            nom.append(element["nom"]);
            nom.title = "Cliquer pour afficher le menu";
            nom.addEventListener("click", () => {
                restoClickListener(element["code"], element["nom"]);
            });
            resto.append(nom);

            // bouton croix pour supprimer le favori
            let btnSuppr = document.createElement('button');
            btnSuppr.classList.add('btn-supprimer-favori');
            btnSuppr.title = "Supprimer ce favori";
            btnSuppr.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
            btnSuppr.addEventListener("click", () => {
                // on demande confirmation avant de supprimer
                if (confirm(`Voulez-vous vraiment supprimer "${element.nom}" de vos favoris ?`)) {
                    api.saveStateToClient(element.nom, element.code);
                    resto.remove();
                }
            });
            resto.append(btnSuppr);

            view.divFav.append(resto);
        });
    } else {
        let pasFav = document.createElement('li');
        pasFav.id = "no_favoris";
        pasFav.append("Pas encore de favoris enregistrés");
        view.divFav.append(pasFav);
    }
}

// fermeture modale via le bouton ✕
document.getElementById('modal-fermer').addEventListener('click', fermerModal);

// fermeture en cliquant sur le fond
document.getElementById('modal-menu').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) fermerModal();
});

// fermeture avec Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fermerModal();
});

// appel les favoris
appelFavoris();

// appel toutes les régions
appelRegion();
