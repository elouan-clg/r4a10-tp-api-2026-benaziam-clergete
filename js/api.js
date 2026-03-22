
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
//forme [{"nom":"RU1","code":1}, {"nom":"cafet","code":2}] ou [] si aucun favoris
export function saveStateToClient(nom, code){
    let RestoKV = {nom, code};
    let listeResto = localStorage.getItem(`pref`);
    let listeKVResto = JSON.parse(listeResto) ?? [];
    //si le resto n'est pas en favoris, on l'ajoute
    let i =0;
    while (i < listeKVResto.length && listeKVResto[i]!= RestoKV) {
        console.log("-----");console.log(listeKVResto[i]== RestoKV);
        console.log(`i est ${i}, listeKVReso[i] est `);
        console.log(listeKVResto[i]);
        console.log(`et RestoKV est `);
        console.log(RestoKV);
        i++;            
    }
    console.log("-----");

    
    console.log(listeKVResto[i]!= RestoKV);
    console.log(i== listeKVResto.length);
    
    if (i == listeKVResto.length && listeKVResto[i]!= RestoKV) {
        listeKVResto.push(RestoKV)
    }
    //sinon on l'enlève
    else{
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
