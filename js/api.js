
//appel l'Api pour recevoir toutes les régions
export function allRegion() {
    return fetch('https://api.croustillant.menu/v1/regions')
    .then((resp) => {
        if (!resp.ok) {throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
}

//appel l'Api pour recevoir toutes les restaurants CROUS de la région demandé
export async function allRestoFromRegion(regionId, elementRech=null ) {  
    let ListeTTResto = await fetch(`https://api.croustillant.menu/v1/regions/${regionId}/restaurants`)
    .then((resp) => {
        if (!resp.ok) {throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });

    //console.log(ListeTTResto.data);
    //console.log(`recherche ${elementRech}`);
    if (elementRech==null) {
            //console.log("rentre dans if");
            return ListeTTResto.data;
    } else {
        //console.log("rentre dans else");
        const re = new RegExp(String.raw`.*${elementRech}.*`, "gi");//.*"+elementRech+".*/gi;
        let listeAcceptant = [];
        let i = 0;//sert pour construire les index de la liste
        ListeTTResto.data.forEach(element => {
            //console.log("/."+elementRech+"./gi")
            if (element.nom.match(re) != null) {
                //console.log(element.nom);
                //console.log("c'est acceptant");
                listeAcceptant[i] = element
                i++;
            }
        });
        return listeAcceptant;
    }
}


//appel l'Api pour recevoir les info du menu du restaurant choisis
export function menuData(code) { 
    //console.log(code);
    
    let mr = fetch(`https://api.croustillant.menu/v1/restaurants/${code}/menu`)
    .then((resp) => {
        if (!resp.ok) {throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
    //console.log(mr);
    return mr;
}

//appel l'Api pour recevoir les info du restaurant choisis
export function restoData(code) { 
    //console.log(code);
    
    let mr = fetch(`https://api.croustillant.menu/v1/restaurants/${code}`)
    .then((resp) => {
        if (!resp.ok) {throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
    //console.log(mr);
    return mr;
}



//sauvegarde d'un restaurant en favoris
export function saveStateToClient(nom, code){
    console.log(nom, code);
    
    let RestoKV = {nom, code};
    console.log(RestoKV);
    
    let listeResto = localStorage.getItem(`pref`);
    console.log(listeResto);
    console.log(listeResto != null);
    
    //si j'ai des éléments dans ma liste je l'ajoute
    if (listeResto) {
        console.log("rentre dans le if donc listResto non null");
        
        let listeKVResto = JSON.parse(listeResto);        
        listeKVResto.push(RestoKV)
        localStorage.setItem("pref", JSON.stringify(listeKVResto));
    }
    //sinon je créer le Local Storage
    else{
        localStorage.setItem("pref", JSON.stringify([RestoKV]));
    }
}


// renvoie la liste des restorants mis en favoris
async function retrieveStateFromClient(){

let chaineJSON = localStorage.getItem("memoryContent");
if(chaineJSON){
    //this.#memory = JSON.parse(chaineJSON);
}

chaineJSON = localStorage.getItem("editableButtonsContent");
if(chaineJSON){
    
    //alert("dans chainJSon");
    //console.log(this.#editableButtons);
    let objNew = JSON.parse(chaineJSON);
    //console.log(objNew);
    //for (const id in this.#editableButtons) {
    //console.log(this.#editableButtons[id]);
    //console.log(this.#editableButtons[id].idBtn);
    //console.log(this.getValueEditableButton(id));
    //console.log(this.#editableButtons[id]);
    if (objNew[id] != null) {
        this.setValueEditableButton(id, objNew[id]);
    }
    //console.log(objNew[id]);
    
    //this.setValueEditableButton(i, valueJSON.parse(chaineJSON)[i]);
    }
}
