const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=24&offset=0";

const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("search");

let cards = [];

async function loadPokemon() {
  try {
    const listRes = await fetch(API_URL);
    if (!listRes.ok) throw new Error("Failed to load list");
    const listData = await listRes.json();

    const pokemonList = await Promise.all(
      listData.results.map(async (item) => {
        const res = await fetch(item.url);
        if (!res.ok) throw new Error("Failed to load " + item.name);
        return res.json();
      })
    );

    statusEl.textContent = "";

    pokemonList.forEach((pokemon) => {
      const card = createCard(pokemon);
      grid.appendChild(card);
      cards.push({ name: pokemon.name, element: card });
    });

    countEl.textContent = `Showing ${cards.length} of ${cards.length} Pokémon`;
  } catch (error) {
    statusEl.textContent = "Something went wrong. Check your connection and refresh.";
    console.error(error);
  }
}

function createCard(pokemon) {
  const card = document.createElement("article");
  card.className = "card";

  const art = document.createElement("div");
  art.className = "art";

  const img = document.createElement("img");
  img.src =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;
  img.alt = pokemon.name;
  art.appendChild(img);

  const name = document.createElement("h2");
  name.textContent = pokemon.name;

  const types = document.createElement("p");
  types.className = "types";
  types.textContent = pokemon.types.map((t) => t.type.name).join(" · ");

  const button = document.createElement("button");
  button.textContent = "Say hello";

  const message = document.createElement("p");
  message.className = "message";

  button.addEventListener("click", () => {
    const abilities = pokemon.abilities.map((a) => a.ability.name);
    message.textContent = `I am ${pokemon.name} and I have ${abilities.join(" and ")}.`;
  });

  card.append(art, name, types, button, message);
  return card;
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach(({ name, element }) => {
    const match = name.includes(term);
    element.classList.toggle("hidden", !match);
    if (match) visible++;
  });

  statusEl.textContent = visible === 0 ? "No Pokémon found." : "";
  countEl.textContent = `Showing ${visible} of ${cards.length} Pokémon`;
});

loadPokemon();