
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
        if (!listeKVResto.some(resto => resto.code === code)) { //on verif que le resto n'est pas deja favoris
            listeKVResto.push(RestoKV);
            localStorage.setItem("pref", JSON.stringify(listeKVResto));
        }
    
    }
    //sinon je créer le Local Storage
    else{
        localStorage.setItem("pref", JSON.stringify([RestoKV]));
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
