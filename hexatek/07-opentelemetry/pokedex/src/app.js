const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex()

const context = {
    previousOffset: 0,
    nextOffset: 0,
}

function printPokemon(pokemon) {
    console.log("Pokemon", pokemon);
    const pdiv = document.getElementById("pokemon")
    pdiv.innerHTML = ""

    const pokemonTitle = document.createElement("h3")
    pokemonTitle.className ="pokemon-title"
    pokemonTitle.innerHTML = pokemon.name
    pdiv.append(pokemonTitle)

    const speciesElmt = document.createElement("div")
    speciesElmt.className ="pokemon-ability"
    speciesElmt.innerHTML = `<b>Espece:</b> ${pokemon.species.name}`
    pdiv.append(speciesElmt)

    const frontImg = document.createElement("img")
    frontImg.src = `${pokemon.sprites.front_default}`
    pdiv.append(frontImg)

    const backImg = document.createElement("img")
    backImg.src = `${pokemon.sprites.back_default}`
    pdiv.append(backImg)

    const abilityTitle = document.createElement("div")
    abilityTitle.innerHTML = "<b>Capacités:</b>"
    pdiv.append(abilityTitle)
    const abilitiesList = document.createElement("ul")
    for (const ability of pokemon.abilities) {
        console.log(ability)
        if (ability.is_hidden) {
            continue
        }
        const abElmt = document.createElement("li")
        abElmt.className ="pokemon-ability"
        abElmt.innerHTML = ability.ability.name
        abilitiesList.appendChild(abElmt)
    }
    pdiv.append(abilitiesList)

    const statsTitle = document.createElement("div")
    statsTitle.innerHTML = "<b>Statistiques:</b>"
    pdiv.append(statsTitle)
    const statsTable = document.createElement("table")

    const statsTableHeader = document.createElement("tr")
    for (const hTitle of ["Nom", "Effort", "Stat"]) {
        const hTitleElmt = document.createElement("th")
        hTitleElmt.innerHTML = hTitle
        statsTableHeader.appendChild(hTitleElmt)
    }
    statsTable.appendChild(statsTableHeader)

    for (const stat of pokemon.stats) {
        console.log(stat)
        
        const statRow = document.createElement("tr")

        let statCol = document.createElement("td")
        statCol.innerHTML = stat.stat.name
        statRow.appendChild(statCol)

        statCol = document.createElement("td")
        statCol.innerHTML = stat.effort
        statRow.appendChild(statCol)

        statCol = document.createElement("td")
        statCol.innerHTML = stat.base_stat
        statRow.appendChild(statCol)

        statsTable.appendChild(statRow)
    }
    pdiv.append(statsTable)
}

function loadPokemon(e) {
    e.preventDefault();
    P.getPokemonByName(e.target.id).then(printPokemon)
}

function buildPokemonList(pokemons) {
    const pokelist = document.getElementById("pokelist")
    pokelist.innerHTML = ""
    for (const pokemon of pokemons) {
        item = document.createElement("div")
        item.id = pokemon.name
        item.className = "pokemon-link"
        item.innerHTML = pokemon.name
        item.onclick = loadPokemon
        pokelist.append(item)
    }
}

const loadList = function(offset) {
    P.getPokemonsList({limit : 10, offset : offset}).then(function(response) {
        document.getElementById("count").innerHTML = `Le pokedex contient ${response.count} pokemons (De ${offset} à ${offset + 10})`
        buildPokemonList(response.results)
        if (response.previous === null) {
            context.previousOffset = 0
            document.getElementById("previous").setAttribute("disabled", true)
        } else {
            if (URL.canParse(response.previous)) {
                const params = new URL(response.previous).searchParams;
                context.previousOffset = parseInt(params.get("offset"))
                document.getElementById("previous").removeAttribute("disabled")
            }            
        }
        if (response.next === null) {
            context.nextOffset = response.count
            document.getElementById("next").setAttribute("disabled", true)
        } else {
            if (URL.canParse(response.next)) {
                const params = new URL(response.next).searchParams;
                context.nextOffset = parseInt(params.get("offset"))
                document.getElementById("next").removeAttribute("disabled")
            }
        }
    })
}

function previousPage() {
    loadList(context.previousOffset)
}


function nextPage() {
    loadList(context.nextOffset)
}

document.body.onload = function(e) {
    loadList(0);
}

document.getElementById("previous").onclick = previousPage;
document.getElementById("next").onclick = nextPage;