
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

//appel l'Api pour recevoir tous les restaurants CROUS de la région demandée
export async function allRestoFromRegion(regionId) {  
    let resp = await fetch(`https://api.croustillant.menu/v1/regions/${regionId}/restaurants`);
    if (!resp.ok) {
        throw new Error('Erreur HTTP : ' + resp.status); 
    }
    let json = await resp.json();
    return json.data;
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

//permet de faire un booléen convenable pour savoir si l'objet existe déjà
function compareResto(resto1, resto2) {
    try{    
        return resto1["nom"] == resto2["nom"] && resto1["code"] == resto2["code"];
    } catch (error) {
        //il y a eu un problème quelque part, c'est pas identique
        return false
    }
}

//sauvegarde d'un restaurant en favoris
//forme [{"nom":"RU1","code":1}, {"nom":"cafet","code":2}] ou [] si aucun favoris
export function saveStateToClient(nom, code){
    let RestoKV = {nom, code};
    let listeResto = localStorage.getItem(`pref`);
    let listeKVResto = JSON.parse(listeResto) ?? [];
    //si le resto n'est pas en favoris, on l'ajoute
    let i =0;
    let dejaPresent = false;
    while (i < listeKVResto.length && !dejaPresent ) {
        dejaPresent = compareResto(listeKVResto[i],RestoKV);
        i++;            
    }
    
    if (i == listeKVResto.length && !dejaPresent) {
        //console.log("on ajoute");
        listeKVResto.push(RestoKV)
    }
    //sinon on l'enlève
    else{
        //console.log("on enlève");
        listeKVResto.pop(RestoKV)
    }
    if(listeKVResto.length > 0){
        localStorage.setItem("pref", JSON.stringify(listeKVResto));
    }
    else{
        localStorage.setItem("pref", JSON.stringify(null));
    }
    
}

// renvoie la liste des restorants mis en favoris
export function retrieveStateFromClient(){

let chaineJSON = localStorage.getItem("pref");
    if(chaineJSON){
        return JSON.parse(chaineJSON);
    }
    return false;
}
