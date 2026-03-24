
/**
 * Appelle l'API pour récupérer toutes les régions disponibles
 * @returns {Promise<Object>} La réponse JSON avec la liste des régions
 */
export function allRegion() {
    return fetch('https://api.croustillant.menu/v1/regions')
    .then((resp) => {
        if (!resp.ok) { throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
}

/**
 * Appelle l'API pour récupérer tous les restaurants CROUS d'une région
 * @param {string} regionId - L'identifiant de la région
 * @returns {Promise<Array>} La liste des restaurants de la région
 */
export async function allRestoFromRegion(regionId) {
    let resp = await fetch(`https://api.croustillant.menu/v1/regions/${regionId}/restaurants`);
    if (!resp.ok) {
        throw new Error('Erreur HTTP : ' + resp.status);
    }
    let json = await resp.json();
    return json.data;
}

/**
 * Appelle l'API pour récupérer le menu du restaurant choisi
 * @param {string|number} code - Le code du restaurant
 * @returns {Promise<Object|null>} Les données du menu, ou null si pas de menu publié (404)
 */
export function menuData(code) {
    let mr = fetch(`https://api.croustillant.menu/v1/restaurants/${code}/menu`)
    .then((resp) => {
        // 404 = ce CROUS n'a simplement pas publié son menu
        if (resp.status === 404) return null;
        if (!resp.ok) { throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
    return mr;
}

/**
 * Appelle l'API pour récupérer les infos d'un restaurant
 * @param {string|number} code - Le code du restaurant
 * @returns {Promise<Object>} Les données du restaurant
 */
export function restoData(code) {
    let mr = fetch(`https://api.croustillant.menu/v1/restaurants/${code}`)
    .then((resp) => {
        if (!resp.ok) { throw new Error('Erreur HTTP : ' + resp.status); }
        return resp.json();
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
    return mr;
}

/**
 * Compare deux objets restaurant pour savoir s'ils sont identiques
 * @param {Object} resto1
 * @param {Object} resto2
 * @returns {boolean} true si les deux restos ont le même nom et le même code
 */
function compareResto(resto1, resto2) {
    try {
        return resto1["nom"] == resto2["nom"] && resto1["code"] == resto2["code"];
    } catch (error) {
        // il y a eu un problème quelque part, c'est pas identique
        return false;
    }
}

/**
 * Sauvegarde ou retire un restaurant des favoris dans le localStorage
 * Forme stockée : [{"nom":"RU1","code":1}, {"nom":"cafet","code":2}] ou [] si aucun favori
 * @param {string} nom - Le nom du restaurant
 * @param {string|number} code - Le code du restaurant
 */
export function saveStateToClient(nom, code) {
    let RestoKV = {nom, code};
    let listeResto = localStorage.getItem(`pref`);
    let listeKVResto = JSON.parse(listeResto) ?? [];

    // si le resto n'est pas en favoris, on l'ajoute
    let i = 0;
    let dejaPresent = false;
    while (i < listeKVResto.length && !dejaPresent) {
        dejaPresent = compareResto(listeKVResto[i], RestoKV);
        i++;
    }

    if (i == listeKVResto.length && !dejaPresent) {
        listeKVResto.push(RestoKV);
    }
    // sinon on l'enlève
    else {
        listeKVResto.pop(RestoKV);
    }

    if (listeKVResto.length > 0) {
        localStorage.setItem("pref", JSON.stringify(listeKVResto));
    } else {
        localStorage.setItem("pref", JSON.stringify(null));
    }
}

/**
 * Récupère la liste des restaurants mis en favoris depuis le localStorage
 * @returns {Array|false} La liste des favoris, ou false si elle est vide
 */
export function retrieveStateFromClient() {
    let chaineJSON = localStorage.getItem("pref");
    if (chaineJSON) {
        return JSON.parse(chaineJSON);
    }
    return false;
}
