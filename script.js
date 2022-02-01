document.addEventListener('DOMContentLoaded', () => {
	getChampions('all');

	const sortsection = document.getElementById('availability');
	sortsection.addEventListener('change', () => {
		document.getElementById('champions').innerHTML = '';
		if (sortsection.value === 'available') {
			freefetch();
		}
		else {
			getChampions('all');
		}
	})
});

function freefetch() {
	fetch('http://localhost:3000/freeChampionIds')
	.then((r) => r.json())
	.then((object) => {
		getChampions('available', object[0].key);
	})
}

function getChampions(onPage, list = []) {
	fetch('http://ddragon.leagueoflegends.com/cdn/12.2.1/data/en_US/champion.json')
	.then((r) => r.json())
	.then((object) => {
		for (champion in object.data) {
			if (onPage === 'all') {
				addChampion(object.data[champion]);
			}
			else if (onPage === 'available') {
				if (list.indexOf(parseInt(object.data[champion].key)) !== -1) {
					addChampion(object.data[champion]);
				}
			}
		}
	})
}

function addChampion(champion) {
	const Ccard = document.createElement('div');
	const Cfigure = document.createElement('figure');
	const Cimg = document.createElement('img');
	const caption = document.createElement('figcaption');

	Ccard.setAttribute('id', champion.key);
	//Cimg.setAttribute('src', `./images/${champion.id}.jpeg`);
	Cimg.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`)
	Cimg.setAttribute('alt', champion.name);
	Cimg.setAttribute('title', champion.name);
	caption.textContent = champion.name;

	Cfigure.appendChild(Cimg);
	Cfigure.appendChild(caption);
	Ccard.appendChild(Cfigure);
	document.getElementById('champions').appendChild(Ccard);
}