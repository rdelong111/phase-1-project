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
		console.log(object.data['Aatrox'])
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
	const champsection = document.getElementById('champions');
	const Ccard = document.createElement('div');
	const Cfigure = document.createElement('figure');
	const Cimg = document.createElement('img');
	const Namecaption = document.createElement('figcaption');
	const biocontainer = document.createElement('article');
	const Ctitle = document.createElement('h1');
	const Cblurb = document.createElement('p');

	Ccard.setAttribute('id', champion.key);
	Ccard.setAttribute('class', 'card');
	Cimg.setAttribute('class', 'champpic');
	Cimg.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`);
	Cimg.setAttribute('alt', champion.name);
	Cimg.setAttribute('title', champion.name);
	Namecaption.textContent = champion.name;
	Ctitle.textContent = champion.title;
	Cblurb.textContent = champion.blurb;

	Cfigure.appendChild(Cimg);
	Cfigure.appendChild(Namecaption);
	Ccard.appendChild(Cfigure);
	biocontainer.appendChild(Ctitle);
	biocontainer.appendChild(Cblurb);
	Ccard.appendChild(biocontainer);
	champsection.appendChild(Ccard);
}