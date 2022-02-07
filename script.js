document.addEventListener('DOMContentLoaded', () => {
	const sortingSec = document.getElementById('sortingchamps');
	const sortAvail = document.getElementById('availability');
	const sortType = document.getElementById('champtype');
	const viewChampBtn = document.getElementById('viewchamps');
	const champList = document.getElementById('champions');

	fetch('http://localhost:3000/favoriteChampion')
	.then(r => r.json())
	.then(fav => {
		champList.style.backgroundImage = `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${fav[0].pictureID}_0.jpg)`
	});

  // Initially put all of the champion cards in the container
  getChampions('all');

  // Changes what cards are in the container when the availability drop-down box (1st drop-down) is changed
  sortAvail.addEventListener('change', () => {
    champList.innerHTML = '';
    if (sortAvail.value === 'free' || sortAvail.value === 'available') {
      freefetch(sortAvail.value);
    }
    else {
      getChampions(sortAvail.value);
    }
  });

  // Changes what cards are in the container when the type drop-down box (2nd drop-down) is changed
  sortType.addEventListener('change', () => {
  	champList.innerHTML = '';
  	if (sortAvail.value === 'free' || sortAvail.value === 'available') {
      freefetch(sortAvail.value);
    }
    else {
      getChampions(sortAvail.value);
    }
  });

  // The Hide/View button either hides or shows the champion container
  viewChampBtn.addEventListener('click', () => {
  	if (viewChampBtn.textContent === 'View Champions') {
  		champList.style.display = 'flex';
  		viewChampBtn.textContent = 'Hide Champions';
  	}
  	else {
  		champList.style.display = 'none';
  		viewChampBtn.textContent = 'View Champions';
  	}
  });
});

// If the free champions are included in the sorting options, then this function is called
function freefetch(onPage) {
  fetch('http://localhost:3000/freeChampionIds')
  .then(r => r.json())
  .then(object => {
    getChampions(onPage, object.key);
  })
}

// Every time the sorting boxes are changed, this function is called to get all of the champions and their data
function getChampions(onPage, list = []) {
  fetch('http://ddragon.leagueoflegends.com/cdn/12.2.1/data/en_US/champion.json')
  .then(r => r.json())
  .then(object => {
  	document.getElementById('totalamt').textContent = Object.keys(object.data).length;
  	checkIfOwned(object.data, onPage, list);
  })
}

// After the getChampions function is called, this function will get the most updated list of owned champions and will push the champions based on the selected availability box option
function checkIfOwned(champs, onPage, list) {
	fetch('http://localhost:3000/owned')
	.then(r => r.json())
	.then(theOwned => {
		let ownedList = [];
		for (odChamp of theOwned) {
			ownedList.push(odChamp.id);
		}
		document.getElementById('amt').textContent = '0';
		for (champ in champs) {
			if (onPage === 'all') {
				checkChampType(champs[champ], ownedList.includes(champs[champ].key));
			}
			else if (onPage === 'free') {
				if (list.indexOf(parseInt(champs[champ].key)) !== -1) {
					checkChampType(champs[champ], ownedList.includes(champs[champ].key));
				}
			}
			else if (onPage === 'owned') {
				if (ownedList.includes(champs[champ].key)) {
					checkChampType(champs[champ], true);
				}
			}
			else if (onPage === 'NOTowned') {
				if (!(ownedList.includes(champs[champ].key))) {
					checkChampType(champs[champ], false);
				}
			}
			else {
				if (list.indexOf(parseInt(champs[champ].key)) !== -1 || ownedList.includes(champs[champ].key)) {
					checkChampType(champs[champ], ownedList.includes(champs[champ].key));
				}
			}
		}
	})
}

// This function is called after checkIfOwned pushes filtered champions. This function filters those champions based on the TYPE box selection.
function checkChampType(champion, isOwned) {
	const selectedType = document.getElementById('champtype').value;
	if (champion.tags.includes(selectedType) || selectedType === 'all') {
		addChampion(champion, isOwned);
		const currentAmt = parseInt(document.getElementById('amt').textContent) + 1;
		document.getElementById('amt').textContent = `${currentAmt}`;
	}
}

// This function creates a champion card for the container
function addChampion(champion, isOwned) {
  const champsection = document.getElementById('champions');
  const Ccard = document.createElement('div');
  const Cfigure = document.createElement('figure');
  const Cimg = document.createElement('img');
  const Namecaption = document.createElement('figcaption');
  const biocontainer = document.createElement('article');
  const Ctitle = document.createElement('h1');
  const Cblurb = document.createElement('p');
  const Cbtns = document.createElement('section');
  const ownBtn = document.createElement('button');
  const favBtn = document.createElement('button');
  const MorLlore = document.createElement('a');
  const theModal = document.createElement('section');
  const modalContent = document.createElement('div');

  Ccard.setAttribute('id', champion.key);
  Ccard.setAttribute('class', 'card');
  Cimg.setAttribute('class', 'champpic');
  Cimg.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`);
  Cimg.setAttribute('alt', champion.name);
  Cimg.setAttribute('title', champion.name);
  Namecaption.textContent = champion.name;
  Ctitle.textContent = champion.title;
  Cblurb.textContent = champion.blurb;
  Cbtns.setAttribute('class', 'champbtns');
  // This if/else will set the OWN button and disable it if champion is owned
  if (isOwned) {
  	ownBtn.textContent = 'OWNED';
  	ownBtn.disabled = true;
  }
  else {
  	ownBtn.textContent = 'OWN';
  }
  favBtn.textContent = 'Set Favorite';
  MorLlore.setAttribute('href', '#');
  MorLlore.setAttribute('class', 'MorLlore');
  MorLlore.textContent = 'View More';
  theModal.setAttribute('class', 'modal');
  modalContent.style.backgroundImage = `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg)`
  modalContent.setAttribute('class', 'modal-content');

  Cfigure.appendChild(Cimg);
  Cfigure.appendChild(Namecaption);
  Ccard.appendChild(Cfigure);
  biocontainer.appendChild(Ctitle);
  Cblurb.appendChild(MorLlore);
  biocontainer.appendChild(Cblurb);
  Ccard.appendChild(biocontainer);
  Cbtns.appendChild(ownBtn);
  Cbtns.appendChild(favBtn);
  Ccard.appendChild(Cbtns);
  champsection.appendChild(Ccard);
  theModal.appendChild(modalContent);
  Ccard.appendChild(theModal);

  // The View More/Less button will show more or less lore when clicked
  MorLlore.addEventListener('click', () => {
  	if (MorLlore.textContent === 'View More') {
  		MorLlore.textContent = 'View Less';
  		changeLore(Cblurb, champion.id, MorLlore);
  		Cblurb.style.fontSize = '12px';
  	}
  	else {
  		MorLlore.textContent = 'View More';
  		Cblurb.textContent = champion.blurb;
  		Cblurb.style.fontSize = '16px';
  		Cblurb.appendChild(MorLlore);
  	}
  });

  // If the OWN button is clicked, the button will be disabled and the champion ID and name will be POSTed to data.json
  ownBtn.addEventListener('click', () => {
    ownBtn.disabled = true;
    ownBtn.textContent = 'OWNED';
    postToOwned(champion);
    // If "Not-Owned Champions" is the current selection. The card will be removed from the page
    if (document.getElementById('availability').value === 'NOTowned') {
    	Ccard.remove();
    	const currentAmt = parseInt(document.getElementById('amt').textContent) - 1;
			document.getElementById('amt').textContent = `${currentAmt}`;
    }
  });

  // When the Set Favorite button is clicked, the background in the champion container is set to the favorited champion.  The favoriteChampion is PATCHed in data.json
  favBtn.addEventListener('click', () => {
  	champsection.style.backgroundImage = `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg)`;
  	patchtheFavChamp(champion);
  });

  // When the champion image is clicked, a pop-up with more champion info is shown
  Cimg.addEventListener('click', () => {
  	getSpecificChampInfo(modalContent, champion);
  	theModal.style.display = 'block';
  });

  // Clicking outside the pop-up will close the pop-up
  window.addEventListener('click', (e) => {
  	if (e.target === theModal) {
  		modalContent.innerHTML = '';
  		theModal.style.display = 'none';
  	}
  })
}

// Gets more champion lore when the View More button is clicked
function changeLore(blurb, ID, btn) {
	fetch(`http://ddragon.leagueoflegends.com/cdn/12.3.1/data/en_US/champion/${ID}.json`)
	.then(r => r.json())
	.then(champData => {
		blurb.textContent = champData.data[ID].lore;
		blurb.appendChild(btn);
	})
}

// POST for data.json owned champions
function postToOwned(champ) {
  fetch('http://localhost:3000/owned', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: champ.key,
      name: champ.name
    })
  })
}

// PATCH for data.json favoriteChampion
function patchtheFavChamp(champ) {
	fetch('http://localhost:3000/favoriteChampion/1', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pictureID: champ.id
    })
  })
}

// GETs more specific champion info for ONE specific champion
function getSpecificChampInfo(content, champ) {
	fetch(`http://ddragon.leagueoflegends.com/cdn/12.3.1/data/en_US/champion/${champ.id}.json`)
	.then(r => r.json())
	.then(champData => {
		createPopUp(content, champData.data[champ.id]);
	})
}

// Creates content for the champion pop-up
function createPopUp(content, data) {
	const contentC1 = document.createElement('div');
	const contentC2 = document.createElement('div');
	const contentC3 = document.createElement('div');

	createC1(contentC1, data);
	createC2(contentC2, data);
	createC3(contentC3, data);

	content.appendChild(contentC1);
	content.appendChild(contentC2);
	content.appendChild(contentC3);
}

// Column 1 of the pop-up shows champion statistics
function createC1(content, data) {
	const Ctable = document.createElement('table');
	const tableCap = document.createElement('caption');
	const tHead = document.createElement('thead');
	const tBody = document.createElement('tbody');
	const statHeadR = document.createElement('tr');
	const statHeadName = document.createElement('th');
	const statHeadVal = document.createElement('th');

	tableCap.textContent = `${data.partype} --- `;
	for (let i = 0; i < data.tags.length; i++) {
		if (i === 0) {
			tableCap.textContent = `${tableCap.textContent}${data.tags[i]}`;
		}
		else {
			tableCap.textContent = `${tableCap.textContent}, ${data.tags[i]}`;
		}
	}
	statHeadName.textContent = 'Stat Name';
	statHeadVal.textContent = 'Stat Value';

	statHeadR.appendChild(statHeadName);
	statHeadR.appendChild(statHeadVal);
	tHead.appendChild(statHeadR);
	Ctable.appendChild(tableCap);
	Ctable.appendChild(tHead);
	Ctable.appendChild(tBody);
	content.appendChild(Ctable);

	for (stat in data.stats) {
		createTableRowC1(data.stats[stat], stat, tBody);
	}
}

// Creates a stat row for the table body in pop-up column 1
function createTableRowC1(stat, statName, body) {
	const row = document.createElement('tr');
	const data1 = document.createElement('td');
	const data2 = document.createElement('td');

	data1.textContent = statName;
	data2.textContent = stat;

	row.appendChild(data1);
	row.appendChild(data2);
	body.appendChild(row);
}

// Column 2 of the pop-up shows the champion passive and spells
function createC2(content, data) {
	const Ctable = document.createElement('table');
	const tableCap = document.createElement('caption');
	const tHead = document.createElement('thead');
	const tBody = document.createElement('tbody');
	const spellHeadRow = document.createElement('tr');
	const spellHeadPas = document.createElement('th');
	const spellHeadQ = document.createElement('th');
	const spellHeadW = document.createElement('th');
	const spellHeadE = document.createElement('th');
	const spellHeadR = document.createElement('th');
	const spellBodRow = document.createElement('tr');
	const spellBodPas = document.createElement('td');
	const imgP = document.createElement('img');

	tableCap.textContent = `${data.name} spells`;
	spellHeadPas.textContent = 'Passive';
	spellHeadQ.textContent = 'Q';
	spellHeadW.textContent = 'W';
	spellHeadE.textContent = 'E';
	spellHeadR.textContent = 'R';
	spellBodPas.innerHTML = `${data.passive.name}<br>`;
	imgP.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/12.3.1/img/passive/${data.passive.image.full}`);
	imgP.setAttribute('class', 'spellImg');

	spellHeadRow.appendChild(spellHeadPas);
	spellHeadRow.appendChild(spellHeadQ);
	spellHeadRow.appendChild(spellHeadW);
	spellHeadRow.appendChild(spellHeadE);
	spellHeadRow.appendChild(spellHeadR);
	tHead.appendChild(spellHeadRow);
	spellBodPas.appendChild(imgP);
	spellBodRow.appendChild(spellBodPas);
	for (spell of data.spells) {
		createTableColC2(spell, spellBodRow);
	}
	tBody.appendChild(spellBodRow);
	Ctable.appendChild(tableCap);
	Ctable.appendChild(tHead);
	Ctable.appendChild(tBody);
	content.appendChild(Ctable);

	imgP.addEventListener('click', () => {
		alert(data.passive.description);
	});
}

// Creates a spell column for pop-up column 2 table
function createTableColC2(spell, body) {
	const col = document.createElement('td');
	const img = document.createElement('img');
	col.innerHTML = `${spell.name}<br>`;
	img.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/12.3.1/img/spell/${spell.image.full}`);
	img.setAttribute('class', 'spellImg');
	col.appendChild(img);
	body.appendChild(col);

	img.addEventListener('click', () => {
		alert(spell.description);
	});
}

// Column 3 of the pop-up shows tips for playing with/against the selected champion
function createC3(content, data) {
	const Ctable = document.createElement('table');
	const tableCap = document.createElement('caption');
	const tHead = document.createElement('thead');
	const tBody = document.createElement('tbody');
	const tipHeadRow = document.createElement('tr');
	const allyCol = document.createElement('th');
	const enemyCol = document.createElement('th');
	const maxLenTipAmt = Math.max(data.allytips.length, data.enemytips.length);

	for (let i = 0; i < maxLenTipAmt; i++) {
		createTableRowC3(data, tBody, i);
	}

	tableCap.textContent = `${data.name} tips`;
	allyCol.textContent = 'Ally Tips';
	enemyCol.textContent = 'Enemy Tips';

	tipHeadRow.appendChild(allyCol);
	tipHeadRow.appendChild(enemyCol);
	tHead.appendChild(tipHeadRow);
	Ctable.appendChild(tableCap);
	Ctable.appendChild(tHead);
	Ctable.appendChild(tBody);
	content.appendChild(Ctable);
}

// Creates a row for the tips table. It leaves a spot blank if there are no tips for the current counter
function createTableRowC3(data, body, counter) {
	const row = document.createElement('tr');
	const ally = document.createElement('td');
	const enemy = document.createElement('td');

	if (counter >= data.allytips.length) {
		ally.textContent = '';
	}
	else {
		ally.textContent = data.allytips[counter];
	}

	if (counter >= data.enemytips.length) {
		enemy.textContent = '';
	}
	else {
		enemy.textContent = data.enemytips[counter];
	}

	row.appendChild(ally);
	row.appendChild(enemy);
	body.appendChild(row);
}