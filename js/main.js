import { view } from './vue.js';
import * as api from "./api.js";

let listeRegion = [];

//appel la fonction qui affiche tous les restaurants de la région
let regionClickListener = function (event, codeRegion) {
    console.log(codeRegion);
    (codeRegion);
    // Informe le modèle du changement
    api.allRestoFromRegion(codeRegion);
};

view.reserachBtn.addEventListener("click", async function () {

    //faire un squelette de chargement

    // Informe le modèle du changement
    let mesRegions = await api.allRegion();
    console.log(mesRegions);
    //pour chaque région:
    mesRegions.data.forEach(element => {
        //création d'une div avec une id unique et une classe partagé
        let div = document.createElement("div");
        div.classList.add("Regions");
        div.id = element.libelle;

        //stock le nom et l'Id de la région dans un tableau pour réutilisation
        listeRegion[element.libelle] = element.code;
        //alert(element.code);

        //afficher la région
        var lien = document.createElement('a');
        lien.href = `liste_restaurants.html?${element.code}`;
        lien.append(element.libelle); 

        div.append(lien);
        view.divResult.append(div);
                
    });

});


//aRef.addEventListener("click", fn.bind({}, webOnly))