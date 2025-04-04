// Variables globales
let balance = 10000;
let currentBet = 100;
let currentGame = null;
let jackpotAmount = 1250000;
let playerXP = 0;
let playerLevel = 1;

// Éléments DOM
const userBalanceEl = document.getElementById('userBalance');
const depositBtn = document.getElementById('depositBtn');
const welcomePopup = document.getElementById('welcomePopup');
const closeWelcome = document.getElementById('closeWelcome');
const claimBonus = document.getElementById('claimBonus');
const depositPopup = document.getElementById('depositPopup');
const closeDeposit = document.getElementById('closeDeposit');
const jackpotAmountEl = document.getElementById('jackpotAmount');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Afficher la popup de bienvenue
  setTimeout(() => {
    welcomePopup.style.display = 'flex';
  }, 1000);
  
  // Mettre à jour le solde affiché
  updateBalance();
  
  // Initialiser les jeux
  initSlotMachine();
  initRoulette();
  initBlackjack();
  
  // Gestionnaires d'événements pour la navigation
  setupGameNavigation();
});

// Fonctions utilitaires
function updateBalance() {
  userBalanceEl.textContent = balance.toLocaleString();
  jackpotAmountEl.textContent = jackpotAmount.toLocaleString();
}

function addToBalance(amount) {
  balance += amount;
  updateBalance();
  if (amount > 0) {
    showWinNotification(`+${amount.toLocaleString()} jetons!`);
  }
}

function deductFromBalance(amount) {
  if (balance >= amount) {
    balance -= amount;
    updateBalance();
    return true;
  } else {
    alert('Solde insuffisant! Veuillez déposer des fonds.');
    depositBtn.click();
    return false;
  }
}

function showWinNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'win-notification';
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.background = 'rgba(0,255,153,0.9)';
  notification.style.color = '#000';
  notification.style.padding = '15px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  notification.style.fontWeight = 'bold';
  notification.style.animation = 'pulse 1s infinite';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transition = 'all 0.5s';
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Gestion des popups
depositBtn.addEventListener('click', () => {
  depositPopup.style.display = 'flex';
});

closeWelcome.addEventListener('click', () => {
  welcomePopup.style.display = 'none';
});

claimBonus.addEventListener('click', () => {
  addToBalance(1000);
  welcomePopup.style.display = 'none';
  showWinNotification('Bonus de 1000 jetons crédités!');
});

closeDeposit.addEventListener('click', () => {
  depositPopup.style.display = 'none';
});

// Navigation entre les jeux
function setupGameNavigation() {
  // Cacher tous les jeux au départ
  document.querySelectorAll('.slot-machine, .roulette-container, .blackjack-container').forEach(el => {
    el.style.display = 'none';
  });
  
  // Afficher le lobby
  document.querySelector('.games-grid').style.display = 'grid';
  
  // Gestionnaires pour les boutons de jeu
  document.getElementById('slotGame').addEventListener('click', () => {
    document.querySelector('.games-grid').style.display = 'none';
    document.getElementById('slotMachineGame').style.display = 'block';
    currentGame = 'slots';
  });
  
  document.getElementById('rouletteGame').addEventListener('click', () => {
    document.querySelector('.games-grid').style.display = 'none';
    document.getElementById('rouletteGameContainer').style.display = 'block';
    currentGame = 'roulette';
  });
  
  document.getElementById('blackjackGame').addEventListener('click', () => {
    document.querySelector('.games-grid').style.display = 'none';
    document.getElementById('blackjackGameContainer').style.display = 'block';
    currentGame = 'blackjack';
  });
  
  // Boutons de retour
  document.getElementById('backToLobby').addEventListener('click', backToLobby);
  document.getElementById('backToLobbyRoulette').addEventListener('click', backToLobby);
  document.getElementById('backToLobbyBlackjack').addEventListener('click', backToLobby);
}

function backToLobby() {
  document.querySelectorAll('.slot-machine, .roulette-container, .blackjack-container').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelector('.games-grid').style.display = 'grid';
  currentGame = null;
}

// Gestion des mises
document.querySelectorAll('.bet-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.bet-btn').forEach(b => {
      b.classList.remove('active');
    });
    
    // Ajouter la classe active au bouton cliqué
    this.classList.add('active');
    
    // Mettre à jour la mise actuelle
    const bet = this.dataset.bet === 'MAX' ? balance : parseInt(this.dataset.bet);
    currentBet = bet;
    
    // Mettre à jour le texte des boutons de jeu
    updateGameButtons();
  });
});

function updateGameButtons() {
  document.getElementById('spinButton').textContent = `TOURNER (${currentBet.toLocaleString()} jetons)`;
  document.getElementById('spinRoulette').textContent = `JOUER (${currentBet.toLocaleString()} jetons)`;
  document.getElementById('dealHand').textContent = `DISTRIBUER (${currentBet.toLocaleString()} jetons)`;
}

// Machine à sous
function initSlotMachine() {
  const symbols = ['🍒', '🍋', '🍊', '⭐', '🔔', '7️⃣'];
  const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
  ];
  const resultText = document.getElementById('resultText');
  const spinButton = document.getElementById('spinButton');
  
  spinButton.addEventListener('click', () => {
    if (!deductFromBalance(currentBet)) return;
    
    spinButton.disabled = true;
    resultText.textContent = '';
    
    const results = [];
    
    reels.forEach((reel, index) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      results.push(symbol);
      
      // Animation
      reel.style.transform = 'rotateX(360deg)';
      setTimeout(() => {
        reel.textContent = symbol;
        reel.style.transform = 'rotateX(0deg)';
      }, 300 + index * 100);
    });
    
    setTimeout(() => {
      checkSlotWin(results);
      spinButton.disabled = false;
    }, 800);
  });
  
  function checkSlotWin(results) {
    const [a, b, c] = results;
    let winAmount = 0;
    
    if (a === b && b === c) {
      // Jackpot pour 3 symboles identiques
      if (a === '7️⃣') {
        winAmount = currentBet * 50;
        resultText.textContent = `MEGA JACKPOT!!! ${winAmount.toLocaleString()} jetons!`;
        // Contribuer au jackpot progressif
        jackpotAmount += currentBet;
        updateBalance();
      } else {
        winAmount = currentBet * 10;
        resultText.textContent = `JACKPOT! ${winAmount.toLocaleString()} jetons!`;
      }
      resultText.style.color = '#00ff00';
      document.getElementById('slotMachineGame').style.animation = 'win 1s 3';
    } else if (a === b || b === c || a === c) {
      // Gain pour 2 symboles identiques
      winAmount = currentBet * 2;
      resultText.textContent = `Gagné! ${winAmount.toLocaleString()} jetons!`;
      resultText.style.color = '#ffff00';
    } else {
      // Perdu
      resultText.textContent = 'Perdu... Essayez encore!';
      resultText.style.color = '#ff3333';
    }
    
    if (winAmount > 0) {
      addToBalance(winAmount);
    }
  }
}

// Roulette
function initRoulette() {
  const rouletteNumbers = document.getElementById('rouletteNumbers');
  const spinRouletteBtn = document.getElementById('spinRoulette');
  const numbers = [
    { number: 0, color: 'green' },
    { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 19, color: 'red' },
    { number: 4, color: 'black' }, { number: 21, color: 'red' }, { number: 2, color: 'black' },
    { number: 25, color: 'red' }, { number: 17, color: 'black' }, { number: 34, color: 'red' },
    { number: 6, color: 'black' }, { number: 27, color: 'red' }, { number: 13, color: 'black' },
    { number: 36, color: 'red' }, { number: 11, color: 'black' }, { number: 30, color: 'red' },
    { number: 8, color: 'black' }, { number: 23, color: 'red' }, { number: 10, color: 'black' },
    { number: 5, color: 'red' }, { number: 24, color: 'black' }, { number: 16, color: 'red' },
    { number: 33, color: 'black' }, { number: 1, color: 'red' }, { number: 20, color: 'black' },
    { number: 14, color: 'red' }, { number: 31, color: 'black' }, { number: 9, color: 'red' },
    { number: 22, color: 'black' }, { number: 18, color: 'red' }, { number: 29, color: 'black' },
    { number: 7, color: 'red' }, { number: 28, color: 'black' }, { number: 12, color: 'red' },
    { number: 35, color: 'black' }, { number: 3, color: 'red' }, { number: 26, color: 'black' }
  ];

  // Création des nombres sur la roulette
  numbers.forEach((num, index) => {
    const numberEl = document.createElement('div');
    numberEl.className = 'roulette-number';
    numberEl.textContent = num.number;
    numberEl.style.backgroundColor = num.color;
    numberEl.style.transform = `rotate(${index * (360 / numbers.length)}deg) translate(130px) rotate(-${index * (360 / numbers.length)}deg)`;
    rouletteNumbers.appendChild(numberEl);
  });

  spinRouletteBtn.addEventListener('click', () => {
    if (!deductFromBalance(currentBet)) return;
    
    spinRouletteBtn.disabled = true;
    const ball = document.querySelector('.roulette-ball');
    const rotations = 5 + Math.random() * 5; // 5-10 rotations
    const winningIndex = Math.floor(Math.random() * numbers.length);
    const winningNumber = numbers[winningIndex];
    
    // Animation de la balle
      // Animation de la balle
      ball.style.transition = 'all 4s cubic-bezier(0.1, 0.4, 0.9, 0.6)';
      ball.style.transform = `rotate(${rotations * 360 + winningIndex * (360 / numbers.length)}deg) translate(130px) rotate(-${rotations * 360 + winningIndex * (360 / numbers.length)}deg)`;
      
      setTimeout(() => {
        checkRouletteWin(winningNumber);
        spinRouletteBtn.disabled = false;
      }, 4000);
    });
  
    function checkRouletteWin(winningNumber) {
      let winAmount = 0;
      let winMessage = `La bille s'arrête sur: ${winningNumber.number} ${winningNumber.color.toUpperCase()}`;
      
      // Simple mise sur couleur (pour l'exemple)
      if (winningNumber.color === 'red') {
        winAmount = currentBet * 2;
        winMessage += ` - Vous gagnez ${winAmount.toLocaleString()} jetons!`;
      } else if (winningNumber.number === 0) {
        winAmount = currentBet * 35;
        winMessage += ` - ZÉRO! Vous gagnez ${winAmount.toLocaleString()} jetons!`;
      } else {
        winMessage += " - Vous perdez... Essayez encore!";
      }
      
      // Afficher le résultat
      const resultEl = document.createElement('div');
      resultEl.textContent = winMessage;
      resultEl.style.color = winAmount > 0 ? '#00ff00' : '#ff3333';
      resultEl.style.marginTop = '15px';
      resultEl.style.fontWeight = 'bold';
      document.querySelector('.roulette-controls').appendChild(resultEl);
      
      if (winAmount > 0) {
        addToBalance(winAmount);
      }
      
      // Supprimer le résultat après 5 secondes
      setTimeout(() => {
        resultEl.remove();
      }, 5000);
    }
  }
  
  // Blackjack
  function initBlackjack() {
    const deck = createDeck();
    let playerHand = [];
    let dealerHand = [];
    let gameInProgress = false;
    
    const dealHandBtn = document.getElementById('dealHand');
    const hitBtn = document.getElementById('hitBtn');
    const standBtn = document.getElementById('standBtn');
    const doubleBtn = document.getElementById('doubleBtn');
    const gameActions = document.getElementById('gameActions');
    const playerArea = document.getElementById('playerHand');
    const dealerArea = document.getElementById('dealerHand');
    
    dealHandBtn.addEventListener('click', () => {
      if (gameInProgress) return;
      if (!deductFromBalance(currentBet)) return;
      
      // Préparer le jeu
      gameInProgress = true;
      playerHand = [];
      dealerHand = [];
      playerArea.innerHTML = '';
      dealerArea.innerHTML = '';
      
      // Distribuer les cartes
      playerHand.push(drawCard(deck));
      dealerHand.push(drawCard(deck));
      playerHand.push(drawCard(deck));
      dealerHand.push(drawCard(deck, true)); // Carte cachée pour le croupier
      
      // Afficher les cartes
      displayCards();
      
      // Vérifier blackjack immédiat
      if (calculateHandValue(playerHand) === 21) {
        endGame("BLACKJACK! Vous gagnez 2.5x votre mise!", currentBet * 2.5);
        return;
      }
      
      // Activer les options de jeu
      dealHandBtn.style.display = 'none';
      gameActions.style.display = 'block';
    });
    
    hitBtn.addEventListener('click', () => {
      playerHand.push(drawCard(deck));
      displayCards();
      
      const playerValue = calculateHandValue(playerHand);
      if (playerValue > 21) {
        endGame("Vous avez dépassé 21! Vous perdez.", 0);
      } else if (playerValue === 21) {
        standBtn.click(); // Auto-stand sur 21
      }
    });
    
    standBtn.addEventListener('click', () => {
      // Retourner la carte cachée du croupier
      dealerHand[1].hidden = false;
      displayCards();
      
      // Le croupier joue
      dealerPlay();
    });
    
    doubleBtn.addEventListener('click', () => {
      if (playerHand.length !== 2) return;
      if (!deductFromBalance(currentBet)) return;
      
      currentBet *= 2;
      playerHand.push(drawCard(deck));
      displayCards();
      
      const playerValue = calculateHandValue(playerHand);
      if (playerValue > 21) {
        endGame("Vous avez dépassé 21! Vous perdez.", 0);
      } else {
        standBtn.click();
      }
    });
    
    function createDeck() {
      const suits = ['♥', '♦', '♣', '♠'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const deck = [];
      
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ suit, value });
        }
      }
      
      // Mélanger le deck
      return shuffleDeck(deck);
    }
    
    function shuffleDeck(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    }
    
    function drawCard(deck, hidden = false) {
      const card = deck.pop();
      if (deck.length < 15) {
        // Re-mélanger si le deck est presque vide
        deck.push(...createDeck());
      }
      return { ...card, hidden };
    }
    
    function displayCards() {
      playerArea.innerHTML = '';
      dealerArea.innerHTML = '';
      
      playerHand.forEach(card => {
        const cardEl = createCardElement(card);
        playerArea.appendChild(cardEl);
      });
      
      dealerHand.forEach(card => {
        const cardEl = createCardElement(card);
        dealerArea.appendChild(cardEl);
      });
      
      // Afficher les totaux
      const playerTotal = document.createElement('div');
      playerTotal.textContent = `Total: ${calculateHandValue(playerHand)}`;
      playerTotal.style.color = 'white';
      playerTotal.style.marginTop = '10px';
      playerArea.appendChild(playerTotal);
      
      // Ne montrer que la première carte du croupier si la partie est en cours
      if (gameInProgress && dealerHand[1].hidden) {
        const dealerTotal = document.createElement('div');
        dealerTotal.textContent = `Total: ${getCardValue(dealerHand[0])}`;
        dealerTotal.style.color = 'white';
        dealerTotal.style.marginTop = '10px';
        dealerArea.appendChild(dealerTotal);
      } else {
        const dealerTotal = document.createElement('div');
        dealerTotal.textContent = `Total: ${calculateHandValue(dealerHand)}`;
        dealerTotal.style.color = 'white';
        dealerTotal.style.marginTop = '10px';
        dealerArea.appendChild(dealerTotal);
      }
    }
    
    function createCardElement(card) {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      
      if (card.hidden) {
        cardEl.textContent = '🂠';
        cardEl.style.background = 'linear-gradient(135deg, #ff0080, #7928ca)';
      } else {
        cardEl.textContent = getCardSymbol(card);
        if (card.suit === '♥' || card.suit === '♦') {
          cardEl.classList.add('red');
        }
      }
      
      return cardEl;
    }
    
    function getCardSymbol(card) {
      const suitSymbols = {
        '♥': 'H', '♦': 'D', '♣': 'C', '♠': 'S'
      };
      return card.value + suitSymbols[card.suit];
    }
    
    function calculateHandValue(hand) {
      let value = 0;
      let aces = 0;
      
      for (let card of hand) {
        if (card.hidden) continue;
        
        const cardValue = getCardValue(card);
        value += cardValue;
        if (cardValue === 11) aces++;
      }
      
      // Gérer les As souples
      while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
      }
      
      return value;
    }
    
    function getCardValue(card) {
      if (card.value === 'A') return 11;
      if (['K', 'Q', 'J'].includes(card.value)) return 10;
      return parseInt(card.value);
    }
    
    function dealerPlay() {
      // Retourner la carte cachée
      dealerHand[1].hidden = false;
      displayCards();
      
      let dealerValue = calculateHandValue(dealerHand);
      
      // Le croupier tire jusqu'à 17 ou plus
      const drawInterval = setInterval(() => {
        if (dealerValue < 17) {
          dealerHand.push(drawCard(deck));
          displayCards();
          dealerValue = calculateHandValue(dealerHand);
        } else {
          clearInterval(drawInterval);
          determineWinner();
        }
      }, 1000);
    }
    
    function determineWinner() {
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(dealerHand);
      let winAmount = 0;
      let message = '';
      
      if (playerValue > 21) {
        message = "Vous avez dépassé 21! Vous perdez.";
      } else if (dealerValue > 21) {
        winAmount = currentBet * 2;
        message = `Le croupier a dépassé 21! Vous gagnez ${winAmount.toLocaleString()} jetons!`;
      } else if (playerValue > dealerValue) {
        winAmount = currentBet * 2;
        message = `Vous avez ${playerValue} contre ${dealerValue}! Vous gagnez ${winAmount.toLocaleString()} jetons!`;
      } else if (playerValue === dealerValue) {
        winAmount = currentBet;
        message = `Égalité ${playerValue}-${dealerValue}! Vous récupérez votre mise.`;
      } else {
        message = `Vous avez ${playerValue} contre ${dealerValue}! Vous perdez.`;
      }
      
      endGame(message, winAmount);
    }
    
    function endGame(message, winAmount) {
      gameInProgress = false;
      
      // Afficher le résultat
      const resultEl = document.createElement('div');
      resultEl.textContent = message;
      resultEl.style.color = winAmount > currentBet ? '#00ff00' : winAmount > 0 ? '#ffff00' : '#ff3333';
      resultEl.style.marginTop = '15px';
      resultEl.style.fontWeight = 'bold';
      resultEl.style.fontSize = '1.2rem';
      document.querySelector('.blackjack-controls').appendChild(resultEl);
      
      if (winAmount > 0) {
        addToBalance(winAmount);
      }
      
      // Réinitialiser pour la prochaine partie
      setTimeout(() => {
        dealHandBtn.style.display = 'block';
        gameActions.style.display = 'none';
        resultEl.remove();
      }, 5000);
    }
  }
  
  // Techniques d'engagement supplémentaires
  let inactivityTimer;
  
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      showInactivityPopup();
    }, 300000); // 5 minutes d'inactivité
  }
  
  function showInactivityPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.display = 'flex';
    popup.innerHTML = `
      <div class="popup-content">
        <h2>Vous nous manquez!</h2>
        <p>Revenez jouer et recevez 100 jetons gratuits!</p>
        <button class="btn btn-primary" id="claimInactivityBonus">PRENDRE MON BONUS</button>
      </div>
    `;
    document.body.appendChild(popup);
    
    document.getElementById('claimInactivityBonus').addEventListener('click', () => {
      addToBalance(100);
      showWinNotification('Bonus de 100 jetons crédités!');
      popup.remove();
      resetInactivityTimer();
    });
  }
  
  // Détection d'inactivité
  document.addEventListener('mousemove', resetInactivityTimer);
  document.addEventListener('keypress', resetInactivityTimer);
  resetInactivityTimer();
  
  // Bonus aléatoires
  setInterval(() => {
    if (Math.random() < 0.01) { // 1% de chance toutes les 30 secondes
      showRandomBonus();
    }
  }, 30000);
  
  function showRandomBonus() {
    const bonuses = [
      { amount: 50, message: "Bonus surprise de 50 jetons!" },
      { amount: 100, message: "Cadeau spécial: 100 jetons gratuits!" },
      { amount: 200, message: "Jackpot surprise! 200 jetons pour vous!" }
    ];
    
    const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
    addToBalance(bonus.amount);
    showWinNotification(bonus.message);
  }
  
  // Système de niveaux et récompenses
  function addXP(amount) {
    playerXP += amount;
    const xpNeeded = playerLevel * 1000;
    
    if (playerXP >= xpNeeded) {
      playerLevel++;
      playerXP = 0;
      const levelUpBonus = playerLevel * 500;
      addToBalance(levelUpBonus);
      showWinNotification(`Niveau ${playerLevel} atteint! ${levelUpBonus.toLocaleString()} jetons bonus!`);
    }
  }
  
  // Ajouter des XP pour les actions du joueur
  document.getElementById('spinButton')?.addEventListener('click', () => addXP(10));
  document.getElementById('spinRoulette')?.addEventListener('click', () => addXP(15));
  document.getElementById('dealHand')?.addEventListener('click', () => addXP(20));