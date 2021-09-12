(function() {
		function decreasePlaybackSpeed() {
				if (MediaPlayer.Module.layout.video.playbackRate > 0.5) {
						MediaPlayer.Module.layout.video.playbackRate -= 0.5;
				}
		}

		function increasePlaybackSpeed() {
				if (MediaPlayer.Module.layout.video.playbackRate < 2) {
						MediaPlayer.Module.layout.video.playbackRate += 0.5;
				}
		}
		// TODO
		function onVideoError(event) {
				console.log("Error", event);
				console.log("Attempting to resume playback...");
				if (MediaPlayer.Module.retryAttempts === 5) {
						MediaPlayer.Module.retryAttempts++;
						MediaPlayer.setEpisode(MediaPlayer.layout.select_episode.selectedIndex, true);
				} else if (MediaPlayer.Module.retryAttempts < 5 && (MediaPlayer.state === MediaPlayer.STATE.SETTING_MEDIA || MediaPlayer.state === MediaPlayer.STATE.MEDIA_LOADED)) {
						MediaPlayer.Module.timeouts.retryTimeout = setTimeout(function() {
								MediaPlayer.Module.retryAttempts++;
								MediaPlayer.Module.setMedia(MediaPlayer.layout.select_media.selectedIndex, true);
						}, 500);
				} else {
						MediaPlayer.setState(MediaPlayer.STATE.MEDIA_NOT_FOUND);
				}
		}

		function skipBackward() {
				if (MediaPlayer.Module.layout.video.currentTime - 10 >= 0) {
						MediaPlayer.Module.layout.video.currentTime -= 10;
				} else {
						MediaPlayer.Module.layout.video.currentTime = 0;
				}
		}

		function skipForward() {
				if (MediaPlayer.Module.layout.video.currentTime + 10 <= MediaPlayer.Module.layout.video.duration) {
						MediaPlayer.Module.layout.video.currentTime += 10;
				} else {
						MediaPlayer.Module.layout.video.currentTime = MediaPlayer.Module.layout.video.duration;
				}
		}

		function togglePlayback() {
				if (MediaPlayer.Module.layout.video.paused === true) {
						MediaPlayer.Module.layout.video.play();
				} else {
						MediaPlayer.Module.layout.video.pause();
				}
		}

		function toggleVolume() {
				MediaPlayer.Module.layout.video.muted = MediaPlayer.Module.layout.video.muted === false;
		}

		function takeScreenshot() {
				var canvas = document.createElement('canvas');
				canvas.width = MediaPlayer.Module.layout.video.videoWidth;
				canvas.height = MediaPlayer.Module.layout.video.videoHeight;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(MediaPlayer.Module.layout.video, 0, 0, canvas.width, canvas.height);
				var dataURI = canvas.toDataURL('image/png');
		}
		// TODO
		MediaPlayer.Module.SHORTCUTS = {
				75: function(event) {
						if (event.ctrlKey === false) {
								togglePlayback();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				67: function(event) {
						if (event.ctrlKey === false) {
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				32: function(event) {
						if (event.ctrlKey === false) {
								togglePlayback();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				74: function(event) {
						if (event.ctrlKey === false) {
								skipBackward();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				37: function(event) {
						if (event.ctrlKey === false) {
								skipBackward();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				38: function(event) {
						if (event.ctrlKey === false) {
								increasePlaybackSpeed();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				39: function(event) {
						if (event.ctrlKey === false) {
								skipForward();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				76: function(event) {
						if (event.ctrlKey === false) {
								skipForward();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				40: function(event) {
						if (event.ctrlKey === false) {
								decreasePlaybackSpeed();
								MediaPlayer.Module.layout.div_controlsBar.show();
						}
				},
				77: function(event) {
						if (event.ctrlKey === false) {
								toggleVolume();
						}
				}
		};
		MediaPlayer.Module.SOURCES = [{
				"name": "General #1",
				"module": "Streaming",
				"format": "Subbed",
				"language": "English",
				"id": "fa5845e2-555c-11e5-885d-feff819cdc9f",
				"parameters": {
						"dubbed": false
				},
				"titlesmatcher": {
						"domain": "kissanime.to",
						"protocol": "http",
						"map": {
								"2928": {
										"url": "https://kissanime.to/Anime/hack-G-U-Returner"
								},
								"3269": {
										"url": "https://kissanime.to/Anime/hack-G-U-Trilogy"
								},
								"4469": {
										"url": "https://kissanime.to/Anime/hack-G-U-Trilogy-Parody-Mode"
								},
								"454": {
										"url": "https://kissanime.to/Anime/hack-Gift"
								},
								"1153": {
										"url": "https://kissanime.to/Anime/-hack-Sign"
								},
								"299": {
										"url": "https://kissanime.to/Anime/hack-Liminality"
								},
								"9332": {
										"url": "https://kissanime.to/Anime/hack-Quantum"
								},
								"873": {
										"url": "https://kissanime.to/Anime/hack-Roots"
								},
								"48": {
										"url": "https://kissanime.to/Anime/-hack-Sign"
								},
								"298": {
										"url": "https://kissanime.to/Anime/hack-Legend-of-the-Twilight"
								},
								"11375": {
										"url": "https://kissanime.to/Anime/hack-The-Movie-Sekai-no-Mukou-ni"
								},
								"1487": {
										"url": "https://kissanime.to/Anime/-hack-Sign"
								},
								"29978": {
										"url": "https://kissanime.to/Anime/001"
								},
								"11755": {
										"url": "https://kissanime.to/Anime/009-Re-Cyborg"
								},
								"1583": {
										"url": "https://kissanime.to/Anime/009-1"
								},
								"3234": {
										"url": "https://kissanime.to/Anime/009-1"
								},
								"28761": {
										"url": "https://kissanime.to/Anime/00-08"
								},
								"5525": {
										"url": "https://kissanime.to/Anime/07-Ghost"
								},
								"5133": {
										"url": "https://kissanime.to/Anime/Hyakumannen-Chikyuu-no-Tabi-Bander-Book"
								},
								"28977": {
										"url": "https://kissanime.to/Anime/Gintama-2015"
								},
								"918": {
										"url": "https://kissanime.to/Anime/Gintama"
								},
								"15417": {
										"url": "https://kissanime.to/Anime/Gintama"
								},
								"9969": {
										"url": "https://kissanime.to/Anime/Gintama"
								},
								"15335": {
										"url": "https://kissanime.to/Anime/Gintama-Kanketsu-hen-Yorozuya-yo-Eien-Nare"
								},
								"1994": {
										"url": "https://kissanime.to/Anime/hack-Legend-of-the-Twilight"
								},
								"2593": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"3782": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"3783": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"4280": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"4282": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"5204": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"5205": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"6624": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"6954": {
										"url": "https://kissanime.to/Anime/Gekijouban-Kara-no-Kyoukai-The-Garden-of-Sinners"
								},
								"67": {
										"url": "https://kissanime.to/Anime/Basilisk-Sub"
								},
								"5": {
										"url": "https://kissanime.to/Anime/Cowboy-Bebop-Movie-SUB"
								},
								"12403": {
										"url": "https://kissanime.to/Anime/Yuru-Yuri-2"
								},
								"27787": {
										"url": "https://kissanime.to/Anime/Nisekoi-2"
								},
								"393": {
										"url": "https://kissanime.to/Anime/Escaflowne-The-Movie"
								},
								"10294": {
										"url": "https://kissanime.to/Anime/Towa-no-Quon"
								},
								"10713": {
										"url": "https://kissanime.to/Anime/Towa-no-Quon"
								},
								"10714": {
										"url": "https://kissanime.to/Anime/Towa-no-Quon"
								},
								"10715": {
										"url": "https://kissanime.to/Anime/Towa-no-Quon"
								},
								"10716": {
										"url": "https://kissanime.to/Anime/Towa-no-Quon"
								},
								"10717": {
										"url": "https://kissanime.to/Anime/Towa-no-Quon"
								}
						},
						"regex": {
								"url": /http?:\/\/kissanime\.to\/(?:M\/)?Anime\/([^\/]+)/
						}
				},
				"buildURL": function(title) {
						return "https://kissanime.to/Anime/".concat(title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, "").replace(/[-]+/g, "-").replace(/^-+|-+$/g, ""));
				},
				"getEpisodes": function(url) {
						let source = this;
						return new Promise(function(resolve, reject) {
								let xhttp = new XMLHttpRequest();
								MediaPlayer.xhttp = xhttp;
								xhttp.onreadystatechange = function() {
										if (xhttp.readyState === 4) {
												if (xhttp.status === 200) {
														let episodeLinks = xhttp.responseXML.querySelectorAll(".listing a");
														let a_title = xhttp.responseXML.querySelector("a.bigChar");
														if (a_title) {
																let newURL = url;
																if (source.parameters.dubbed === true && /(\(Sub\))$/.test(a_title.textContent)) {
																		if (url.match(/-sub$/)) {
																				newURL = url.replace(/-sub$/, "-dub");
																		} else if (/-dub$/.test(url) === false) {
																				newURL = url.concat("-dub");
																		}
																} else if (source.parameters.dubbed === false && /(\(Dub\))$/.test(a_title.textContent)) {
																		if (/-dub$/.test(url)) {
																				newURL = url.replace(/-dub$/, "-sub");
																		} else if (/-sub$/.test(url) === false) {
																				newURL = url.concat("-sub");
																		}
																}
																if (newURL !== url) {
																		source.getEpisodes(newURL).then(function(response) {
																				resolve(response);
																		});
																		return;
																}
														}
														if (episodeLinks.length > 0) {
																let episodes = [];
																for (let i = 0; i < episodeLinks.length; i++) {
																		episodes.push({
																				title: episodeLinks[i].textContent,
																				url: episodeLinks[i].href
																		});
																}
																resolve({
																		status: "found",
																		episodes: episodes
																});
														} else {
																resolve({
																		status: "no_links",
																		episodes: []
																});
														}
												} else if (xhttp.status === 503) {
														Helpers.solveChallenge(xhttp.responseXML.documentElement.innerHTML, "kissanime.to", function()  {
																source.getEpisodes(url).then(function(response) {
																		resolve(response);
																});
														});
												} else if (typeof xhttp.aborted === "undefined") {
														resolve({
																status: "network_error",
																episodes: []
														});
												}
										}
								};
								xhttp.open("GET", url, true);
								xhttp.responseType = "document";
								xhttp.send();
						});
				},
				"getMedia": function(url) {
						let source = this;
						return new Promise(function(resolve, reject) {
								let xhttp = new XMLHttpRequest();
								MediaPlayer.xhttp = xhttp;
								xhttp.onreadystatechange = function() {
										if (xhttp.readyState === 4) {
												if (xhttp.status === 200) {
														let select_quality = xhttp.responseXML.querySelector("select#selectQuality");
														if (select_quality !== null) {
																let medias = [];
																for (let i = 0; i < select_quality.options.length; i++) {
																		medias.push({
																				label: select_quality.options[i].text,
																				url: window.atob(select_quality.options[i].value)
																		});
																}
																resolve({
																		status: "found",
																		medias: medias
																});
														} else {
																resolve({
																		status: "no_links",
																		medias: []
																});
														}
												} else if (xhttp.status === 503) {
														Helpers.solveChallenge(xhttp.responseXML.documentElement.innerHTML, "kissanime.to", function()  {
																source.getEpisodes(url).then(function(response) {
																		resolve(response);
																});
														});
												} else if (typeof xhttp.aborted === "undefined") {
														resolve({
																status: "network_error",
																medias: []
														});
												}
										}
								};
								xhttp.open("GET", url, true);
								xhttp.responseType = "document";
								xhttp.send();
						});
				}
		}, {
				"name": "General #2",
				"module": "Streaming",
				"id": "fa5849e8-555c-11e5-885d-feff819cdc9f",
				"format": "Subbed",
				"language": "English",
				"parameters": {},
				"titlesmatcher": {
						"domain": "gogoanime.io",
						"protocol": "http",
						"map": {
								"10218": {
										"url": "https://www2.gogoanime.video/berserk-golden-age-arc-i---the-egg-of-the-king-episode-1"
								},
								"12113": {
										"url": "https://www2.gogoanime.video/berserk-golden-age-arc-ii---the-battle-for-doldrey-episode-1"
								},
								"12115": {
										"url": "https://www2.gogoanime.video/category/berserk-ougon-jidaihen-iii-kourin"
								},
								"28977": {
										"url": "https://www2.gogoanime.video/category/gintama-2015-"
								},
								"15417": {
										"url": "https://www2.gogoanime.video/category/Gintama"
								},
								"9969": {
										"url": "https://www2.gogoanime.video/category/Gintama"
								},
								"2593": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-1"
								},
								"3782": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-2"
								},
								"3783": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-3"
								},
								"4280": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-4"
								},
								"4282": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-5"
								},
								"5204": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-6"
								},
								"5205": {
										"url": "https://www2.gogoanime.video/kara-no-kyoukai-the-garden-of-sinners-episode-7"
								},
								"67": {
										url: "https://www2.gogoanime.video/basilisk"
								},
								"12403": {
										url: "https://www2.gogoanime.video/category/yuru-yuri-s2"
								},
								"27787": {
										url: "https://www2.gogoanime.video/category/nisekoi-"
								},
								"10294": {
										"url": "https://www2.gogoanime.video/category/towa-no-quon"
								},
								"10713": {
										"url": "https://www2.gogoanime.video/category/towa-no-quon"
								},
								"10714": {
										"url": "https://www2.gogoanime.video/category/towa-no-quon"
								},
								"10715": {
										"url": "https://www2.gogoanime.video/category/towa-no-quon"
								},
								"10716": {
										"url": "https://www2.gogoanime.video/category/towa-no-quon"
								},
								"10717": {
										"url": "https://www2.gogoanime.video/category/towa-no-quon"
								}
						},
						"regex": {
								"url": /http:\/\/gogoanime\.io\/category\/([^\/]+)/
						}
				},
				"buildURL": function(title) {
						return "https://www2.gogoanime.video/category/".concat(title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, "").replace(/[-]+/g, "-").replace(/^-+|-+$/g, ""));
				},
				"getEpisodes": function(url) {
						let source = this;
						return new Promise(function(resolve, reject) {
								let xhttp = new XMLHttpRequest();
								MediaPlayer.xhttp = xhttp;
								xhttp.onreadystatechange = function() {
										if (xhttp.readyState === 4) {
												if (xhttp.status === 200) {
														// TODO
														console.log(xhttp)
														let input_movie_id = xhttp.responseXML.querySelector("input#movie_id");
														if (input_movie_id !== null) {
																let xhttp1 = new XMLHttpRequest();
																MediaPlayer.xhttp = xhttp1;
																xhttp1.onreadystatechange = function() {
																		if (xhttp1.readyState === 4) {
																				if (xhttp1.status === 200) {
																						let episodes = [];
																						let episodes_link = xhttp1.responseXML.querySelectorAll("#episode_related a");
																						if (episodes_link.length > 0) {
																								for (let i = 0; i < episodes_link.length; i++) {
																										episodes.push({
																												title: episodes_link[i].textContent,
																												url: "https://www2.gogoanime.video/" + episodes_link[i].getAttribute("href").trim()
																										});
																								}
																								resolve({
																										status: "found",
																										episodes: episodes
																								});
																						} else {
																								resolve({
																										status: "no_links",
																										episodes: []
																								});
																						}
																				} else if (typeof xhttp1.aborted === "undefined") {
																						resolve({
																								status: "network_error",
																								episodes: []
																						});
																				}
																		}
																};
																xhttp1.open("GET", "https://ajax.gogocdn.net/ajax/load-list-episode?ep_start=0&ep_end=9999&id=".concat(input_movie_id.value), true);
																xhttp1.responseType = "document";
																xhttp1.send();
														} else {
																resolve({
																		status: "no_links",
																		episodes: []
																});
														}
												} else if (xhttp.status === 503) {
														Helpers.solveChallenge(xhttp.responseXML.documentElement.innerHTML, "gogoanime.io", function()  {
																source.getEpisodes(url).then(function(response) {
																		resolve(response);
																});
														});
												} else if (typeof xhttp.aborted === "undefined") {
														resolve({
																status: "network_error",
																episodes: []
														});
												}
										}
								};
								xhttp.open("GET", url, true);
								xhttp.responseType = "document";
								xhttp.send();
						});
				},
				"getMedia": function(url) {
						let source = this;
						return new Promise(function(resolve, reject) {
								let xhttp = new XMLHttpRequest();
								MediaPlayer.xhttp = xhttp;
								xhttp.onreadystatechange = function() {
										if (xhttp.readyState === 4) {
												if (xhttp.status === 200) {
														let medias = [];
														let links = Array.prototype.slice.call(xhttp.responseXML.querySelectorAll("[link-watch]")).map(function(link) {
																if (/^https?:\/\/(www\.)?([a-zA-Z0-9]{1,61}\.)?vidstream\.io/.test(link.getAttribute("link-watch")) === true) {
																		return link.getAttribute("link-watch");
																} else {
																		return "https://www.mp4upload.com/embed-".concat(link.getAttribute("link-watch")) + ".html";
																}
														});
														let anime_video_body_watch = xhttp.responseXML.querySelector(".anime_video_body_watch iframe");
														if (anime_video_body_watch !== null) {
																links.push(anime_video_body_watch.src);
														}
														let select_quality = xhttp.responseXML.querySelector("select#selectQuality");
														if (select_quality !== null) {
																for (let i = 0; i < select_quality.options.length; i++) {
																		medias.push({
																				label: select_quality.options[i].text,
																				url: select_quality.options[i].value
																		});
																}
														}
														Helpers.runGenerator(function*() {
																for (let link of links) {
																		yield new Promise(function(resolve1, reject1) {
																				let xhttp1 = new XMLHttpRequest();
																				MediaPlayer.xhttp = xhttp1;
																				xhttp1.onreadystatechange = function() {
																						if (xhttp1.readyState === 4) {
																								if (xhttp1.status === 200) {
																										if (xhttp1.responseXML.querySelector("#anime_play video") !== null) {
																												let sources = xhttp1.responseXML.querySelectorAll("#anime_play video source");
																												for (let source of sources) {
																														if (source.getAttribute("label") !== "auto") {
																																medias.push({
																																		label: source.getAttribute("label") ? (source.getAttribute("label") + "p") : "N/A",
																																		url: source.src
																																});
																														}
																												}
																										} else {
																												let match = xhttp1.responseXML.body.innerHTML.trim().match(/\s*('|")?file('|")?:\s*('|")(.*?)('|")/i);
																												if (match !== null) {
																														medias.push({
																																label: "N/A",
																																url: match[4]
																														});
																												}
																										}
																								}
																								resolve1();
																						}
																				};
																				xhttp1.open("GET", link, true);
																				xhttp1.responseType = "document";
																				xhttp1.send();
																		});
																}
																resolve({
																		status: medias.length > 0 ? "found" : "no_links",
																		medias: medias
																});
														});
												} else if (xhttp.status === 503) {
														Helpers.solveChallenge(xhttp.responseXML.documentElement.innerHTML, "gogoanime.io", function()  {
																source.getEpisodes(url).then(function(response) {
																		resolve(response);
																});
														});
												} else if (typeof xhttp.aborted === "undefined") {
														resolve({
																status: "network_error",
																medias: []
														});
												}
										}
								};
								xhttp.open("GET", url, true);
								xhttp.responseType = "document";
								xhttp.send();
						});
				}
		}, {
				"name": "General #1",
				"module": "Streaming",
				"id": "ad98592b-9183-4e3a-ac5f-9516c9db6474",
				"language": "English",
				"format": "Dubbed",
				"parameters": {
						"dubbed": true
				},
				"titlesmatcher": {
						"protocol": "http",
						"domain": "kissanime.to",
						"map": {
								"67": "https://kissanime.to/Anime/Basilisk-Dub"
						},
						"regex": {
								"url": /http?:\/\/kissanime\.to\/(?:M\/)?Anime\/([^\/]+)/
						}
				},
				"buildURL": function(title) {
						return MediaPlayer.Module.SOURCES.find(function(source) {
								return source.id === "fa5845e2-555c-11e5-885d-feff819cdc9f";
						}).buildURL.call(this, title);
				},
				"getEpisodes": function(url) {
						return MediaPlayer.Module.SOURCES.find(function(source) {
								return source.id === "fa5845e2-555c-11e5-885d-feff819cdc9f";
						}).getEpisodes.call(this, url);
				},
				"getMedia": function(url) {
						return MediaPlayer.Module.SOURCES.find(function(source) {
								return source.id === "fa5845e2-555c-11e5-885d-feff819cdc9f";
						}).getMedia.call(this, url);
				}
		}];
		MediaPlayer.Module.attach = function() {
				console.log("Attaching module...");
				return new Promise(function(resolve, reject) {
						MediaPlayer.Module.Storage = Storage.store.Streaming;
						MediaPlayer.layout.div_media.addEventListener("mousemove", function(event) {
								if (MediaPlayer.Module.layout.div_controlsBar.mouseover === false && MediaPlayer.Module.layout.video.paused === false && (typeof MediaPlayer.Module.layout.div_controlsBar.lastX === "undefined" || (MediaPlayer.Module.layout.div_controlsBar.lastX !== event.x || MediaPlayer.Module.layout.div_controlsBar.lastY !== event.y))) {
										MediaPlayer.Module.layout.div_controlsBar.show();
								}
								MediaPlayer.Module.layout.div_controlsBar.lastY = event.y;
								MediaPlayer.Module.layout.div_controlsBar.lastX = event.x;
						}, false);
						MediaPlayer.layout.div_media.addEventListener("mouseout", function(event) {
								if (MediaPlayer.Module.layout.video.paused === false) {
										MediaPlayer.Module.layout.div_controlsBar.hide();
								}
						}, false);
						MediaPlayer.layout.select_media.addEventListener("change", function(event) {
								let quality = MediaPlayer.layout.select_media.options[MediaPlayer.layout.select_media.selectedIndex].text;
								if (/^[0-9]+p/i.test(quality) === true) {
										MediaPlayer.Module.Storage.preferences.playback.quality = quality.toLowerCase();
										Storage.save();
										console.log("Streaming.preferences.playback.quality=" + MediaPlayer.Module.Storage.preferences.playback.quality);
								}
						}, false);
						MediaPlayer.Module.layout.div_controlsBar = document.createElement("div");
						MediaPlayer.Module.layout.div_controlsBar.className = "controlsBar";
						MediaPlayer.Module.layout.div_controlsBar.mouseover = false;
						MediaPlayer.Module.layout.div_controlsBar.addEventListener("mouseover", function(event) {
								MediaPlayer.Module.layout.div_controlsBar.mouseover = true;
								MediaPlayer.Module.layout.div_controlsBar.show();
						}, false);
						MediaPlayer.Module.layout.div_controlsBar.addEventListener("mouseout", function(event) {
								MediaPlayer.Module.layout.div_controlsBar.mouseover = false;
								if (MediaPlayer.Module.layout.video.paused === false) {
										MediaPlayer.Module.layout.div_controlsBar.hide();
								}
						}, false);
						MediaPlayer.Module.layout.div_controlsBar.hide = function() {
								if (typeof MediaPlayer.Module.timeouts.hideControlsbarTimeout !== "undefined") {
										window.clearTimeout(MediaPlayer.Module.timeouts.hideControlsbarTimeout);
								}
								if (MediaPlayer.Module.layout.video.paused === false) {
										MediaPlayer.layout.div_media.style.cursor = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='), pointer";
										MediaPlayer.Module.layout.div_controlsBar.className = "controlsBar hidden";
								}
						};
						MediaPlayer.Module.layout.div_controlsBar.show = function() {
								if (typeof MediaPlayer.Module.timeouts.hideControlsbarTimeout !== "undefined") {
										window.clearTimeout(MediaPlayer.Module.timeouts.hideControlsbarTimeout);
								}
								MediaPlayer.layout.div_media.style.cursor = "initial";
								MediaPlayer.Module.layout.div_controlsBar.className = "controlsBar visible";
								MediaPlayer.Module.timeouts.hideControlsbarTimeout = setTimeout(function() {
										MediaPlayer.Module.layout.div_controlsBar.hide();
								}, 3000);
						};
						MediaPlayer.layout.div_media.appendChild(MediaPlayer.Module.layout.div_controlsBar);
						MediaPlayer.Module.layout.button_play = document.createElement("button");
						MediaPlayer.Module.layout.button_play.className = "play-button";
						MediaPlayer.Module.layout.button_play.innerHTML = "<i class='fa fa-play'></i>";
						MediaPlayer.Module.layout.button_play.addEventListener("click", function(event) {
								togglePlayback();
						}, false);
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.button_play);
						MediaPlayer.Module.layout.div_thumbnailWrapper = document.createElement("div");
						MediaPlayer.Module.layout.div_thumbnailWrapper.className = "thumbnailWrapper";
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.div_thumbnailWrapper);
						MediaPlayer.Module.layout.canvas_thumbnail = document.createElement("canvas");
						MediaPlayer.Module.layout.canvas_thumbnail.className = "thumbnail";
						MediaPlayer.Module.layout.div_thumbnailWrapper.appendChild(MediaPlayer.Module.layout.canvas_thumbnail);
						MediaPlayer.Module.layout.div_thumbnailTime = document.createElement("div");
						MediaPlayer.Module.layout.div_thumbnailTime.className = "thumbnailTime";
						MediaPlayer.Module.layout.div_thumbnailWrapper.appendChild(MediaPlayer.Module.layout.div_thumbnailTime);
						MediaPlayer.Module.layout.input_timeline = document.createElement("input");
						MediaPlayer.Module.layout.input_timeline.className = "timeline";
						MediaPlayer.Module.layout.input_timeline.type = "range";
						MediaPlayer.Module.layout.input_timeline.min = 0;
						MediaPlayer.Module.layout.input_timeline.mousedown = false;
						MediaPlayer.Module.layout.input_timeline.mousemove = null;
						MediaPlayer.Module.layout.input_timeline.offsetX = 0;
						MediaPlayer.Module.layout.input_timeline.offsetY = 0;
						MediaPlayer.Module.layout.input_timeline.step = "any";
						MediaPlayer.Module.layout.input_timeline.value = 0;
						MediaPlayer.Module.layout.input_timeline.repaint = function() {
								MediaPlayer.Module.layout.input_timeline.value = MediaPlayer.Module.layout.video.currentTime;
								MediaPlayer.Module.layout.div_timeDisplay.textContent = Helpers.secondsToHours(MediaPlayer.Module.layout.video.currentTime) + " / " + Helpers.secondsToHours(MediaPlayer.Module.layout.video.duration);
								let white = "hsl(0, 0%, 100%)";
								let white_over = "hsla(0, 0%, 100%, 0.5)";
								let gray = "hsla(0, 0% ,46%, 0.8)";
								/*let gray_over = "hsla(0, 0% ,46%, 0.4)";*/
								let transparent = "transparent";
								let transparent_over = "hsla(0, 0% ,46%, 0.3)";
								let buffer = MediaPlayer.Module.layout.video.buffered;
								for (let i = buffer.length; i--;) {
										if (MediaPlayer.Module.layout.video.currentTime >= buffer.start(i) && MediaPlayer.Module.layout.video.currentTime <= buffer.end(i)) {
												let percents = {
														currentTime: (MediaPlayer.Module.layout.video.currentTime * 100) / MediaPlayer.Module.layout.video.duration,
														bufferStart: (buffer.start(i) * 100) / MediaPlayer.Module.layout.video.duration,
														bufferEnd: (buffer.end(i) * 100) / MediaPlayer.Module.layout.video.duration,
												};
												if (MediaPlayer.Module.layout.input_timeline.mousemove !== null) {
														percents.cursorTime = (MediaPlayer.Module.layout.input_timeline.mousemove.offsetX * 100) / MediaPlayer.Module.layout.input_timeline.offsetWidth;
														if (percents.cursorTime < percents.currentTime) {
																MediaPlayer.Module.layout.input_timeline.style.background = "linear-gradient(90deg, " + white + ", " + white + " " + percents.cursorTime + "%, " + white_over + " " + percents.cursorTime + "%, " + white_over + " " + percents.currentTime + "%, " + gray + " " + percents.currentTime + "%, " + gray + " " + percents.bufferEnd + "%, " + transparent + " " + percents.bufferEnd + "%, " + transparent + " 100%";
														} else {
																MediaPlayer.Module.layout.input_timeline.style.background = "linear-gradient(90deg, " + white + ", " + white + " " + percents.currentTime + "%, " + gray + " " + percents.currentTime + "%, " + gray + " " + percents.bufferEnd + "%, " + transparent_over + " " + percents.bufferEnd + "%, " + transparent_over + " " + percents.cursorTime + "%, " + transparent + " " + percents.cursorTime + "%, " + transparent + " 100%";
														}
												} else {
														MediaPlayer.Module.layout.input_timeline.style.background = "linear-gradient(90deg, " + white + ", " + white + " " + percents.currentTime + "%, " + gray + " " + percents.currentTime + "%, " + gray + " " + percents.bufferEnd + "%, " + transparent + " " + percents.bufferEnd + "%, " + transparent + " 100%";
												}
												break;
										}
								}
						};
						MediaPlayer.Module.layout.input_timeline.setTimeByOffsetX = function(offsetX) {
								let percent = (offsetX * 100) / MediaPlayer.Module.layout.input_timeline.offsetWidth;
								let time = (MediaPlayer.Module.layout.input_timeline.max * percent) / 100;
								if (time > MediaPlayer.Module.layout.video.duration) {
										time = MediaPlayer.Module.layout.video.duration;
								} else if (time < 0) {
										time = 0;
								}
								MediaPlayer.Module.layout.video.currentTime = time;
						};
						MediaPlayer.Module.layout.input_timeline.addEventListener("click", function(event) {
								MediaPlayer.Module.layout.input_timeline.setTimeByOffsetX(event.offsetX);
						}, false);
						MediaPlayer.Module.layout.input_timeline.addEventListener("mousedown", function(event) {
								MediaPlayer.Module.layout.input_timeline.mousedown = true;
						}, false);
						MediaPlayer.Module.layout.input_timeline.addEventListener("mouseout", function(event) {
								MediaPlayer.Module.layout.input_timeline.mousemove = null;
								MediaPlayer.Module.layout.input_timeline.repaint();
						}, false);
						MediaPlayer.Module.layout.input_timeline.addEventListener("mousemove", function(event) {
								if (MediaPlayer.Module.layout.input_timeline.mousemove === null || MediaPlayer.Module.layout.input_timeline.mousemove.offsetX !== event.offsetX || MediaPlayer.Module.layout.input_timeline.mousemove.offsetY !== event.offsetY) {
										MediaPlayer.Module.layout.input_timeline.mousemove = event;
										if (MediaPlayer.Module.layout.video.paused === true) {
												MediaPlayer.Module.layout.input_timeline.repaint();
										}
										if (MediaPlayer.Module.layout.input_timeline.mousedown === true) {
												MediaPlayer.Module.layout.input_timeline.setTimeByOffsetX(event.offsetX);
										}
										let percent = (event.offsetX * 100) / MediaPlayer.Module.layout.input_timeline.offsetWidth;
										let time = (MediaPlayer.Module.layout.input_timeline.max * percent) / 100;
										if (time > MediaPlayer.Module.layout.video.duration) {
												time = MediaPlayer.Module.layout.video.duration;
										} else if (time < 0) {
												time = 0;
										}
										MediaPlayer.Module.layout.div_thumbnailTime.textContent = Helpers.secondsToHours(time);
										MediaPlayer.Module.layout.div_thumbnailWrapper.style.left = event.offsetX + "px";
										MediaPlayer.Module.layout.div_thumbnailWrapper.style.display = "block";
										MediaPlayer.Module.layout.canvas_thumbnail.style.display = "none";
										if (typeof MediaPlayer.Module.timeouts.thumbnailTimeout !== "undefined") {
												MediaPlayer.Module.layout.video_thumbnail.src = "";
												clearTimeout(MediaPlayer.Module.timeouts.thumbnailTimeout);
										}
										if (typeof MediaPlayer.Module.timeouts.thumbnailTimeout !== "undefined") {
												MediaPlayer.Module.layout.video_thumbnail.src = "";
												clearTimeout(MediaPlayer.Module.timeouts.thumbnailTimeout);
										}
										MediaPlayer.Module.timeouts.thumbnailTimeout = setTimeout(function() {
												let context = MediaPlayer.Module.layout.canvas_thumbnail.getContext("2d");
												MediaPlayer.Module.layout.video_thumbnail.src = MediaPlayer.layout.select_media.options[MediaPlayer.layout.select_media.options.length - 1].value;
												MediaPlayer.Module.layout.video_thumbnail.onloadedmetadata = function() {
														MediaPlayer.Module.layout.canvas_thumbnail.width = MediaPlayer.Module.layout.video_thumbnail.videoWidth;
														MediaPlayer.Module.layout.canvas_thumbnail.height = MediaPlayer.Module.layout.video_thumbnail.videoHeight;
														MediaPlayer.Module.layout.video_thumbnail.currentTime = time;
												};
												MediaPlayer.Module.layout.video_thumbnail.onseeked = function() {
														context.drawImage(MediaPlayer.Module.layout.video_thumbnail, 0, 0, MediaPlayer.Module.layout.video_thumbnail.videoWidth, MediaPlayer.Module.layout.video_thumbnail.videoHeight);
														MediaPlayer.Module.layout.video_thumbnail.src = "";
														MediaPlayer.Module.layout.canvas_thumbnail.style.display = "block";
												};
										}, 100);
								}
						}, false);
						MediaPlayer.Module.layout.input_timeline.addEventListener("mouseup", function(event) {
								MediaPlayer.Module.layout.input_timeline.mousedown = false;
						}, false);
						MediaPlayer.Module.layout.input_timeline.addEventListener("mouseout", function(event) {
								if (typeof MediaPlayer.Module.timeouts.thumbnailTimeout !== "undefined") {
										MediaPlayer.Module.layout.video_thumbnail.src = "";
										clearTimeout(MediaPlayer.Module.timeouts.thumbnailTimeout);
								}
								MediaPlayer.Module.layout.div_thumbnailWrapper.style.display = "none";
						}, false);
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.input_timeline);
						MediaPlayer.Module.layout.div_timeDisplay = document.createElement("div");
						MediaPlayer.Module.layout.div_timeDisplay.className = "time-display";
						MediaPlayer.Module.layout.div_timeDisplay.innerHTML = "00:00 / 00:00";
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.div_timeDisplay);
						MediaPlayer.Module.layout.button_mute = document.createElement("button");
						MediaPlayer.Module.layout.button_mute.className = "mute-button";
						MediaPlayer.Module.layout.button_mute.addEventListener("click", function(event) {
								toggleVolume();
						}, false);
						MediaPlayer.Module.layout.button_mute.repaint = function() {
								if (MediaPlayer.Module.layout.video.muted === true || MediaPlayer.Module.layout.video.volume === 0) {
										MediaPlayer.Module.layout.button_mute.innerHTML = "<i class='fa fa-volume-off'></i>";
								} else if (MediaPlayer.Module.layout.video.volume < 0.5) {
										MediaPlayer.Module.layout.button_mute.innerHTML = "<i class='fa fa-volume-down'></i>";
								} else {
										MediaPlayer.Module.layout.button_mute.innerHTML = "<i class='fa fa-volume-up'></i>";
								}
								MediaPlayer.Module.layout.input_volumeSlider.repaint();
						};
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.button_mute);
						MediaPlayer.Module.layout.input_volumeSlider = document.createElement("input");
						MediaPlayer.Module.layout.input_volumeSlider.className = "volume-slider";
						MediaPlayer.Module.layout.input_volumeSlider.type = "range";
						MediaPlayer.Module.layout.input_volumeSlider.max = 1;
						MediaPlayer.Module.layout.input_volumeSlider.min = 0;
						MediaPlayer.Module.layout.input_volumeSlider.mousedown = false;
						MediaPlayer.Module.layout.input_volumeSlider.step = "any";
						MediaPlayer.Module.layout.input_volumeSlider.setVolumeByOffsetX = function(offsetX) {
								let percent = (offsetX * 100) / MediaPlayer.Module.layout.input_volumeSlider.offsetWidth;
								let volume = (MediaPlayer.Module.layout.input_volumeSlider.max * percent) / 100;
								if (volume > 1) {
										volume = 1;
								} else if (volume < 0) {
										volume = 0;
								}
								MediaPlayer.Module.layout.video.volume = volume;
								if (volume > 0 && MediaPlayer.Module.layout.video.muted === true) {
										MediaPlayer.Module.layout.video.muted = false;
								}
						};
						MediaPlayer.Module.layout.input_volumeSlider.addEventListener("click", function(event) {
								MediaPlayer.Module.layout.input_volumeSlider.setVolumeByOffsetX(event.offsetX);
						}, false);
						MediaPlayer.Module.layout.input_volumeSlider.addEventListener("mousedown", function(event) {
								MediaPlayer.Module.layout.input_volumeSlider.mousedown = true;
						}, false);
						MediaPlayer.Module.layout.input_volumeSlider.addEventListener("mouseup", function(event) {
								MediaPlayer.Module.layout.input_volumeSlider.mousedown = false;
						});
						MediaPlayer.Module.layout.input_volumeSlider.addEventListener("mouseout", function(event) {
								MediaPlayer.Module.layout.input_volumeSlider.repaint();
						}, false);
						MediaPlayer.Module.layout.input_volumeSlider.addEventListener("mousemove", function(event) {
								if (MediaPlayer.Module.layout.input_volumeSlider.mousedown === true) {
										MediaPlayer.Module.layout.input_volumeSlider.setVolumeByOffsetX(event.offsetX);
								}
								let white = "hsl(0, 0%, 100%)";
								let semiTransparent = "hsla(0, 0%, 100%, 0.2)";
								let percents = {
										volume: (MediaPlayer.Module.layout.video.volume * 100) / 1,
										cursorVolume: (event.offsetX * 100) / MediaPlayer.Module.layout.input_volumeSlider.offsetWidth
								};
								if (MediaPlayer.Module.layout.video.muted === true || MediaPlayer.Module.layout.video.volume === 0) {
										MediaPlayer.Module.layout.input_volumeSlider.style.background = "linear-gradient(90deg, " + semiTransparent + " " + percents.cursorVolume + "%, " + semiTransparent + " " + percents.cursorVolume + "%, transparent " + percents.cursorVolume + "%, transparent 100%";
								} else if (percents.cursorVolume < percents.volume) {
										MediaPlayer.Module.layout.input_volumeSlider.style.background = "linear-gradient(90deg, " + white + ", " + white + " " + percents.cursorVolume + "%, " + semiTransparent + " " + percents.cursorVolume + "%, " + semiTransparent + " " + percents.volume + "%, transparent " + percents.volume + "%, transparent 100%";
								} else {
										MediaPlayer.Module.layout.input_volumeSlider.style.background = "linear-gradient(90deg, " + white + ", " + white + " " + percents.volume + "%, " + semiTransparent + " " + percents.volume + "%, " + semiTransparent + " " + percents.cursorVolume + "%, transparent " + percents.cursorVolume + "%, transparent 100%";
								}
						}, false);
						MediaPlayer.Module.layout.input_volumeSlider.repaint = function() {
								if (MediaPlayer.Module.layout.video.muted === true || MediaPlayer.Module.layout.video.volume === 0) {
										MediaPlayer.Module.layout.input_volumeSlider.style.background = "";
								} else {
										MediaPlayer.Module.layout.input_volumeSlider.style.background = "linear-gradient(90deg, hsl(0, 0%, 100%) " + (MediaPlayer.Module.layout.video.volume * 100) + "%, transparent 0%)";
								}
						};
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.input_volumeSlider);
						MediaPlayer.Module.layout.button_camera = document.createElement("button");
						MediaPlayer.Module.layout.button_camera.className = "camera-button";
						MediaPlayer.Module.layout.button_camera.title = "Take a screenshot";
						MediaPlayer.Module.layout.button_camera.innerHTML = "<i class='fa fa-camera'></i>";
						MediaPlayer.Module.layout.button_camera.addEventListener("click", function(event) {
								takeScreenshot();
						}, false);
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.button_camera);
						MediaPlayer.Module.layout.button_fullscreen = document.createElement("button");
						MediaPlayer.Module.layout.button_fullscreen.className = "fullscreen-button";
						MediaPlayer.Module.layout.button_fullscreen.title = "Switch to fullscreen";
						MediaPlayer.Module.layout.button_fullscreen.innerHTML = "<i class='fa fa-arrows-alt'></i>";
						MediaPlayer.Module.layout.button_fullscreen.addEventListener("click", function(event) {
								MediaPlayer.toggleFullscreen();
						}, false);
						MediaPlayer.Module.layout.div_controlsBar.appendChild(MediaPlayer.Module.layout.button_fullscreen);

						MediaPlayer.Module.layout.video = document.createElement("video");
						MediaPlayer.Module.layout.video.autoplay = true;
						MediaPlayer.Module.layout.video.controls = false;
						MediaPlayer.Module.layout.video.muted = MediaPlayer.Module.Storage.preferences.playback.muted;
						MediaPlayer.Module.layout.video.preload = "";
						MediaPlayer.Module.layout.video.volume = MediaPlayer.Module.Storage.preferences.playback.volume;
						MediaPlayer.Module.layout.input_volumeSlider.repaint();
						MediaPlayer.Module.layout.button_mute.repaint();
						MediaPlayer.Module.layout.video.addEventListener("click", function(event) {
								togglePlayback();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("ended", function(event) {
								MediaPlayer.next();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("error", onVideoError, false);
						MediaPlayer.Module.layout.video.addEventListener("dblclick", function(event) {
								MediaPlayer.toggleFullscreen();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("durationchange", function(event) {
								console.log("durationchange");
								MediaPlayer.Module.layout.input_timeline.repaint();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("loadeddata", function(event) {
								console.log("loadeddata");
								MediaPlayer.Module.retryAttempts = 0;
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("loadedmetadata", function(event) {
								console.log("loadedmetadata");
								MediaPlayer.setState(MediaPlayer.STATE.MEDIA_LOADED);
								if (MediaPlayer.Module.resume === true && typeof MediaPlayer.Module.sourceData.episode.currentTime !== "undefined") {
										console.log('Resuming playback...');
										MediaPlayer.Module.layout.video.currentTime = MediaPlayer.Module.sourceData.episode.currentTime;
								}
								if (MediaPlayer.layout.select_media.options[MediaPlayer.layout.select_media.selectedIndex].text === "N/A") {
										MediaPlayer.layout.select_media.options[MediaPlayer.layout.select_media.selectedIndex].text = MediaPlayer.Module.layout.video.videoHeight + "p";
								}
								MediaPlayer.Module.playbackResumed = true;
								MediaPlayer.Module.layout.input_timeline.max = MediaPlayer.Module.layout.video.duration;
								MediaPlayer.Module.layout.div_controlsBar.show();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("loadstart", function(event) {
								console.log("loadstart");
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("pause", function(event) {
								MediaPlayer.Module.layout.button_play.innerHTML = "<i class='fa fa-play'></i>";
								MediaPlayer.Module.layout.div_controlsBar.show();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("play", function(event) {
								MediaPlayer.Module.layout.button_play.innerHTML = "<i class='fa fa-pause'></i>";
								if (MediaPlayer.Module.layout.div_controlsBar.mouseover === false) {
										MediaPlayer.Module.layout.div_controlsBar.hide();
								}
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("progress", function(event) {
								MediaPlayer.Module.layout.input_timeline.repaint();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("seeked", function(event) {
								MediaPlayer.layout.div_media.className = "media";
								MediaPlayer.Module.layout.input_timeline.repaint();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("seeking", function(event) {
								MediaPlayer.layout.div_media.className = "media buffering";
								MediaPlayer.Module.layout.input_timeline.repaint();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("timeupdate", function(event) {
								if (MediaPlayer.Module.playbackResumed === true && MediaPlayer.Module.layout.video.currentTime > 0) {
										if (MediaPlayer.Module.layout.video.duration - MediaPlayer.Module.layout.video.currentTime < 5) {
												MediaPlayer.Module.sourceData.episode.currentTime = MediaPlayer.Module.layout.video.currentTime - 10;
										} else {
												MediaPlayer.Module.sourceData.episode.currentTime = MediaPlayer.Module.layout.video.currentTime;
										}
										Storage.save();
										MediaPlayer.historyEntry.updated_at = Date.now();
										Storage.save();
								}
								MediaPlayer.Module.layout.input_timeline.repaint();
						}, false);
						MediaPlayer.Module.layout.video.addEventListener("volumechange", function(event) {
								MediaPlayer.Module.layout.input_volumeSlider.repaint();
								MediaPlayer.Module.layout.button_mute.repaint();
								MediaPlayer.Module.Storage.preferences.playback.muted = MediaPlayer.Module.layout.video.muted;
								Storage.save();
								console.log("Streaming.preferences.playback.muted=" + MediaPlayer.Module.Storage.preferences.playback.muted);
								MediaPlayer.Module.Storage.preferences.playback.volume = MediaPlayer.Module.layout.video.volume;
								Storage.save();
								console.log("Streaming.preferences.playback.volume=" + MediaPlayer.Module.Storage.preferences.playback.volume);
						}, false);
						MediaPlayer.layout.div_media.appendChild(MediaPlayer.Module.layout.video);
						MediaPlayer.Module.layout.video_thumbnail = document.createElement("video");
						resolve();
				});
		};
		MediaPlayer.Module.onStateChange = function() {
				switch (MediaPlayer.state) {
						case MediaPlayer.STATE.DEFAULT:
						case MediaPlayer.STATE.MEDIA_NOT_FOUND:
						case MediaPlayer.STATE.INITIALIZING_PLAYER:
						case MediaPlayer.STATE.SETTING_SOURCE:
						case MediaPlayer.STATE.SETTING_EPISODE:
						case MediaPlayer.STATE.SETTING_MEDIA:
								MediaPlayer.Module.layout.video.removeEventListener("error", onVideoError);
								for (let timeout in MediaPlayer.Module.timeouts) {
										window.clearTimeout(timeout);
								}
								MediaPlayer.layout.div_media.style.cursor = "initial";
								MediaPlayer.Module.playbackResumed = false;
								MediaPlayer.Module.layout.video.style.display = "none";
								MediaPlayer.Module.layout.video.pause();
								break;
						case MediaPlayer.STATE.MEDIA_LOADED:
								MediaPlayer.Module.layout.video.style.display = "initial";
								break;
				}
		};
		MediaPlayer.Module.setMedia = function(index, resume) {
				console.log("Setting media...", index);
				MediaPlayer.setState(MediaPlayer.STATE.SETTING_MEDIA);
				MediaPlayer.Module.resume = resume;
				MediaPlayer.Module.layout.video.addEventListener("error", onVideoError, false);
				MediaPlayer.Module.layout.video.src = MediaPlayer.sourceData.medias[index].url;
		};
		MediaPlayer.Module.getMediaIndex = function() {
				let mediaIndex = 0;
				let targetQuality = parseInt(MediaPlayer.Module.Storage.preferences.playback.quality.slice(0, -1));
				let lastAbs = 0;
				for (let i = 0; i < MediaPlayer.layout.select_media.options.length; i++) {
						let option = MediaPlayer.layout.select_media.options[i];
						let quality = parseInt(option.text.slice(0, -1));
						if (Number.isNaN(quality)) {
								continue;
						} else {
								let abs = Math.abs(targetQuality - quality);
								if (quality === targetQuality) {
										mediaIndex = i;
										break;
								} else if (lastAbs === 0 || lastAbs > abs) {
										lastAbs = abs;
										mediaIndex = i;
								}
						}
				}
				return mediaIndex;
		};
}).call(MediaPlayer.Module);
