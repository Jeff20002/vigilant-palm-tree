const scoreEl = document.querySelector('#scoreEl');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

function startGame() {
  // Initialize game variables
  let score = 0;
  let lives = 3;

  // Read scores from text file
  let scores = readScoresFromFile();

  // Update scoreboard
  updateScoreboard(scores);

  // Create game objects
  let player = new Player();
  let enemies = createEnemies();

  // Start game loop
  let gameLoop = setInterval(function() {
    // Update game state
    updateGameState(player, enemies);

    // Check for collision
    if (checkCollision(player, enemies)) {
      lives--;
      if (lives === 0) {
        clearInterval(gameLoop);
        endGame(score);
      }
    }

    // Update score
    score++;
    updateScore(score);

  }, 1000 / 60);

  // Handle player input
  document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowUp') {
      player.moveUp();
    } else if (event.code === 'ArrowDown') {
      player.moveDown();
    }
  });
}
function displayHighScores() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let scores = JSON.parse(this.responseText);
      let scoreboard = document.getElementById('scoreboard');
      scoreboard.innerHTML = '';
      for (let i = 0; i < scores.length; i++) {
        let score = scores[i];
        let scoreElement = document.createElement('li');
        scoreElement.innerText = score.name + ': ' + score.score;
        scoreboard.appendChild(scoreElement);
      }
    }
  };
  xhr.open('GET', 'highscores.txt', true);
  xhr.send();
}
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rotation = 0;
    this.opacity = 1;
    const image = new Image();
    image.src = './img/logo.png';
    image.onload = () => {
      const scale = 0.2;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    if (this.image) {
      c.save();
      c.globalAlpha = this.opacity;
      c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
      c.rotate(this.rotation);
      c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
      c.restore();
    }
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;

      // Check for collision with invader projectiles
      for (let i = 0; i < invaderProjectiles.length; i++) {
        const invaderProjectile = invaderProjectiles[i];
        const distance = Math.hypot(
          this.position.x - invaderProjectile.position.x,
          this.position.y - invaderProjectile.position.y
        );

        if (distance - this.width / 2 - invaderProjectile.width / 2 < 1) {
// Game over

const prevGameOverEl = document.querySelector('.game-over');
if (prevGameOverEl) {
  prevGameOverEl.remove();
}

const gameOverEl = document.createElement('div');
gameOverEl.classList.add('game-over');
gameOverEl.style.backgroundImage = "url('./img/backg.png')";
gameOverEl.innerHTML = `
  <h1 style="font-size:40px ; color:white">Game Over</h1>
  <p style="font-size:25px">Your score: ${score}</p>
  <div id="score-message"></div>
  <p>You were hit by a rug pull! This time scammers won,<br> don't give up click retry and try again !</p>
    <div id="save-score-form">
    <label for="name">Enter your name:</label>
    <input type="text" id="name" name="name">
    <button type="submit">Save score</button>
  </div>
  <div id="score-message"></div>
  <button id="refresh-button" onclick="location.reload()">Retry</button>
  <button id="quit-button">I quit</button>
`;

const quitButton = gameOverEl.querySelector('#quit-button');
quitButton.addEventListener('click', () => {
  window.close();
});

const saveScoreForm = gameOverEl.querySelector('#save-score-form');
const scoreMessage = gameOverEl.querySelector('#score-message');
const url = './scores';



// Check if the player's score is in the top 5
const lowestScore = Score.scores.length > 0 ? Score.scores[Score.scores.length - 1].score : 0;
if (score > lowestScore || Score.scores.length < 5) {
  // Show the save score form
  console.log('hey')
  saveScoreForm.style.display = 'block';
  const saveScoreButton = saveScoreForm.querySelector('button');
  saveScoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    const nameInput = saveScoreForm.querySelector('#name');
    const name = nameInput.value;
    Score.addScore(name, score);

    // Save the score to a text file on the server-side using AJAX
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        console.log('Score saved successfully.');
      }
    };
    xhttp.open('POST', 'save-scores.php', true); // Update the URL here
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${name}&score=${score}`);

    // Hide the save score form and show a success message
    saveScoreForm.style.display = 'none';
    scoreMessage.textContent = 'Congrats, you hit the top 5!';
  });
} else {
  // Hide the save score form and show a message that the player's score didn't make it into the top 5
  saveScoreForm.style.display = 'none';
  scoreMessage.textContent = 'Crap ! that score is not enough to top 5';
}
function showLeaderboard() {
  const url = './';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const leaderboard = document.getElementById('leaderboard');
      leaderboard.innerHTML = `
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      `;
      data.sort((a, b) => b.score - a.score);
      data.forEach((item, index) => {
        leaderboard.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
          </tr>
        `;
      });
    })
    .catch(error => console.error(error));
}
document.body.appendChild(gameOverEl);
return;
        }
      }
    }
  }
}
class Score {
  static scores = [];
  static async getScores() {
    const response = await fetch('./scores.txt');
    const scoresText = await response.text();
    const scores = scoresText.split('\n')
      .filter(score => score.trim() !== '')
      .map(score => JSON.parse(score));
    this.scores = scores.sort((a, b) => b.score - a.score);
    console.log ('getkig')
  }

  static async addScore(name, score) {
    const data = { name, score };
    const scoreText = JSON.stringify(data);
    const scoresText = `${scoreText}\n`; // add newline character
    await fetch('./scores.txt', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: scoresText
    });
    // Update the scores array after adding the new score
    this.scores.push(data);
      // Fetch the scores from the text file
await Score.getScores();

  }
  
}

async function updateScores() {
  const scoresContainer = document.getElementById('scores-container');
  scoresContainer.innerHTML = '';

  await Score.getScores();

  if (Score.scores.length === 0) {
    const messageEl = document.createElement('p');
    messageEl.textContent = 'No scores yet. Be the first to play!';
    scoresContainer.appendChild(messageEl);
  } else {
    const tableEl = document.createElement('table');
    tableEl.innerHTML = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;
    const tbodyEl = tableEl.querySelector('tbody');
    for (let i = 0; i < Score.scores.length; i++) {
      const score = Score.scores[i];
      const trEl = document.createElement('tr');
      const rank = i + 1;
      trEl.innerHTML = `
        <td>${rank}</td>
        <td>${score.name}</td>
        <td>${score.score}</td>
      `;
      tbodyEl.appendChild(trEl);
    }
    scoresContainer.appendChild(tableEl);
  }
}
const scoreboardEl = document.getElementById("scoreboard");
const scores = Score.scores;

if (scores.length <= 0) {
  scoreboardEl.innerHTML = "<p>No scores yet!</p>";
} else {
  const scoreListEl = document.createElement("ol");
  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    const scoreEl = document.createElement("li");
    scoreEl.innerHTML = `<span class="name">${score.name}</span><span class="score">${score.score}</span>`;
    scoreListEl.appendChild(scoreEl);
  }
  scoreboardEl.replaceChild(scoreListEl, scoreboardEl.querySelector("ol"));
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;

    const image = new Image();
    image.src = "./img/bullet.png";
    image.onload = () => {
      const scale = 0.2;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
    };
  }

  draw() {
    if (this.image) {
      c.save();
      c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
      c.rotate(Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2);
      c.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      c.restore();
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.001;
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 0;
    this.height = 0;

    const image = new Image();
    image.src = './img/rug.png';
    image.onload = () => {
      const scale = 0.06; // Scale the image
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
    };
  }

  draw() {
    if (this.image) {
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = './img/scammer.png';
    image.onload = () => {
      const scale = 0.08; // Scale invader
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    if (this.image) {
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 15,
        },
      })
    );
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };
    this.invaders = [];
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 50;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 50, // Spacing invader
              y: y * 50, // Spacing invader
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 150;
    }
  }
}

const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
};
let frames = 0;
let game = {
  over: false,
  active: true
};
let score = 0;

for (let i = 0; i < 100; i++) {
  particles.push(new Particle({
    position: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    },
    velocity: {
      x: 0,
      y: 0.2,
    },
    radius: Math.random() * 2,
    color: 'white',
  }));
}

function createParticles({ object, color = '#0EEEF8', fades = true }) {
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle({
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2,
      },
      velocity: {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
      },
      radius: Math.random() * 1.5,
      color,
      fades,
    }));
  }
} 

function animate() {
  if (!game.active) {
    return;
  }
  
  requestAnimationFrame(animate);
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  // Define  o gradiente
  var gradient = c.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0.80, '#06002A');
  gradient.addColorStop(1, '#040853');
  c.fillStyle = gradient;
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  player.update();
  
  particles.forEach((particle, i) => {
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
  });
  
  invaderProjectiles.forEach((InvaderProjectile, index) => {
    if (InvaderProjectile.position.y + InvaderProjectile.height >= canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else {
      InvaderProjectile.update();
    }
    if (InvaderProjectile.position.y + InvaderProjectile.height >= player.position.y && 
        InvaderProjectile.position.x + InvaderProjectile.width >= player.position.x &&
        InvaderProjectile.position.x <= player.position.x + player.width) {
      // Projectile hits player
      setTimeout(() => {
        invaderProjectiles.splice(index, 10);
        player.opacity = 0;
        game.over = true;
      }, 0);  
      setTimeout(() => {
        game.active= false;
      }, 1500);
      createParticles({
        object: player,
        color: '#0EEEF8',
        fades: true, 
      });
    }
  });
// Iterate through all projectiles
projectiles.forEach((projectile, index) => {
  // Remove the projectile if it goes beyond the top of the screen
  if (projectile.position.y + projectile.radius <= 0) {
    setTimeout(() => {
      projectiles.splice(index, 1);
    }, 0);
  } else {
    // Update the projectile's position if it has not gone beyond the top of the screen
    projectile.update();
  }
});

// Iterate through all grids
grids.forEach((grid, gridIndex) => {
  // Update the grid
  grid.update();
  
  // Spawn projectiles from invaders every 100 frames
  if (frames % 100 === 0 && grid.invaders.length > 0) {
    grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
  }
  
  // Iterate through all invaders in the grid
  grid.invaders.forEach((invader, i) => {
    // Update the invader's position
    invader.update({ velocity: grid.velocity });
    
    // Check if any projectile hits the invader
    projectiles.forEach((projectile, j) => {
      if (
        projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
        projectile.position.x + projectile.radius >= invader.position.x &&
        projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
        projectile.position.y + projectile.radius >= invader.position.y
      ) {
        // Create particles when an invader is hit
        for (let i = 0; i < 15; i++) {   
          particles.push(new Particle({
            position: {
              x: invader.position.x + invader.width / 2,
              y: invader.position.y + invader.height / 2
            },
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 2,
            color: '#FF7A1A'
          }));
        }
        
        setTimeout(() => {
          // Find the index of the hit invader and the projectile
          const invaderIndex = grid.invaders.findIndex(invader2 => invader2 === invader);
          const projectileIndex = projectiles.findIndex(projectile2 => projectile2 === projectile);

          // Remove the hit invader and projectile
          if (invaderIndex !== -1 && projectileIndex !== -1) {
            // Increase the score by 25 and update the score element
            score += 25;
            scoreEl.innerHTML = score;

            // Create particles when the invader is destroyed
            createParticles({
              object: invader,
              fades: true
            });

            // Remove the invader and projectile from their respective arrays
            grid.invaders.splice(invaderIndex, 1);
            projectiles.splice(projectileIndex, 1);

            // Update the width and position of the grid based on the remaining invaders
            if (grid.invaders.length > 0) {
              const firstInvader = grid.invaders[0];
              const lastInvader = grid.invaders[grid.invaders.length - 1];
              grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
              grid.position.x = firstInvader.position.x;
            } else {
              // Remove the grid if all invaders are destroyed
              grids.splice(gridIndex, 1);
            }
          }
        }, 0);
      }
    });
  });
});

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }
   
  if(frames %700 === 0)  { //spawn invaders
    grids.push(new Grid())
  }
  frames++
}
animate();

addEventListener('keydown', ({key}) => {

    if(game.over) return
    switch (key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;    
            break;
        case ' ':
            projectiles.push(new Projectile({
                position:{
                    x:player.position.x + player.width /7.8,
                    y:player.position.y  
                },
            
                velocity:{
                    x:0,
                    y:-10
                }
            })) 
            break;    
    }
});

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case ' ': 
            break;    
    }
});








