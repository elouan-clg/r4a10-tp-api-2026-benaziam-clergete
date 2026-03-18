

// export function randomCall() {

//     let promiseObj = fetch("https://www.freepublicapis.com/api/random");
//     promiseObj.then((resp) => resp.json())
//         .then((data) => {
//             console.log(data);
//         })
// }
//randomCall();

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
export async function allRestoFromRegion(regionId) {
    let resonseResto = await fetch(`https://api.croustillant.menu/v1/regions/${regionId}/restaurants`)
    .then((resp) => {
        if (!resp.ok) {throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
    return resonseResto.data
}

export async function RestoWith(listeResto, elementRech = null) {
    listeResto;
    console.log(listeResto);
    console.log(`recherche ${elementRech}`);
    if (elementRech == null) {
            //console.log("rentre dans if");
            return listeResto;

    } else {
        //console.log("rentre dans else");
        
        let listeAcceptant = [];
        console.log(listeResto);
        
        let i = 0;//sert pour construire les index de la liste
        listeResto.forEach(element => {
            console.log("/."+elementRech+"./")
            if (element.nom.match(elementRech)) {
                //console.log("c'est acceptant");
                listeAcceptant[i] = element
                i++;
            }
        });
        return listeAcceptant;
    }
}