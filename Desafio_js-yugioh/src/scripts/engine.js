const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-card"),
        computer: document.getElementById("computer-card"),
    },
    playerSides: {
        player1: "player-field",
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const cardData = [
    { id: 0, name: "Dragão Branco", type: "Pedra", img: "src/assets/icons/dragon.png" },
    { id: 1, name: "Mago Negro", type: "Papel", img: "src/assets/icons/magician.png" },
    { id: 2, name: "Exodia", type: "Tesoura", img: "src/assets/icons/exodia.png" },
];

async function getRandomCardId() {
    return Math.floor(Math.random() * cardData.length);
}

// ✅ CORRIGIDO: Esta é a única versão da função, e ela não é "async".
function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card-box");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => drawSelectCard(IdCard));
        cardImage.addEventListener("click", () => setCardsField(IdCard));
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllSelectableCards();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    // Converte cardId para número para garantir que a busca no array funcione
    const numericCardId = parseInt(cardId, 10);
    state.fieldCards.player.src = cardData[numericCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(numericCardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function removeAllSelectableCards() {
    let cards = document.querySelector(".player-field");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.type === "Pedra" && cardData[computerCardId].type === "Tesoura") {
        duelResults = "Ganhou";
    }
    if (playerCard.type === "Papel" && cardData[computerCardId].type === "Pedra") {
        duelResults = "Ganhou";
    }
    if (playerCard.type === "Tesoura" && cardData[computerCardId].type === "Papel") {
        duelResults = "Ganhou";
    }

    if (duelResults === "Ganhou") {
        state.score.playerScore++;
        playAudio("win");
    } else if (duelResults !== "Empate") {
        state.score.computerScore++;
        playAudio("lose");
    }

    return duelResults;
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        await audio.play();
    } catch (e) {}
}

async function updateScore() {
    state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function resetDuel() {
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function drawSelectCard(index) {
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo: " + cardData[index].type;
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    const playerField = document.querySelector(".player-field");
    playerField.innerHTML = "";

    cardData.forEach((card) => {
        const cardImage = createCardImage(card.id, state.playerSides.player1);
        playerField.appendChild(cardImage);
    });
}

state.actions.button.addEventListener("click", resetDuel);

init();