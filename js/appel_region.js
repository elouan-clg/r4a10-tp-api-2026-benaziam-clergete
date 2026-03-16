import { view } from './vue.js';
import * as api from "./api.js";

async function appelRegion() {

    //faire un squelette de chargement

    // Iappel l'API
    let mesRegions = await api.allRegion();
        //console.log(mesRegions);
    //pour chaque région:
    mesRegions.data.forEach(element => {       
        //afficher la région
            //console.log(element.code);
        let div = document.createElement("div");
        //le a permet d'amener sur la page où on peux chercher les restaurants dans notre région
        var lien = document.createElement('a');
        lien.href = `liste_restaurants.html?region=${element.code}`;
        lien.append(element.libelle); 
        div.append(lien);
        view.divResult.append(div);
    });

}
console.log("aaaa");
appelRegion();