document.addEventListener('DOMContentLoaded', () => {
  getChampions('all');

  const sortsection = document.getElementById('availability');
  sortsection.addEventListener('change', () => {
    document.getElementById('champions').innerHTML = '';
    if (sortsection.value === 'free') {
      freefetch();
    }
    else {
      getChampions(sortsection.value);
    }
  })
});

function freefetch() {
  fetch('http://localhost:3000/freeChampionIds')
  .then(r => r.json())
  .then(object => {
    getChampions('free', object.key);
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
		for (champ in champs) {
			if (onPage === 'all') {
				addChampion(champs[champ], ownedList.includes(champs[champ].key));
			}
			else if (onPage === 'free') {
				if (list.indexOf(parseInt(champs[champ].key)) !== -1) {
					addChampion(champs[champ], ownedList.includes(champs[champ].key));
				}
			}
			else if (onPage === 'owned') {
				if (ownedList.includes(champs[champ].key)) {
					addChampion(champs[champ], true);
				}
			}
			else if (onPage === 'NOTowned') {
				if (!(ownedList.includes(champs[champ].key))) {
					addChampion(champs[champ], false);
				}
			}
		}
	})
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
  const ownBtn = document.createElement('button');

  Ccard.setAttribute('id', champion.key);
  Ccard.setAttribute('class', 'card');
  Cimg.setAttribute('class', 'champpic');
  Cimg.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`);
  Cimg.setAttribute('alt', champion.name);
  Cimg.setAttribute('title', champion.name);
  Namecaption.textContent = champion.name;
  Ctitle.textContent = champion.title;
  Cblurb.textContent = champion.blurb;
  ownBtn.setAttribute('id', champion.name);
  if (isOwned) {
  	ownBtn.textContent = 'OWNED';
  	ownBtn.disabled = true;
  }
  else {
  	ownBtn.textContent = 'OWN';
  }

  Cfigure.appendChild(Cimg);
  Cfigure.appendChild(Namecaption);
  Ccard.appendChild(Cfigure);
  biocontainer.appendChild(Ctitle);
  biocontainer.appendChild(Cblurb);
  Ccard.appendChild(biocontainer);
  Ccard.appendChild(ownBtn);
  champsection.appendChild(Ccard);

  ownBtn.addEventListener('click', () => {
    ownBtn.disabled = true;
    ownBtn.textContent = 'OWNED';
    postToOwned(champion);
  });
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