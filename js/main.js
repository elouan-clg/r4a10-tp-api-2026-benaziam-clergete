import { view } from './vue.js';
import { api } from './api.js';


view.reserachBtn.addEventListener("click", function () {
  // Informe le modèle du changement
  let listApi = api.SearchCategory(view.reserachInput);
  listApi.forEach(uneApi => {
    let div = document.createElement("div");
    let p = document.createElement("p");
    div.append(p);
    p.append(uneApi);
  });
});