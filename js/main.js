import { view } from './vue.js';
import * as api from "./api.js";
//import { afficher } from './appel_region.js';

export function afficherResto(data) {
    let div = view.divResult;

    //vide l'affichage
    //viderClass('res');
    const elements = document.getElementsByClassName('res');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    //3eme bocle non optimisé: boucle pour vider les favoris existants
    //viderClass('btn-favoris)');
    const favsAuRevoirs = document.getElementsByClassName('btn-favoris');
    while(favsAuRevoirs.length > 0){
        favsAuRevoirs[0].parentNode.removeChild(favsAuRevoirs[0]);
    }

    //affiche les resto potentiels
    data.forEach(element => {
      let eleCont = document.createElement('p');
      eleCont.append(element.nom);
      eleCont.classList.add('res');
      eleCont.id = element.code;
      eleCont.addEventListener("click", () => {
          restoClickListener(element.code);
      });
      div.append(eleCont);

      //permet de le mettre en favoris
      let boutonFav = document.createElement('button');
      boutonFav.classList.add(`btn-favoris`);// ${element.nom}, ${element.code}`);
      boutonFav.type="button";
      boutonFav.title="Ajouter la recherche aux favoris";
      //mets la petite étoile dans le bouton
      let etoile = document.createElement('img');
      etoile.src="images/etoile-vide.svg";
      etoile.alt="Liste Favoris";
      etoile.width="22";
      boutonFav.append(etoile);
      boutonFav.addEventListener("click", () => {
        try {api.saveStateToClient(element.nom, element.code);}
        catch (err) {console.error(err);}
      });
      div.append(boutonFav);
    });

}

//mets à jour le menu quand on clique sur un restaurant CROUS
let restoClickListener = async function (code) {  
  const elements = document.getElementsByClassName('repas_jour');
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
  try {
    let monResto = await api.menuData(code);
    
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
      //pour *aider*(pas résoudre) à comprendre ces if dans ces if: décommenter les lignes du dessus

      // on check si y a bien un repas prevu et si les categories existent
      if (element.repas && element.repas.length > 0 && element.repas[0].categories) {
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
      } else {
          let msgVide = document.createElement('p');
          msgVide.append("Pas de menu pour ce jour");
          unJour.append(msgVide);
      }
      
      view.divRepas.append(unJour);
    });
  }
  catch (error) {
    view.divRepas.append("Aucune information donnée par ce CROUS");
  }
};

let tousLesRestos = []; // on garde tout en mémoire pour éviter de spam l'API

async function initPage() {
    let idRegion = new URLSearchParams(window.location.search).get("region");
    if (!idRegion) return;

    try {
        tousLesRestos = await api.allRestoFromRegion(idRegion);
        afficherResto(tousLesRestos);
    } catch(err) {
        console.error(err);
    }
}

function filtrerRestos() {
    let texte = view.reserachInput.value.toLowerCase();
    
    let resultats = tousLesRestos.filter(resto => 
        resto.nom.toLowerCase().includes(texte)
    );
    
    afficherResto(resultats);
}

// mets à jour les recherches quand on clique ou qu'on tape
view.reserachBtn.addEventListener("click", filtrerRestos);
view.reserachInput.addEventListener("input", filtrerRestos);

// vide l'affichage précédent
function viderClass(nomChamp) {
    const elements = document.getElementsByClassName(nomChamp);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// lance le chargement au démarrage
initPage();