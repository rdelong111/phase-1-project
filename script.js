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
	})
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
  const Mcontent = document.createElement('p');

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
  modalContent.setAttribute('class', 'modal-content');
  Mcontent.textContent = champion.name;

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
  modalContent.appendChild(Mcontent);
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
  	theModal.style.display = 'block';
  });

  window.addEventListener('click', (e) => {
  	if (e.target === theModal) {
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