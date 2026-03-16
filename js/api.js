

// export function randomCall() {

//     let promiseObj = fetch("https://www.freepublicapis.com/api/random");
//     promiseObj.then((resp) => resp.json())
//         .then((data) => {
//             console.log(data);
//         })
// }
//randomCall();

function allRegion() {

    let promiseObj = fetch('api.croustillant.menu/v1/regions');
    promiseObj.then((resp) => resp.json())
        .then((data) => {
            console.log(data);
        })
}

