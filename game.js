/* ----- JEU JAVASCRIPT : ULTIMATE COOKIE CLICKER ----- */

/* But du jeu:
On créé un jeu alliant vitesse et précision. Le but: cliquer sur le plus grand nombre de cookies!
A chaque fois que l'on clique sur un cookie, un nouveau cookie apparaît et on gagne un peu de temps. Mais attention! Le compte à rebours défile!

A la fin du jeu, le score est affiché, ainsi que le niveau de précision. Les meilleurs joueurs apparaissent dans le Hall of Fame!
*/


/* TODOLIST:
------------

- Un tableau final s'affiche avec mon score et mon classement
- On me propose une nouvelle partie, mais pas mon pseudo puisqu'on le connaît déjà
- optimiser l'efficacité du code, notamment les getElementbyId. Préférer cette structure:
	var obj;
	obj = document.getElementById("demo");
	obj.innerHTML = "Hello";
- retravailler la structure du jeu: plutôt que de simplement faire apparaître/disparaître des div aux différentes étapes du jeu (welcome, playing, end of the game), on va les créer/supprimer successivement. Cela permet de rejouer des parties l'une après l'autre?
*/



/* Declaration des variables */

const initialTime = 5000, //durée par défaut d'une partie, en ms
	speed = 1000; //vitesse à laquelle s'actualise le timer

let points = 0, //Nombre de points dans une partie
	remainingTime = 0, //Temps restant avant la fin du compte à rebours
	text = "", //Singulier ou pluriel du nombre de points
	pseudo = "", //Pseudo du joueur
	comment = "", //Commentaire sur le résultat
	gaming, //fonction qui gère le temps
	randomXY, //objet contenant deux valeurs aléatoires
	randomCoordinates, //objet contenant une abscisse et une ordonnée aléatoires pour positionner notre objet
	randomPosit, // objet contenant une largeur et une hauteur aléatoires de notre objet
	newDiv, //nouvelle div aux dimensions de l'objet aléatoire
	parentZone, //élément parent de la nouvelle div générée
	divToKill, //notre div qu'on supprime lorsqu'elle a été cliquée
	mainDiv,
	precision = 0,
	clicks = -2,
	gameStats = {},
	scores = [];


let  newTitle, newRules, newSubtitle, newLaunchButton;
let anotherNewDiv, playingDiv, timingSpan;
let gameOverDiv, scoresDiv;
	let element;
	let rank = 1;
	let hallOfFame;
	let secondTitle;
	let scoresTable;



let db;


/* Fonction Initialisation, qui initialise les différentes variables utilisées */

const init = () => {
	points = 0; //on initialise le nombre de points initial
	remainingTime;
	text = "";
}


/* FONCTION "NIVEAU" : fonction qui divise à chaque niveau supplémentaire le temps initial par deux */
const level = (points) => {
	remainingTime = initialTime*(0.75**points);
	return remainingTime;
}


/* Fonction Invite : nom du joueur */
const invite = () => {
	pseudo = prompt("Comment t'appelles-tu?","");
	if(pseudo == '' || pseudo == null) {
		pseudo = "Bel.le Inconnu.e";
	} else {
	}
}


/* Fonction qui va commenter le score final */
const scoreComment = (points) => {
	switch (true) {
		case points == 0:
			comment = "Rohlala "+pseudo+", toi t'as pas compris que le jeu démarrait, hein? Réveille-toi!";
			break;
		case (points <=10):
			comment = "Un mollusque aurait fait mieux que toi...";
			break;
		case (points <=20):
			comment = "Ya du potentiel chez toi, "+pseudo+"!";
			break;
		case (points <=30):
			comment = "Wahou "+pseudo+", ya de la graine de champion en toi!";
			break;
		case (points >30):
			comment = pseudo+": ce fut un honneur de jouer avec toi. Quel talent!";
			break;
		default:
			comment = "Alors je sais pas ce qui s'est passé "+pseudo+", mais j'ai rien compris!";
	}
	return comment;
}


/* Fonction WELCOME : affiche l'écran d'accueil et de démarrage du jeu */

const welcomePlayer = () => {

	newDiv = document.createElement('div');
	mainDiv = document.getElementById("main");
	mainDiv.appendChild(newDiv);

	newDiv.setAttribute("id","welcome");
	welcomeDiv = document.getElementById("welcome");
	
	newTitle = document.createElement('h1');
	welcomeDiv.appendChild(newTitle);
	newTitle.innerHTML = "Ultimate Speed Game<br>";

	newRules = document.createElement("p");
	welcomeDiv.appendChild(newRules);
	newRules.setAttribute("id","rules");
	newRules.innerHTML = "Des cases vont apparaître sur l'écran. Ton objectif est simple: tu dois cliquer sur le plus grand nombre possible de cases dans le temps imparti!";

	newSubtitle = document.createElement("h2");
	welcomeDiv.appendChild(newSubtitle);
	newSubtitle.setAttribute("id","launch");
	newSubtitle.innerHTML = "<br>Prêt.e à relever le défi?<br><br><br><br>";

	newLaunchButton = document.createElement('button');
	welcomeDiv.appendChild(newLaunchButton);
	newLaunchButton.setAttribute("class","game_button");
	newLaunchButton.setAttribute("onclick","invite(); readyToPlay();");
	newLaunchButton.setAttribute("style","display:inline;");
	newLaunchButton.innerHTML = "Démarrer";
}


/* Fonction "démarrage de jeu": fonction qui va lancer les différentes étapes nécessaires:
- efface l'écran d'accueil
- créé l'interface de jeu
- démarrer le compte à rebours
- démarrer le score
- démarrer le compteur de clics
*/

const readyToPlay = () => {

	points = 0;
	precision = 0;
	clicks = -2;
	let isStillThere = document.getElementById("game_over");

	if(isStillThere) {
		mainDiv.removeChild(gameOverDiv);
	} else {
		mainDiv.removeChild(welcomeDiv);
	}

	playingDiv = document.createElement('div');
	mainDiv.appendChild(playingDiv);
	playingDiv.setAttribute("id","playing");
	playingDiv.setAttribute("class","nonSelectionnable");

	scoreDiv = document.createElement("div");
	playingDiv.appendChild(scoreDiv);
	scoreDiv.setAttribute("id","score");
	scoreDiv.innerHTML = "Score: 0 pt";

	timingSpan = document.createElement("span");
	playingDiv.appendChild(timingSpan);
	timingSpan.setAttribute("id","timing");

	div_generation(); // on fait apparaître la première div
	timer(); // on démarre la fonction Compte à rebours

	mainDiv.style.backgroundColor = "#0D3B66";
	mainDiv.style.color = "#FFF";
	mainDiv.setAttribute("onclick","numberOfClicks()");

}


/* Fonction "fin de la partie": on arrête le compte à rebours, on fait disparaître l'interface de jeu, on affiche les résultats */


const gameOver = () => {

	div_elimination(); // on fait disparaître les div à cliquer
	mainDiv.removeChild(playingDiv);

	playSound("ride"); // on joue le son de fin de partie
	alert("Fini!"); // on affiche une alerte 'fin!'

	gameOverDiv = document.createElement('div');
	mainDiv.appendChild(gameOverDiv);
	gameOverDiv.setAttribute('id',"game_over");

	newTitle = document.createElement('h1');
	gameOverDiv.appendChild(newTitle);
	newTitle.innerHTML = "Ultimate Speed Game<br>";

	scoresDiv = document.createElement("scores");
	gameOverDiv.appendChild(scoresDiv);
	scoresDiv.setAttribute('id','scores');

	newLaunchButton = document.createElement('button');
	gameOverDiv.appendChild(newLaunchButton);
	newLaunchButton.classList.add("game_button");
	newLaunchButton.setAttribute("onclick","readyToPlay();");
	newLaunchButton.setAttribute("style","display:inline;");
	newLaunchButton.innerHTML = "Rejouer";

	scoresDiv.innerHTML = points+singular(points)+"<br>"+scoreComment(points)+"<br>Côté précision: "+precisionScore()+"%<br><br>"; // on fait apparaître le score final avec un commentaire

	hallOfFame = document.createElement('div');
	gameOverDiv.appendChild(hallOfFame);
	hallOfFame.setAttribute("id","hall_of_fame");

	secondTitle = document.createElement('h2');
	hallOfFame.appendChild(secondTitle);
	secondTitle.innerHTML = "<br>Best Players belong to the<br>Hall of Fame<br><br>";

	scoresTable = document.createElement("table");
	hallOfFame.appendChild(scoresTable);
	
	saveStats();
	showScores();
	
}

/* Fonction Texte qui gère le pluriel du mot "point" */
const singular = (points) => {
	if(points <=1) {
		text = " POINT";
	} else {
		text = " POINTS";
	}
	return text;
}


/* FONCTION "TIMER" : fonction qui affiche un compte à rebours. Lorsque le compteur arrive à 0, il s'arrête. */

const timer = () => {
	remainingTime = initialTime;
	gaming = setInterval(function() {
		let timingZone = document.getElementById("timing");
		let scoreZone = document.getElementById("score");
		if(remainingTime>=0) {
			timingZone.innerHTML = remainingTime/1000;	
			scoreZone.innerHTML = "Score: "+points+text;
		} else {
			clearInterval(gaming); //on arrête le compte à rebours
			mainDiv.removeAttribute("onclick"); // on arrête le compteur de clics
			//endOfTheGame();
			gameOver();
		}
		remainingTime -= 100;
	}, speed/10);
}

/* Fonction Clicked on Time : on gagne un point lorsqu'on clique dans les temps (avant la fin du chrono) sur une div, et un son est joué */

const clicked_on_time = () => {
	points +=1;
	playSound("crunch");
	remainingTime += 500;
	return points;
}


/* Création d'une classe d'objets "coordonnées aléatoires" */

class RandomCoordinates {
	constructor(width,height) {
		this.width = width;
		this.height = height; 
	}
	generateCoordinates(power) {
		this.width = Math.floor(Math.random()*power)+50;
		this.height = Math.floor(Math.random()*power)+50;
		return {width: this.width, height: this.height};
	}
}


/* Fonction qui génère une paire de coordonnées (width, height) aléatoires */

const randomPosition = (power) => {
	randomXY = new RandomCoordinates();
	randomXY.generateCoordinates(power);
	return randomXY;
}


/* Fonction qui génère une div de fond noir de taille aléatoire */

const div_generation = () => {
	randomCoordinates = randomPosition(300);
	randomPosit = randomPosition(1000);

	newCookie = document.createElement('div');
	parentZone = document.getElementById("main");
	parentZone.appendChild(newCookie);

	newCookie.setAttribute("id","test");
	newCookie.setAttribute("style",`width: ${randomCoordinates.width}px; height: ${randomCoordinates.width}px; top: ${randomPosit.width}px; left: ${randomPosit.height}px; `);
	newCookie.setAttribute("onclick",`div_elimination(); clicked_on_time(); div_generation();`);
}


/* Fonction qui supprime la dernière div créée */

const div_elimination = () => {
	divToKill = document.getElementById("test");
	if(divToKill==null) {
	} else {
		mainDiv.removeChild(divToKill);
	}
}


/* Fonction PlaySound, joue un son donné */


const playSound = (e) => {
    const audio = document.getElementById(e);
    if(!audio) return; // stop the function
    audio.currentTime = 0;
    audio.play();
  }


/* Fonction numberOfClicks : compte le nombre de clics sur la page de jeu en vue de donner un score de précision */

const numberOfClicks = () => {
	clicks ++;
	return clicks;
}


/* Fonction Precision : retourne la précision du joueur */

const precisionScore = () => {
	if(points==0) {
		precision = 0;
	} else {
		precision = roundToTwo((points/numberOfClicks())*100);
	}
	return precision;
}


/* Fonction "Arrondir à 2 décimales" - source: StackOverflow */

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}


/* Objet "newScore": objet qui contient le pseudo du joueur, son score et son degré de précision */

class Score {
	constructor(pseudo,score,precision) {
		this.pseudo = pseudo;
		this.score = score;
		this.precision = precision;
	}
}


/* Fonction saveStats qui va enregistrer les stats du joueur */

const saveStats = () => {
	gameStats = new Score();
	gameStats = {pseudo, points, precision};
	
	scores.push(gameStats);
	scores.sort(function(a, b){
		var x = a.points;
		var y = b.points;
		var xp = a.precision;
		var yp = b.precision;
		if (x < y) {
			return 1;
		}
		if (x > y) {
			return -1;
		}
		if (x == y) {
			if (xp < yp) {
				return 1;
			}
			if (xp > yp) {
				return -1;
			}
			return 0;
		}
		return 0;
		}
	);
	return scores;
}


/* Fonction showScores montre le top 10 des meilleurs scores */

const showScores = () => {
	let table = document.querySelector("table");
	let data = Object.keys(scores[0]);
	generateTableHead(table, data);
	generateTable(table, scores);

	for (let i of scores) {
		console.log(i+window.localStorage.getItem('score'));
		i++;
	}
}


function generateTableHead(table, data) {
	let thead = table.createTHead();
	let row = thead.insertRow();
	for (let key of data) {
		let th = document.createElement("th");
		let text = document.createTextNode(key);
		th.appendChild(text);
		row.appendChild(th);
	}
}

function generateTable(table, data) {
	for (let element of data) {
		let row = table.insertRow();
		for (key in element) {
			let cell = row.insertCell();
			let text = document.createTextNode(element[key]);
			cell.appendChild(text);
		}
	}
}









/* Gestion database - source : https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage 
trop complexe pour moi pour l'instant - gestion des éléments à sauvegarder etc.
a voir plus tard*/

/*
const databasing = () => {


const list = document.querySelector('table');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');


window.onload = function() {
	// Open our database; it is created if it doesn't already exist
	// (see onupgradeneeded below)
	let request = window.indexedDB.open('scores_db', 1);

	// onerror handler signifies that the database didn't open successfully
	request.onerror = function() {
		console.log('Database failed to open');
	};

	// onsuccess handler signifies that the database opened successfully
	request.onsuccess = function() {
		console.log('Database opened successfully');
		// Store the opened database object in the db variable. This is used a lot below
		db = request.result;
		// Run the displayData() function to display the notes already in the IDB
		displayData();
	};

	// Setup the database tables if this has not already been done
	request.onupgradeneeded = function(e) {

		// Grab a reference to the opened database
		let db = e.target.result;
		
		// Create an objectStore to store our notes in (basically like a single table)
		// including a auto-incrementing key
		let objectStore = db.createObjectStore('scores_os', { keyPath: 'id', autoIncrement:true });

		// Define what data items the objectStore will contain
		objectStore.createIndex('pseudo', 'pseudo', { unique: false });
		objectStore.createIndex('score', 'score', { unique: false });
		objectStore.createIndex('precision', 'precision', { unique: false });
		console.log('Database setup complete');
	};

	// Create an onsubmit handler so that when the form is submitted the addData() function is run
	//form.onsubmit = addData;


	// Define the addData() function
	function addData(e) {
		// prevent default - we don't want the form to submit in the conventional way
		e.preventDefault();
	
		// grab the values entered into the form fields and store them in an object ready for being inserted into the DB
		let newItem = { pseudo: pseudo, score: points, precision: precision };
	
		// open a read/write db transaction, ready for adding the data
		let transaction = db.transaction(['scores_os'], 'readwrite');
	
		// call an object store that's already been added to the database
		let objectStore = transaction.objectStore('scores_os');
	
		// Make a request to add our newItem object to the object store
		let request = objectStore.add(newItem);
		request.onsuccess = function() {
			// Clear the form, ready for adding the next entry
			//titleInput.value = '';
			//bodyInput.value = '';
		};

		// Report on the success of the transaction completing, when everything is done
		transaction.oncomplete = function() {
			console.log('Transaction completed: database modification finished.');
			// update the display of data to show the newly added item, by running displayData() again.
			displayData();
		};

		transaction.onerror = function() {
			console.log('Transaction not opened due to error');
		};
	}


	//Define the displayData() function
	function displayData() {

		// Here we empty the contents of the list element each time the display is updated
		// If you didn't do this, you'd get duplicates listed each time a new note is added
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
		
		// Open our object store and then get a cursor - which iterates through all the
		// different data items in the store
		let objectStore = db.transaction('scores_os').objectStore('scores_os');
		objectStore.openCursor().onsuccess = function(e) {
			// Get a reference to the cursor
			let cursor = e.target.result;
		
			// If there is still another data item to iterate through, keep running this code
			if(cursor) {
				// Create a list item, h3, and p to put each data item inside when displaying it
				// structure the HTML fragment, and append it inside the list
				const listItem = document.createElement('li');
				const h3 = document.createElement('h3');
				const para = document.createElement('p');

				listItem.appendChild(h3);
				listItem.appendChild(para);
				list.appendChild(listItem);
				
				// Put the data from the cursor inside the h3 and para
				h3.textContent = cursor.value.pseudo;
				para.textContent = cursor.value.points;
				para.textContent = cursor.value.precision;
			
				// Store the ID of the data item inside an attribute on the listItem, so we know
				// which item it corresponds to. This will be useful later when we want to delete items
				listItem.setAttribute('data-score-id', cursor.value.id);
			
				// Create a button and place it inside each listItem
				const deleteBtn = document.createElement('button');
				listItem.appendChild(deleteBtn);
				deleteBtn.textContent = 'Delete';
				
				// Set an event handler so that when the button is clicked, the deleteItem()
				// function is run
				deleteBtn.onclick = deleteItem;

				// Iterate to the next item in the cursor
				cursor.continue();
			} else {
				// Again, if list item is empty, display a 'No notes stored' message
				if(!list.firstChild) {
					const listItem = document.createElement('li');
					listItem.textContent = 'No scores stored.';
					list.appendChild(listItem);
				}
				// if there are no more cursor items to iterate through, say so
				console.log('Scores all displayed');
			}
		};
	}

};


addData();
}

*/
