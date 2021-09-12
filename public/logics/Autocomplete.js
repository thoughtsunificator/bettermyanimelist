(function() {
		var CACHE = [];
		Autocomplete.TYPES = {
				ANIME: {
						TV: 1,
						OVA: 2,
						Movie: 3,
						Special: 4,
						ONA: 5,
						Music: 6
				},
				MANGA: {
						Manga: 1,
						Novel: 2,
						'One Shot': 3,
						Doujin: 4,
						Manhwa: 5,
						Manhua: 6,
						OEL: 7
				},
				CONTENT: {
						0: 'all',
						1: 'anime',
						2: 'manga',
						3: 'characters',
						4: 'people',
						5: 'fansub groups',
						6: 'clubs',
						7: 'users'
				}
		};

		function processData(autocomplete, data) {
				if (data.length > 1) {
						for (let entryData of data) {
								let entry = document.createElement("div");
								entry.className = "entry";
								let entry_a = document.createElement("a");
								entry_a.href = entryData.url;
								entry.appendChild(entry_a);
								entry_a_img = document.createElement("img");
								entry_a_img.src = entryData.image;
								entry_a_img.className = "thumbnail";
								entry_a.appendChild(entry_a_img);
								let entry_aa = document.createElement("a");
								entry_aa.href = entryData.url;
								entry_aa.className = "title";
								entry_aa.textContent = entryData.title;
								entry.appendChild(entry_aa);
								let entry_small = document.createElement("small");
								entry_small.className = "status";
								entry_small.textContent = entryData.status;
								entry.appendChild(entry_small);
								let isLogged = document.querySelector(".header-profile-link") !== null;
								if (entryData.isAdded || isLogged) {
										let entry_aaa = document.createElement("a");
										entry_aaa.href = entryData.action_url;
										if (entryData.isAdded) {
												entry_aaa.className = "Lightbox_AddEdit button_edit";
												entry_aaa.textContent = "edit";
										} else if (isLogged) {
												entry_aaa.className = "Lightbox_AddEdit button_add";
												entry_aaa.textContent = "add";
										}
										entry.appendChild(entry_aaa);
								}
								let entry_div = document.createElement("div");
								entry_div.className = "information";
								entry_div.innerHTML = 'Type: <a href="#">' + entryData.type + '</a> | ' + entryData.pieces_name + ': <b>' + entryData.pieces + '</b> | Score: <b>' + entryData.score + '</b>';
								entry.appendChild(entry_div);
								let entry_p = document.createElement("p");
								entry_p.className = "synopsis";
								entry_p.textContent = entryData.synopsis.slice(0, 200);
								entry.appendChild(entry_p);
								autocomplete.querySelector(".entries").appendChild(entry);
						}
						var script = document.createElement("script");
						script.innerHTML = "$('.Lightbox_AddEdit').fancybox({'width':990,'height':'85%','autoScale':true,'autoDimensions':true,'transitionIn':'none','transitionOut':'none','type':'iframe'});";
						script.type = "text/javascript";
						document.body.appendChild(script);
						script.parentNode.removeChild(script);
						autocomplete.querySelector(".message").textContent = "";
						document.querySelector("#searchBar").style.position = "relative";
						document.querySelector("#searchBar").style.zIndex = "102";
						autocomplete.classList.remove("onMessage");
						autocomplete.classList.add("onResult");
						CACHE[autocomplete.type][autocomplete.query] = data;
						autocomplete.classList.remove("loading");
				} else if (data.length == 1) {
						window.location.href = '/' + (data[0].type in Autocomplete.TYPES.ANIME ? 'anime' : 'manga') + '/' + data[0].id;
				}
		}
		/*
		 * Turns an XML entry into a new JSON object keeping only what is needed
		 * @param {object} entry
		 */
		function getModelData(entry) {
				var data = {};
				data.id = entry.mal_id;
				data.image = entry.image_url;
				data.title = entry.title;
				data.type = entry.type;
				data.status = entry.status;
				data.synopsis = entry.synopsis;
				data.score = entry.score;
				var isAnime = data.type in Autocomplete.TYPES.ANIME;
				data.url = '/' + (isAnime ? 'anime' : 'manga') + '/' + data.id + '/' + data.title;
				data.pieces = isAnime ? 'episodes' : 'chapters';
				data.pieces_name = isAnime ? 'Episodes' : 'Chapters';
				// data.isAdded = Site.SESSION.LOGGED ? data.id in Site.SESSION.USER.LIST : false;
				data.isAdded = false;
				if (isAnime) {
						data.action_url = (data.isAdded === false ? "/panel.php?go=add&selected_series_id=" : "/editlist.php?type=anime&id=").concat(data.id);
				} else {
						data.action_url = (data.isAdded === false ? "/panel.php?go=addmanga&selected_manga_id=" : "/editlist.php?type=manga&id=").concat(data.id);
				}
				return data;
		}

		function parseEntries(xmlEntries) {
				var entriesData = [];
				xmlEntries.forEach(function(entry) {
						var data = getModelData(entry);
						entriesData.push(data);
				});
				return entriesData;
		}

		function retrieveEntries(autocomplete) {
				autocomplete.xmlhttp = new XMLHttpRequest();
				autocomplete.xmlhttp.onreadystatechange = function() {
						if (autocomplete.xmlhttp.readyState == XMLHttpRequest.DONE) {
								if (autocomplete.xmlhttp.status == 200) {
										var entries = autocomplete.xmlhttp.response.results;
										console.log(entries)
										if (entries.length > 0) {
												var data = parseEntries(entries);
												processData(autocomplete, data);
										} else {
												document.querySelector("#searchBar").style.position = "relative";
												document.querySelector("#searchBar").style.zIndex = "102";
												autocomplete.classList.remove("loading");
												autocomplete.classList.remove("onResult");
												autocomplete.classList.add("onMessage");
												autocomplete.querySelector(".message").textContent = "No titles matching your query were found. Please try again.";
										}
								} else if (autocomplete.xmlhttp.status == 204) {
										document.querySelector("#searchBar").style.position = "relative";
										document.querySelector("#searchBar").style.zIndex = "102";
										autocomplete.classList.remove("loading");
										autocomplete.classList.remove("onResult");
										autocomplete.classList.add("onMessage");
										autocomplete.querySelector(".message").textContent = "No titles matching your query were found. Please try again.";
								} else {
										document.querySelector("#searchBar").style.position = "relative";
										document.querySelector("#searchBar").style.zIndex = "102";
										autocomplete.classList.remove("loading");
										autocomplete.classList.remove("onResult");
										autocomplete.classList.add("onMessage");
										autocomplete.querySelector(".message").textContent = "Unable to access the API. Please try again.";
								}
						}
				};
				// autocomplete.xmlhttp.open('GET', (/^anime$/.test(Autocomplete.TYPES.CONTENT[autocomplete.type]) === true ? "/api/anime/search.xml?q=" : "/api/manga/search.xml?q=").concat(encodeURI(autocomplete.query)), true);
				autocomplete.xmlhttp.responseType = "json"
				autocomplete.xmlhttp.open('GET', (`https://api.jikan.moe/v3/search/${/^anime$/.test(Autocomplete.TYPES.CONTENT[autocomplete.type]) === true ? "anime" : "manga"}?q=`).concat(encodeURI(autocomplete.query)), true);
				autocomplete.xmlhttp.timeout = 10000;
				autocomplete.xmlhttp.ontimeout = function() {
						document.querySelector("#searchBar").style.position = "relative";
						document.querySelector("#searchBar").style.zIndex = "102";
						autocomplete.classList.remove("onResult");
						autocomplete.classList.add("onMessage");
						autocomplete.querySelector(".message").textContent = "The request timed out. Please try again.";
				};
				// autocomplete.xmlhttp.setRequestHeader('Authorization', 'Basic eDQ1MXBvOng0NTFwb3g0NTFwbw==');
				autocomplete.xmlhttp.send();
		}
		Autocomplete.search = function(autocomplete) {
			console.log(autocomplete)
				autocomplete.classList.add("loading");
				if (typeof CACHE[autocomplete.type] === "undefined") {
						CACHE[autocomplete.type] = [];
				}
				autocomplete.querySelector(".entries").innerHTML = "";
				if (autocomplete.query in CACHE[autocomplete.type]) {
						processData(autocomplete, CACHE[autocomplete.type][autocomplete.query]);
				} else {
						document.querySelector("#searchBar").style.position = "relative";
						document.querySelector("#searchBar").style.zIndex = "102";
						console.log(autocomplete)
						autocomplete.classList.remove("onResult");
						autocomplete.classList.add("onMessage");
						autocomplete.querySelector(".message").textContent = "Retrieving results...";
						retrieveEntries(autocomplete);
				}
		};
		Autocomplete.clearCache = function() {
				CACHE = [];
		};
}).call(Autocomplete = {});
