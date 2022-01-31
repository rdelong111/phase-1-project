document.addEventListener('DOMContentLoaded', () => {
	getChampions();
	//freefetch();
});

function freefetch() {
	fetch('https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-d9e58d6c-e59b-4d75-97dd-dfc12a01226f')
	.then((r) => r.json())
	.then((object) => {
		getChampions(1, object.freeChampionIds);
	})
}

function getChampions(onPage = 0, list = []) {
	fetch('http://ddragon.leagueoflegends.com/cdn/12.2.1/data/en_US/champion.json')
	.then((r) => r.json())
	.then((object) => {
		for (champion in object.data) {
			if (onPage === 0) {
				addChampion(object.data[champion]);
			}
			else if (onPage === 1) {
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
	console.log(champion)

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