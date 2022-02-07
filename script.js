document.addEventListener('DOMContentLoaded', () => {
	// test github is working
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

  getChampions('all');

  sortAvail.addEventListener('change', () => {
    champList.innerHTML = '';
    if (sortAvail.value === 'free' || sortAvail.value === 'available') {
      freefetch(sortAvail.value);
    }
    else {
      getChampions(sortAvail.value);
    }
  });

  sortType.addEventListener('change', () => {
  	champList.innerHTML = '';
  	if (sortAvail.value === 'free' || sortAvail.value === 'available') {
      freefetch(sortAvail.value);
    }
    else {
      getChampions(sortAvail.value);
    }
  });

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

function freefetch(onPage) {
  fetch('http://localhost:3000/freeChampionIds')
  .then(r => r.json())
  .then(object => {
    getChampions(onPage, object.key);
  })
}

function getChampions(onPage, list = []) {
  fetch('http://ddragon.leagueoflegends.com/cdn/12.2.1/data/en_US/champion.json')
  .then(r => r.json())
  .then(object => {
  	document.getElementById('totalamt').textContent = Object.keys(object.data).length;
  	checkIfOwned(object.data, onPage, list);
  })
}

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

function checkChampType(champion, isOwned) {
	const selectedType = document.getElementById('champtype').value;
	if (champion.tags.includes(selectedType) || selectedType === 'all') {
		addChampion(champion, isOwned);
		const currentAmt = parseInt(document.getElementById('amt').textContent) + 1;
		document.getElementById('amt').textContent = `${currentAmt}`;
	}
}

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
  const linktoLoL = document.createElement('a');
  const linkText = document.createElement('span');
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
  if (isOwned) {
  	ownBtn.textContent = 'OWNED';
  	ownBtn.disabled = true;
  }
  else {
  	ownBtn.textContent = 'OWN';
  }
  favBtn.textContent = 'Set Favorite';
  linktoLoL.setAttribute('href', `https://www.leagueoflegends.com/en-us/champions/${linkReadyText(champion.name)}/`);
  linkText.textContent = 'View More';
  linkText.setAttribute('class', 'linktext');
  theModal.setAttribute('class', 'modal');
  modalContent.style.backgroundImage = `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg)`
  modalContent.setAttribute('class', 'modal-content');

  Cfigure.appendChild(Cimg);
  Cfigure.appendChild(Namecaption);
  Ccard.appendChild(Cfigure);
  biocontainer.appendChild(Ctitle);
  linktoLoL.appendChild(linkText);
  Cblurb.appendChild(linktoLoL);
  biocontainer.appendChild(Cblurb);
  Ccard.appendChild(biocontainer);
  Cbtns.appendChild(ownBtn);
  Cbtns.appendChild(favBtn);
  Ccard.appendChild(Cbtns);
  champsection.appendChild(Ccard);
  theModal.appendChild(modalContent);
  Ccard.appendChild(theModal);

  ownBtn.addEventListener('click', () => {
    ownBtn.disabled = true;
    ownBtn.textContent = 'OWNED';
    postToOwned(champion);
    if (document.getElementById('availability').value === 'NOTowned') {
    	Ccard.remove();
    	const currentAmt = parseInt(document.getElementById('amt').textContent) - 1;
			document.getElementById('amt').textContent = `${currentAmt}`;
    }
  });

  favBtn.addEventListener('click', () => {
  	champsection.style.backgroundImage = `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg)`;
  	patchtheFavChamp(champion);
  });

  Cimg.addEventListener('click', () => {
  	getSpecificChampInfo(modalContent, champion);
  	theModal.style.display = 'block';
  });

  window.addEventListener('click', (e) => {
  	if (e.target === theModal) {
  		modalContent.innerHTML = '';
  		theModal.style.display = 'none';
  	}
  })
}

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

function linkReadyText(word) {
	if (word === 'Nunu & Willump') {
		return 'nunu';
	}
	let copy = word.replace(/'/g, ' ');
	copy = copy.toLowerCase();
	copy = copy.replace(/ /g, '-')
	return copy;
}

function getSpecificChampInfo(content, champ) {
	fetch(`http://ddragon.leagueoflegends.com/cdn/12.3.1/data/en_US/champion/${champ.id}.json`)
	.then(r => r.json())
	.then(champData => {
		console.log(champData.data[champ.id])
		createPopUp(content, champData.data[champ.id]);
	})
}

function createPopUp(content, data) {
	const contentR1 = document.createElement('div');
	const contentR2 = document.createElement('div');
	const contentR3 = document.createElement('div');

	createR1(contentR1, data);
	createR2(contentR2, data);
	createR3(contentR3, data);

	content.appendChild(contentR1);
	content.appendChild(contentR2);
	content.appendChild(contentR3);
}

function createR1(content, data) {
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
		createTableRowR1(data.stats[stat], stat, tBody);
	}
}

function createTableRowR1(stat, statName, body) {
	const row = document.createElement('tr');
	const data1 = document.createElement('td');
	const data2 = document.createElement('td');

	data1.textContent = statName;
	data2.textContent = stat;

	row.appendChild(data1);
	row.appendChild(data2);
	body.appendChild(row);
}

function createR2(content, data) {
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
		createTableColR2(spell, spellBodRow);
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

function createTableColR2(spell, body) {
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

function createR3(content, data) {
	const Ctable = document.createElement('table');
	const tableCap = document.createElement('caption');
	const tHead = document.createElement('thead');
	const tBody = document.createElement('tbody');
	const tipHeadRow = document.createElement('tr');
	const allyCol = document.createElement('th');
	const enemyCol = document.createElement('th');
	const maxLenTipAmt = Math.max(data.allytips.length, data.enemytips.length);

	for (let i = 0; i < maxLenTipAmt; i++) {
		createTableRowR3(data, tBody, i);
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

function createTableRowR3(data, body, counter) {
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