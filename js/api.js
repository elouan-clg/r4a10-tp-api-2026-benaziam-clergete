

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
    .then((mesRegions) => {
            let block = document.getElementById('bloc-resultats');
            console.log(mesRegions);
            mesRegions.data.forEach(element => {
                let div = document.createElement("div");
                let p = document.createElement("p");
                block.append(div);
                div.append(p);
                p.append(element.libelle);
            });
        })
    .catch((err) =>{
        console.error(err);
        throw err;
        });
}

//appel l'Api pour recevoir toutes les restaurants CROUS de la région demandé
export function allRestoFromRegion(regionId) {
    let promiseObj = fetch(`https://api.croustillant.menu/v1/regions/${regionId}/restaurants`);
    return promiseObj.then((resp)  => {
        if (!resp.ok) {throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) =>{
        console.error(err);
        throw err;
        });
}
