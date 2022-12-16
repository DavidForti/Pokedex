let pokemonId = 1;
let cardVisibility = "";
let allPokemons = [];
let initialPok = 0;
let endPok = 50;

let allTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy"
];

let allColors = [
    "#aaaa12",
    "#ff4422",
    "#3399ff",
    "#ffcc33",
    "#77cc55",
    "#66ccff",
    "#bb5544",
    "#aa5599",
    "#ddbb55",
    "#8899ff",
    "#ff5599",
    "#aabb22",
    "#bbaa66",
    "#6666bb",
    "#7766ee",
    "#775544",
    "#aaaabb",
    "#ee99ee"
];

async function loadPokedex() {
    document.getElementById('btnDiv').classList.add('d-none');
    document.getElementById('search').value = '';
    for (let i = initialPok; i < endPok; i++) {
        await loadPokemon();
        addCard(i);
    }
    showButton();
    ajustVariables();
}

function ajustVariables() {
    if (endPok > 899) {
        initialPok = endPok;
        endPok = 905;
    } else {
        initialPok = endPok;
        endPok = endPok + 100;
    }
}

function showButton() {
    if (endPok == 905) {
        document.getElementById('btnDiv').classList.add('d-none');
    } else {
        document.getElementById('btnDiv').classList.remove('d-none');
    }

}

function addCard(i) {
    let content = document.getElementById('content');
    let pok = allPokemons[i];
    content.innerHTML +=
        `
    <div id="card${i}" class="card ${cardVisibility}" style="background-color: ${pok["color"]};" onclick="showBack(${i})">
    <div class="card-header">
        <h3>${pok["name"][0].toUpperCase() + pok["name"].slice(1)}</h3>
       
    </div>
    <div class="card-content flex">

        <div class="card-cont-left">${typesHtml(i)}</div>

        <div class="card-cont-right">
            <img class="img-front" src="${pok["img"]}" alt="">
        </div>
    </div>

    </div>
    `;
}

function search() {
    let input = document.getElementById('search').value;
    input = input.toLowerCase();
    console.log(input);
    if (input) {
        cardVisibility = "d-none";
        changeVisibilityOfAllCards("hide");
        showSearch(input);
    } else {
        cardVisibility = "";
        changeVisibilityOfAllCards("show");
    }
}

function changeVisibilityOfAllCards(visibility) {
    if (visibility == "hide") {
        for (let i = 0; i < allPokemons.length; i++) {
            document.getElementById(`card${i}`).classList.add("d-none");
        }
    }
    if (visibility == "show") {
        for (let i = 0; i < allPokemons.length; i++) {
            document.getElementById(`card${i}`).classList.remove("d-none");
        }
    }
}

function showSearch(input) {
    for (let i = 0; i < allPokemons.length; i++) {
        const pok = allPokemons[i];
        if (pok["name"].includes(input)) {
            document.getElementById(`card${i}`).classList.remove('d-none');
        }
    }
}

function typesHtml(i) {
    let pok = allPokemons[i];
    let types = ``;
    for (let j = 0; j < pok["types"].length; j++) {
        const type = pok["types"][j];
        types += `
        <div class="type" style="background-color: black;};">
        ${type}
        </div>`;
    }
    return types;
}

function showBack(i) {
    overlayBackName(i);
    heightWeightHP(i);
    AttackDefenseSpace(i);
    speedTypes(i);

}

function overlayBackName(i) {
    let pok = allPokemons[i];
    document.getElementById('aboutPoke').classList.add("d-none");
    document.getElementById('overlay').classList.remove("d-none");
    document.getElementById('back').classList.remove("d-none");
    document.getElementById('back').style = `background-color: ${pok["color"]}`;
    document.getElementById('backName').innerHTML = pok["name"][0].toUpperCase() + pok["name"].slice(1);
    document.getElementById('backImg').src = pok["img"];
}

function heightWeightHP(i) {
    let pok = allPokemons[i];
    document.getElementById('backSpecies').innerHTML = `Species: ${pok["name"]}`;
    document.getElementById('backHeight').innerHTML = `Height: ${pok["height"]}`;
    document.getElementById('backWeight').innerHTML = `Weight: ${pok["weight"]}`;
    document.getElementById('backHp').innerHTML = pok["hp"];
    document.getElementById('backHp').style = `width: ${pok["hp"]}%; background-color: ${pok["color"]};`;
}

function AttackDefenseSpace(i) {
    let pok = allPokemons[i];
    document.getElementById('backAttack').innerHTML = pok["attack"];
    document.getElementById('backAttack').style = `width: ${pok["attack"]}%; background-color: ${pok["color"]};`;
    document.getElementById('backDefense').innerHTML = pok["defense"];
    document.getElementById('backDefense').style = `width: ${pok["defense"]}%; background-color: ${pok["color"]};`;
    document.getElementById('backSpecAttack').innerHTML = pok["special-attack"];
    document.getElementById('backSpecAttack').style = `width: ${pok["special-attack"]}%; background-color: ${pok["color"]};`;
    document.getElementById('backSpecDefense').innerHTML = pok["special-defense"];
    document.getElementById('backSpecDefense').style = `width: ${pok["special-defense"]}%; background-color: ${pok["color"]};`;
    document.getElementById('backSpeed').innerHTML = pok["speed"];
}
function speedTypes(i) {
    let pok = allPokemons[i];
    document.getElementById('backSpeed').style = `width: ${pok["speed"]}%; background-color: ${pok["color"]};`;
    document.getElementById('backTypes').innerHTML = typesHtml(i);
}

function card() {
    document.getElementById('overlay').classList.add("d-none");
    document.getElementById('back').classList.add("d-none");
}

async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    savePokemon(responseAsJson);
    pokemonId++;
}

function savePokemon(pokJson) {
   
    let pokName = pokJson["name"];
    let pokImg = pokJson["sprites"]["other"]["official-artwork"]["front_default"];
    let pokTypes = getPokTypes(pokJson);
    let pokColor = getPokColor(pokJson);
    let pokHeight = pokJson["height"];
    let pokWeight = pokJson["weight"];
    let pokHp = pokJson["stats"][0]["base_stat"];
    let pokAttack = pokJson["stats"][1]["base_stat"];
    let pokDefense = pokJson["stats"][2]["base_stat"];
    let pokSpecialAtt = pokJson["stats"][3]["base_stat"];
    let pokSpecialDef = pokJson["stats"][4]["base_stat"];
    let pokSpeed = pokJson["stats"][5]["base_stat"];

    let newPokemon = {
         "name": pokName, "img": pokImg, "types": pokTypes, "color": pokColor,
        "height": pokHeight, "weight": pokWeight, "hp": pokHp, "attack": pokAttack, "defense": pokDefense,
        "special-attack": pokSpecialAtt, "special-defense": pokSpecialDef, "speed": pokSpeed,
    };
    allPokemons.push(newPokemon);
}

function getPokTypes(pokJson) {
    let array = [];
    for (let i = 0; i < pokJson["types"].length; i++) {
        const type = pokJson["types"][i]["type"]["name"]
        array.push(type);
    }
    return array;
}

function getPokColor(pokJson) {

    let types = getPokTypes(pokJson);
    let firstType = types[0];
    let index = allTypes.indexOf(firstType);
    let color = allColors[index];
    return color;
}

function about() {
    document.getElementById('baseStats').classList.add("d-none");
    document.getElementById('aboutPoke').classList.remove("d-none");
}

function Stats() {
    document.getElementById('baseStats').classList.remove("d-none");
    document.getElementById('aboutPoke').classList.add("d-none");
}