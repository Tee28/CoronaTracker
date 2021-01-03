getVirusCountry(266);
getVirusWorld();

const selectElement = document.getElementById("sel_nation");
selectElement.addEventListener('change', (e) => {
  getVirusCountry(e.target.value);
});

function getVirusCountry(id) {
	fetch('https://coronavirus-tracker-api.herokuapp.com/v2/locations/'+id)
	.then(res => res.json())
	.then(data => {

		const tr         = (data.location.province != '')? " - " : '';
		const province   = data.location.country + tr + data.location.province;

		//const idNation   = data.location.id;
		const codeNation = data.location.country_code;
		const nationName = data.location.country;
		const population = data.location.country_population;

		const confirmed  = data.location.latest.confirmed;
		const deaths     = data.location.latest.deaths;
		const recovered  = data.location.latest.recovered;
 
		const lastUpdate = data.location.last_updated;
		const percent    = (deaths/confirmed*100).toFixed(2);

		document.getElementById("title").innerHTML      = province;

		//document.getElementById("id").innerHTML         = idNation;
		document.getElementById("code").innerHTML       = codeNation;
		document.getElementById("nation").innerHTML     = nationName;
		document.getElementById("population").innerHTML = new Intl.NumberFormat().format(population);

		document.getElementById("confirmed").innerHTML  = new Intl.NumberFormat().format(confirmed);
		document.getElementById("deaths").innerHTML     = new Intl.NumberFormat().format(deaths);
		document.getElementById("recovered").innerHTML  = new Intl.NumberFormat().format(recovered);

		document.getElementById("update").innerHTML     = lastUpdate.substring(0,10);
		document.getElementById("percent").innerHTML    = percent + "%";
	});	
}

function getVirusWorld(){
	fetch('https://coronavirus-tracker-api.herokuapp.com/v2/locations')
		.then(res => res.json())
		.then(data => {
			let nation;
			const html = data.locations.map(virus => {

				const idNation 	 = virus.id;
				const codeNation = virus.country_code;

				const nationName = virus.country;
				const province   = virus.province;
				const population = virus.country_population;

				const confirmed  = virus.latest.confirmed;
				const deaths     = virus.latest.deaths;
				const recovered  = virus.latest.recovered;
		 
				const lastUpdate = virus.last_updated;
				const percent    = (deaths/confirmed*100).toFixed(2);

				nation += returnText(idNation, nationName, province);

				return `
					 <ul class="list_world">
					  	<li>
					  		<p>Mã quốc gia: ${codeNation}</p>
					  		<p style="color: red">Quốc gia: ${nationName}</p>
					  		<p style="color: blue">${province}</p>
					  		<p>Dân số: ${new Intl.NumberFormat().format(population)}</p>
					  		<p>Cập nhật: ${lastUpdate.substring(0,10)}</p>
					  		<p>Ca nhiễm: ${new Intl.NumberFormat().format(confirmed)}</p>
					  		<p>Tử vong: ${new Intl.NumberFormat().format(deaths)}</p>
					  		<p>Phục hồi: ${new Intl.NumberFormat().format(recovered)}</p>
					  		<p>Phần trăm: ${percent}%</p>
					  	</li>
					  </ul>
				`
			
			}).join('');

			document.getElementById("list").insertAdjacentHTML("afterbegin", html);
			document.getElementById("sel_nation").insertAdjacentHTML("afterbegin", nation);

			document.getElementById("total_confirmed").innerHTML = 
				new Intl.NumberFormat().format(data.latest.confirmed).toString()+" ca nhiễm";
			document.getElementById("total_deaths").innerHTML = 
				new Intl.NumberFormat().format(data.latest.deaths).toString()+" ca tử vong";;
			document.getElementById("total_recovered").innerHTML = 
				new Intl.NumberFormat().format(data.latest.recovered).toString()+" ca hồi phục";;
		});

}

//return block HTML with tags <option>
function returnText(idNation, nameNation, province) {
	const tr = (province != '')? " - " : '';
	const selected = (idNation == 266)? "selected='selected'" : '';
	return `<option value='${idNation}' ${selected}>${nameNation} ${tr} ${province}</option>`
}