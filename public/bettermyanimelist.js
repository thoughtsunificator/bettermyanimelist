(function() {
		let button_openMediaPlayer;
		let observer = new MutationObserver(function(mutations) {
				for (let i = mutations.length; i--;) {
						let mutation = mutations[i];
						for (let ii = mutation.addedNodes.length; ii--;) {
								let addedNode = mutation.addedNodes[ii];
								if (addedNode.id === "searchBar" && addedNode.querySelector("#topSearchText") !== null && addedNode.querySelector("#topSearchValue") !== null) {
										addedNode.querySelector("#topSearchValue").options[1].selected = true;
										let autocomplete = document.createElement("div");
										autocomplete.id = "autocomplete";
										autocomplete.cloak = document.createElement("div");
										autocomplete.cloak.className = "cloak";
										autocomplete.cloak.addEventListener("click", function(event) {
												if (typeof autocomplete.xmlhttp !== "undefined") {
														autocomplete.xmlhttp.abort();
												}
												document.querySelector("#searchBar").style.position = "";
												document.querySelector("#searchBar").style.zIndex = "";
												autocomplete.classList.remove("onResult");
												autocomplete.classList.remove("onMessage");
										}, false);
										let message = document.createElement("div");
										message.className = "message";
										autocomplete.appendChild(message);
										let entries = document.createElement("div");
										entries.className = "entries";
										autocomplete.appendChild(entries);
										addedNode.parentNode.appendChild(autocomplete);
										autocomplete.appendChild(autocomplete.cloak);
										autocomplete.type = addedNode.querySelector("#topSearchValue").selectedIndex;
										autocomplete.query = "";
										let searchInput = addedNode.querySelector("#topSearchText")
										searchInput.setAttribute("id", "topSearchText2")
										// searchInput.setAttribute("id", "topSearchText")
										window.addEventListener("input", function(event) {
											if(event.target === searchInput) {
												event.stopImmediatePropagation();
												if (typeof autocomplete.xmlhttp !== "undefined") {
														autocomplete.xmlhttp.abort();
												}
												autocomplete.query = event.target.value;
												if (autocomplete.query.trim() !== "" && autocomplete.type in Autocomplete.TYPES.CONTENT && /^(anime|manga)$/.test(Autocomplete.TYPES.CONTENT[autocomplete.type]) === true) {
														Autocomplete.search(autocomplete);
												} else {
														document.querySelector("#searchBar").style.position = "";
														document.querySelector("#searchBar").style.zIndex = "";
														autocomplete.classList.remove("onResult");
														autocomplete.classList.remove("onMessage");
												}
											}
										})
										searchInput.addEventListener("click", function(event) {
												if (autocomplete.classList.contains("onMessage") === false && autocomplete.classList.contains("onResult") === false && autocomplete.query.trim() !== "" && autocomplete.type in Autocomplete.TYPES.CONTENT && /^(anime|manga)$/.test(Autocomplete.TYPES.CONTENT[autocomplete.type]) === true) {
														if (autocomplete.querySelector(".message").textContent !== "" && autocomplete.querySelector(".entries").childNodes.length === 0) {
																document.querySelector("#searchBar").style.position = "relative";
																document.querySelector("#searchBar").style.zIndex = "102";
																autocomplete.classList.add("onMessage");
														} else {
																document.querySelector("#searchBar").style.position = "relative";
																document.querySelector("#searchBar").style.zIndex = "102";
																autocomplete.classList.add("onResult");
														}
												}
										}, false);
										addedNode.querySelector("#topSearchValue").addEventListener("change", function(event) {
												if (typeof autocomplete.xmlhttp !== "undefined") {
														autocomplete.xmlhttp.abort();
												}
												autocomplete.type = event.target.selectedIndex;
												if (autocomplete.query.trim() !== "" && autocomplete.type in Autocomplete.TYPES.CONTENT && /^(anime|manga)$/.test(Autocomplete.TYPES.CONTENT[autocomplete.type]) === true) {
														Autocomplete.search(autocomplete);
												} else {
														document.querySelector("#searchBar").style.position = "";
														document.querySelector("#searchBar").style.zIndex = "";
														autocomplete.classList.remove("onResult");
														autocomplete.classList.remove("onMessage");
												}
										}, false);
								}
								if (addedNode.tagName === "TEXTAREA" && addedNode.parentNode.id !== "bbCodeToolbarWrapper" && (/<a.*?>.*?bbcode.*?<\/a>/i.test(addedNode.parentNode.innerHTML) === true || window.location.pathname === "/forum/" && /^\?action=message&topic_id=/.test(window.location.search) || typeof addedNode.parentNode.name !== "undefined" && addedNode.parentNode.name === "UserComment")) {
										/* Toolbar */
										let toolbar = document.createElement("div");
										toolbar.className = 'bbCodetoolbar';
										toolbar.textArea = addedNode;
										toolbar.textArea.history = [];
										/* Buttons wrapper */
										toolbar.buttonsWrapper = document.createElement('div');
										toolbar.buttonsWrapper.className = 'buttons';
										for (let iii = 0; iii < BBcode.BUTTONS.length; iii++) {
												let button = document.createElement('button');
												button.className = 'bmalSuitable';
												button.title = BBcode.BUTTONS[iii].title;
												button.toolbar = toolbar;
												// FIXME
												button.obj = BBcode.BUTTONS[iii];
												button.innerHTML = "<i class='" + BBcode.BUTTONS[iii].icon + "'></i>";
												button.addEventListener("click", function(event) {
														event.preventDefault();
														this.toolbar.textArea.focus();
														if (this.obj.tag) {
																BBcode.wrapValue(this.obj, this.toolbar.textArea);
														} else {
																console.log(this.obj);
																this.obj.action.call(this);
														}
												}, false);
												toolbar.buttonsWrapper.appendChild(button);
										}
										toolbar.appendChild(toolbar.buttonsWrapper);
										/* HTML div */
										toolbar.htmlDiv = document.createElement('div');
										toolbar.htmlDiv.style.cssText = window.getComputedStyle(toolbar.textArea).cssText;
										toolbar.htmlDiv.style['-webkit-user-modify'] = '';
										toolbar.htmlDiv.style.width = '';
										toolbar.htmlDiv.className = 'html';
										toolbar.htmlDiv.style.display = 'none';
										toolbar.htmlDiv = toolbar.htmlDiv;
										toolbar.appendChild(toolbar.htmlDiv);
										/* Wraps textarea inside bbCodeToolbarWrapper */
										toolbar.textArea.parentNode.insertBefore(toolbar, toolbar.textArea);
										toolbar.appendChild(toolbar.textArea);
								}
								if (addedNode.id === "horiznav_nav") {
										let li_clone_details = addedNode.querySelector("ul li").cloneNode(true);
										button_openMediaPlayer = li_clone_details.firstChild;
										button_openMediaPlayer.id = "mediaPlayer_button";
										button_openMediaPlayer.href = "javascript:;";
										button_openMediaPlayer.innerHTML = "<i class='fa fa-television'></i>";
										button_openMediaPlayer.title = "Open MediaPlayer";
										button_openMediaPlayer.addEventListener("click", function(event) {
												if (MediaPlayer.isOpen === false) {
														MediaPlayer.open().then(function(node) {
																document.body.appendChild(node);
																MediaPlayer.layout.select_source.focus();
														});
												} else if (MediaPlayer.isOpen === true) {
														MediaPlayer.maximize();
												}
										}, false);
										li_clone_details.appendChild(button_openMediaPlayer);
										addedNode.querySelector("ul").insertBefore(li_clone_details, addedNode.querySelector("ul li"));
								} else if (addedNode.tagName === "H2" && addedNode.textContent.toLowerCase() === "information") {
										if (window.location.hash === "#mediaplayer") {
												if (MediaPlayer.isOpen === false) {
														MediaPlayer.open().then(function(node) {
																document.body.appendChild(node);
																MediaPlayer.layout.select_source.focus();
														});
												}
										}
								}
						}
				}
		});
		observer.observe(document.documentElement, {
				childList: true,
				subtree: true
		});
		window.addEventListener("popstate", function(event) {
				if (window.location.hash === "#mediaplayer") {
						if (MediaPlayer.isOpen === false) {
								MediaPlayer.open().then(function(node) {
										document.body.appendChild(node);
										MediaPlayer.layout.select_source.focus();
								});
						}
				} else {
						if (MediaPlayer.isOpen === true) {
								MediaPlayer.close();
						}
				}
		}, false);
})();
