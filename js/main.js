import { view } from './vue.js';
import * as api from "./api.js";

// function allRegion() {

//     let promiseObj = fetch('https://api.croustillant.menu/v1/regions');
//     promiseObj.then((resp) => resp.json())
//         .then((data) => {
//             console.log(data);
//         })
// }

view.reserachBtn.addEventListener("click", function () {
  // Informe le modèle du changement
  let mesRegions = api.allRegion();//.SearchCategory(view.reserachInput);
});