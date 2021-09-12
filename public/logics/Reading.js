(function() {
    function goPage(index) {
        if (index >= 0 && index <= MediaPlayer.layout.select_media.options.length - 1) {
            MediaPlayer.layout.select_media.options[index].selected = true;
            MediaPlayer.Module.setMedia(MediaPlayer.layout.select_media.selectedIndex);
        }
    }

    function nextPage() {
        goPage(MediaPlayer.layout.select_media.selectedIndex + 1);
    }
    // TODO
    function onImageError(event) {
        console.log("Error", event);
        console.log("Attempting to resume playback...");
        if (MediaPlayer.Module.retryAttempts === 5) {
            if (MediaPlayer.linksBlacklist.indexOf(MediaPlayer.Module.layout.img.src) === -1) {
                MediaPlayer.linksBlacklist.push(MediaPlayer.Module.layout.img.src);
            }
            MediaPlayer.Module.retryAttempts++;
            MediaPlayer.setEpisode(MediaPlayer.layout.select_episode.selectedIndex, true, true);
        } else if (MediaPlayer.Module.retryAttempts < 5 && (MediaPlayer.state === MediaPlayer.STATE.SETTING_MEDIA || MediaPlayer.state === MediaPlayer.STATE.MEDIA_LOADED)) {
            MediaPlayer.Module.timeouts.retryTimeout = setTimeout(function() {
                MediaPlayer.Module.retryAttempts++;
                MediaPlayer.Module.setMedia(MediaPlayer.layout.select_media.selectedIndex, true);
            }, 500);
        } else {
            MediaPlayer.setState(MediaPlayer.STATE.MEDIA_NOT_FOUND);
        }
    }

    function previousPage() {
        goPage(MediaPlayer.layout.select_media.selectedIndex - 1);
    }
    // TODO
    MediaPlayer.Module.SHORTCUTS = {
        37: function(event) {
            if (event.ctrlKey === false) {
                nextPage();
            }
        },
        39: function(event) {
            if (event.ctrlKey === false) {
                previousPage();
            }
        }
    };
    MediaPlayer.Module.SOURCES = [{
        "name": "General #1",
        "module": "Reading",
        "id": "fa583cd2-555c-11e5-885d-feff819cdc9f",
        "language": 0,
        "format": 2,
        "parameters": {},
        "titlesmatcher": {
            "protocol": "http",
            "domain": "kissmanga.com",
            "map": {},
            "regex": {
                "url": /http:\/\/kissmanga\.to\/Manga\/([^\/]+)/
            }
        },
        "buildURL": function(title) {
            return "http://kissmanga.com/Manga/".concat(title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, "").replace(/[-]+/g, "-").replace(/^-+|-+$/g, ""));
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
                            Helpers.solveChallenge(xhttp.responseXML.documentElement.innerHTML, "kissmanga.com", function() {
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
            return new Promise(function(resolve, reject) {
                let xhttp = new XMLHttpRequest();
                MediaPlayer.xhttp = xhttp;
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            let medias = [];
                            let match_pages = xhttp.responseText;
                            let match;
                            let i = 0;
                            let regex = /lstImages\.push\(['"](.*?)['"]\);/g;
                            while ((match = regex.exec(xhttp.responseText)) !== null) {
                                medias.push({
                                    label: "Page ".concat(i + 1),
                                    url: match[1]
                                });
                                i++;
                            }
                            if (medias.length > 0) {
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
                            Helpers.solveChallenge(xhttp.responseXML.documentElement.innerHTML, "kissmanga.com", function()  {
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
                xhttp.send();
            });
        }
    }, {
        "name": "General #2",
        "module": "Reading",
        "id": "13894ab2-9189-11e5-8994-feff819cdc9f",
        "parameters": {},
        "language": 0,
        "format": 2,
        "titlesmatcher": {
            "protocol": "http",
            "domain": "www.mangahit.com",
            "map": {},
            "regex": {
                "url": /http:\/\/www\.mangahit\.com\/manga\/([^\/]+)/
            }
        },
        "buildURL": function(title) {
            return "http://www.mangahit.com/manga/".concat(title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, "").replace(/[-]+/g, "-").replace(/^-+|-+$/g, ""));
        },
        "getEpisodes": function(url) {
            return new Promise(function(resolve, reject) {
                let xhttp = new XMLHttpRequest();
                MediaPlayer.xhttp = xhttp;
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            let chaptersLinks = xhttp.responseXML.querySelectorAll(".scope.records a");
                            if (chaptersLinks.length > 0) {
                                let episodes = [];
                                for (let i = 0; i < chaptersLinks.length; i++) {
                                    episodes.push({
                                        title: chaptersLinks[i].textContent,
                                        url: chaptersLinks[i].href
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
            return new Promise(function(resolve, reject) {
                let xhttp = new XMLHttpRequest();
                MediaPlayer.xhttp = xhttp;
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            // TODO
                            let medias = [];
                            let pages = xhttp.responseXML.querySelector("select#pages");
                            let img = xhttp.responseXML.querySelector(".chapter-viewer img");
                            if (pages.options.length > 0 && img !== null) {
                                let pattern = img.src;
                                let regex = /http:\/\/img\.mangahit\.com\/manga\/([0-9]+)\/([0-9]+)\/01\.jpg/;
                                for (let i = 0; i < pages.options.length; i++) {
                                    medias.push({
                                        label: "Page ".concat(pages.options[i].value),
                                        url: pattern.replace(regex, "http://img.mangahit.com/manga/$1/$2/".concat(Helpers.pad(i + 1, 2)).concat(".jpg"))
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
                        } else if (typeof xhttp.aborted === "undefined") {
                            resolve({
                                status: "network_error",
                                medias: []
                            });
                        }
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.responseType = 'document';
                xhttp.send();
            });
        }
    }];
    MediaPlayer.Module.attach = function() {
        console.log("Attaching module...");
        return new Promise(function(resolve, reject) {
            MediaPlayer.Module.Storage = Storage.store.Reading;
            MediaPlayer.layout.div_media.addEventListener("scroll", function(event) {
                if (MediaPlayer.state === MediaPlayer.STATE.MEDIA_LOADED) {
                    MediaPlayer.Module.sourceData.page.scrollTop = MediaPlayer.layout.div_media.scrollTop;
                    Storage.save();
                    MediaPlayer.historyEntry.updated_at = Date.now();
                    Storage.save();
                } else {
                    MediaPlayer.layout.div_media.scrollTop = 0;
                }
            }, false);
            MediaPlayer.Module.layout.img = document.createElement("img");
            MediaPlayer.Module.layout.img.className = "main";
            MediaPlayer.Module.layout.img_placeholder = MediaPlayer.Module.layout.img.cloneNode();
            MediaPlayer.Module.layout.img_placeholder.className = "placeholder";
            MediaPlayer.Module.layout.img.addEventListener("click", function(event) {
                if (MediaPlayer.Module.layout.img.getAttribute("data-cursor") === "left") {
                    nextPage();
                } else if (MediaPlayer.Module.layout.img.getAttribute("data-cursor") === "right") {
                    previousPage();
                }
            }, false);
            MediaPlayer.Module.layout.img.addEventListener("error", onImageError, false);
            MediaPlayer.Module.layout.img.addEventListener("mousemove", function(event) {
                if (MediaPlayer.state === MediaPlayer.STATE.MEDIA_LOADED) {
                    let offsetX = event.offsetX;
                    let halfWidth = MediaPlayer.Module.layout.img.width / 2;
                    if (halfWidth > offsetX + (halfWidth / 2) && MediaPlayer.layout.select_media.selectedIndex < MediaPlayer.layout.select_media.options.length - 1) {
                        MediaPlayer.Module.layout.img.setAttribute("data-cursor", "left");
                    } else if (offsetX - (halfWidth / 2) > halfWidth && MediaPlayer.layout.select_media.selectedIndex > 0) {
                        MediaPlayer.Module.layout.img.setAttribute("data-cursor", "right");
                    } else {
                        MediaPlayer.Module.layout.img.removeAttribute("data-cursor");
                    }
                }
            }, false);
            MediaPlayer.Module.layout.img.addEventListener("load", function(event) {
                console.log("load");
                MediaPlayer.setState(MediaPlayer.STATE.MEDIA_LOADED);
                MediaPlayer.Module.layout.img.style.display = "block";
                MediaPlayer.Module.layout.img_placeholder.src = MediaPlayer.Module.layout.img.src;
                MediaPlayer.Module.layout.img_placeholder.style.display = "none";
                if (MediaPlayer.Module.resume === true) {
                    console.log("Resuming reading...");
                    MediaPlayer.layout.div_media.scrollTop = MediaPlayer.Module.sourceData.page.scrollTop;
                }
                MediaPlayer.layout.div_media.focus();
            }, false);
            MediaPlayer.Module.layout.img.setAttribute("data-pin-no-hover", "true");
            MediaPlayer.layout.div_media.appendChild(MediaPlayer.Module.layout.img);
            MediaPlayer.layout.div_media.appendChild(MediaPlayer.Module.layout.img_placeholder);
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
                MediaPlayer.Module.layout.img.removeEventListener("error", onImageError);
                for (let timeout in MediaPlayer.Module.timeouts) {
                    window.clearTimeout(timeout);
                }
                MediaPlayer.layout.div_media.scrollTop = 0;
                break;
        }
    };
    MediaPlayer.Module.setMedia = function(index, resume) {
        console.log("Setting media...", index);
        MediaPlayer.setState(MediaPlayer.STATE.SETTING_MEDIA);
        let pages = MediaPlayer.Module.sourceData.episode.pages;
        if (pages) {
            let page = pages.find(function(page) {
                return page.label === MediaPlayer.sourceData.medias[index].label && page.url === MediaPlayer.sourceData.medias[index].url;
            });
            if (typeof page !== "undefined") {
                MediaPlayer.Module.sourceData.page = page;
                MediaPlayer.Module.sourceData.page.accessed_at = Date.now();
            } else {
                let page = {
                    label: MediaPlayer.sourceData.medias[index].label,
                    url: MediaPlayer.sourceData.medias[index].url,
                    created_at: Date.now(),
                    accessed_at: Date.now(),
                    updated_at: Date.now(),
                    scrollTop: 0
                };
                pages.push(page);
                Storage.save();
                MediaPlayer.Module.sourceData.page = page;
            }
        } else {
            MediaPlayer.Module.sourceData.episode.pages = [];
            Storage.save();
            pages = MediaPlayer.Module.sourceData.episode.pages;
            pages.push({
                label: MediaPlayer.sourceData.medias[index].label,
                url: MediaPlayer.sourceData.medias[index].url,
                created_at: Date.now(),
                updated_at: Date.now(),
                accessed_at: Date.now(),
                scrollTop: 0
            });
            Storage.save();
            MediaPlayer.Module.sourceData.page = pages[pages.length - 1];
        }
        MediaPlayer.historyEntry.updated_at = Date.now();
        Storage.save();
        MediaPlayer.Module.resume = resume === true;
        MediaPlayer.Module.layout.img.addEventListener("error", onImageError, false);
        MediaPlayer.Module.layout.img.src = MediaPlayer.sourceData.medias[index].url;
    };
    MediaPlayer.Module.getMediaIndex = function() {
        let mediaIndex = 0;
        if (typeof MediaPlayer.historyEntry.episodes[MediaPlayer.historyEntry.episodes.length - 1].pages !== "undefined") {
            let pages = MediaPlayer.historyEntry.episodes[MediaPlayer.historyEntry.episodes.length - 1].pages;
            let date = 0;
            let lastReadPage;
            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];
                if (page.accessed_at > date) {
                    lastReadPage = page;
                }
                date = page.accessed_at;
            }
            for (let i = 0; i < MediaPlayer.layout.select_media.options.length; i++) {
                let option = MediaPlayer.layout.select_media.options[i];
                if (option.text === lastReadPage.label && option.value === lastReadPage.url) {
                    mediaIndex = i;
                    break;
                }
            }
        }
        return mediaIndex;
    };
}).call(MediaPlayer.Module);
