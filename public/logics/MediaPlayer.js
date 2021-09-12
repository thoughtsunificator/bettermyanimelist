(function() {
    function goTo(index) {
        if (index >= 0 && index <= MediaPlayer.layout.select_episode.options.length - 1) {
            MediaPlayer.layout.select_episode.options[index].selected = true;
            MediaPlayer.setEpisode(MediaPlayer.layout.select_episode.selectedIndex, false);
        }
    }

    function setSource(index) {
        console.log("Setting source...");
        MediaPlayer.setState(MediaPlayer.STATE.SETTING_SOURCE);
        MediaPlayer.source = MediaPlayer.Module.SOURCES.find(function(source) {
            return source.id === MediaPlayer.layout.select_source.options[MediaPlayer.layout.select_source.selectedIndex].value;
        });
        MediaPlayer.Module.Storage.preferences.sourceId = MediaPlayer.source.id;
        console.log("MediaPlayer.Module.Storage.preferences.sourceId=" + MediaPlayer.Module.Storage.preferences.sourceId);
        Storage.save();
        Helpers.runGenerator(function*() {
            var { found, response, url } = yield TitlesMatcher.find(MediaPlayer.mediadata.id, MediaPlayer.mediadata.titles, MediaPlayer.source);
            if (found === true) {
                MediaPlayer.sourceData.url_episodes = url;
                MediaPlayer.sourceData.original_episodes = response.episodes;
                response.episodes.sort(function(episodeA, episodeB) {
                    return episodeA.title.localeCompare(episodeB.title, "en", {
                        numeric: true
                    });
                });
                response.episodes = response.episodes.map(function(episode) {
                    episode.title = episode.title.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim();
                    return episode;
                });
                MediaPlayer.sourceData.episodes = response.episodes;
                MediaPlayer.historyEntry = Helpers.getHistoryEntry(MediaPlayer.mediadata.id, MediaPlayer.source.id);
                if (typeof MediaPlayer.historyEntry === "undefined") {
                    console.log("Adding a new entry to the history...");
                    MediaPlayer.historyEntry = {
                        id: MediaPlayer.mediadata.id,
                        title: MediaPlayer.mediadata.titles[0],
                        sourceID: MediaPlayer.source.id,
                        url: window.location.href,
                        updated_at: Date.now(),
                        created_at: Date.now(),
                        accessed_at: Date.now(),
                        episodes: []
                    };
                    Storage.store.MediaPlayer.history.entries.push(MediaPlayer.historyEntry);
                    Storage.save();
                } else {
                    MediaPlayer.historyEntry.accessed_at = Date.now();
                    Storage.save();
                }
                let lastWatchedEpisode;
                let lastWatchedEpisodeDate = 0;
                console.log("Looking for the last episode watched ", MediaPlayer.historyEntry.episodes);
                let titlesWatched = [];
                for (let i = 0; i < MediaPlayer.historyEntry.episodes.length; i++) {
                    let episode = MediaPlayer.historyEntry.episodes[i];
                    if (episode.accessed_at > lastWatchedEpisodeDate) {
                        lastWatchedEpisode = episode;
                    }
                    lastWatchedEpisodeDate = episode.accessed_at;
                    titlesWatched.push(episode.title);
                }
                if (typeof lastWatchedEpisode !== "undefined") {
                    console.log("Last episode watched on " + new Date(), lastWatchedEpisode);
                }
                for (let i = 0; i < response.episodes.length; i++) {
                    let episode = response.episodes[i];
                    let option = document.createElement("option");
                    option.text = episode.title;
                    option.value = episode.url;
                    if (typeof lastWatchedEpisode !== "undefined" && episode.title === lastWatchedEpisode.title) {
                        option.selected = true;
                    }
                    if (titlesWatched.indexOf(episode.title) !== -1) {
                        option.classList.add("watched");
                    }
                    MediaPlayer.layout.select_episode.appendChild(option);
                }
                MediaPlayer.layout.div_sourceControls.repaint();
                MediaPlayer.setEpisode(MediaPlayer.layout.select_episode.selectedIndex, true);
            } else {
                console.log("Episode not found.", response);
                MediaPlayer.setState(MediaPlayer.STATE.MEDIA_NOT_FOUND);
            }
        });
    }

    function setSourceFormat(index) {
        MediaPlayer.layout.select_source_language.innerHTML = "";
        MediaPlayer.layout.select_source.innerHTML = "";
        MediaPlayer.layout.div_sourceControls.repaint();
        let sourceLanguages = MediaPlayer.Module.SOURCES.filter(function(source) {
            return source.format === MediaPlayer.layout.select_source_format.options[index].textContent;
        }).map(function(source) {
            return source.language;
        }).filter(function(sourceLanguage, index, array) {
            return array.indexOf(sourceLanguage) === index;
        });
        for (let sourceLanguage of sourceLanguages) {
            let option = document.createElement("option");
            option.textContent = sourceLanguage;
            MediaPlayer.layout.select_source_language.appendChild(option);
        }
    }

    function setSourceLanguage(index) {
        MediaPlayer.layout.select_source.innerHTML = "";
        MediaPlayer.layout.div_sourceControls.repaint();
        let sources = MediaPlayer.Module.SOURCES.filter(function(source) {
            return source.format === MediaPlayer.layout.select_source_format.options[MediaPlayer.layout.select_source_format.selectedIndex].textContent && source.language === MediaPlayer.layout.select_source_language.options[index].textContent;
        });
        for (let source of sources) {
            let option = document.createElement("option");
            option.textContent = source.name;
            option.value = source.id;
            if (source.id === MediaPlayer.Module.Storage.preferences.sourceId) {
                option.selected = true;
            }
            MediaPlayer.layout.select_source.appendChild(option);
        }
    }

    function onShortcut(event) {
        if (event.keyCode in MediaPlayer.SHORTCUTS) {
            MediaPlayer.SHORTCUTS[event.keyCode].call(this, event);
        } else if (event.keyCode in MediaPlayer.Module.SHORTCUTS) {
            MediaPlayer.Module.SHORTCUTS[event.keyCode].call(this, event);
        }
    }
    MediaPlayer.SHORTCUTS = {
        27: function(event) {
            if (event.ctrlKey === false) {
                if (document.webkitFullscreenElement !== null) {
                    MediaPlayer.toggleFullscreen();
                } else {
                    MediaPlayer.close();
                }
            }
        },
        33: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.previous();
            }
        },
        34: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.next();
            }
        },
        82: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.layout.button_refresh.click();
            }
        },
        84: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.layout.button_light_off.click();
            }
        },
        97: function(event) {
            if (event.ctrlKey === false) {
                let index = MediaPlayer.layout.select_source.selectedIndex - 1;
                if (index >= 0 && index <= MediaPlayer.layout.select_source.options.length - 1) {
                    MediaPlayer.layout.select_source.options[index].selected = true;
                    setSource(index);
                }
            }
        },
        99: function(event) {
            if (event.ctrlKey === false) {
                let index = MediaPlayer.layout.select_source.selectedIndex + 1;
                if (index >= 0 && index <= MediaPlayer.layout.select_source.options.length - 1) {
                    MediaPlayer.layout.select_source.options[index].selected = true;
                    setSource(index);
                }
            }
        },
        100: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.previous();
            }
        },
        102: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.next();
            }
        },
        103: function(event) {
            if (event.ctrlKey === false) {
                let index = MediaPlayer.layout.select_media.selectedIndex - 1;
                if (index >= 0 && index <= MediaPlayer.layout.select_media.options.length - 1) {
                    MediaPlayer.layout.select_media.options[index].selected = true;
                    MediaPlayer.Module.setMedia(index, false);
                }
            }
        },
        105: function(event) {
            if (event.ctrlKey === false) {
                let index = MediaPlayer.layout.select_media.selectedIndex + 1;
                if (index >= 0 && index <= MediaPlayer.layout.select_media.options.length - 1) {
                    MediaPlayer.layout.select_media.options[index].selected = true;
                    MediaPlayer.Module.setMedia(index, false);
                }
            }
        },
        70: function(event) {
            if (event.ctrlKey === false) {
                MediaPlayer.toggleFullscreen();
                MediaPlayer.Module.layout.div_controlsBar.show();
            }
        }
    };
    MediaPlayer.STATE = {
        MEDIA_NOT_FOUND: "MEDIA_NOT_FOUND",
        DEFAULT: "DEFAULT",
        INITIALIZING_PLAYER: "INITIALIZING_PLAYER",
        SETTING_SOURCE: "SETTING_SOURCE",
        SETTING_EPISODE: "SETTING_EPISODE",
        SETTING_MEDIA: "SETTING_MEDIA",
        MEDIA_LOADED: "MEDIA_LOADED"
    };
    MediaPlayer.isOpen = false;
    MediaPlayer.layout = {};
    MediaPlayer.Module = {}
    MediaPlayer.Module.layout = {};
    MediaPlayer.Module.playbackResumed = false;
    MediaPlayer.Module.resume = true;
    MediaPlayer.Module.retryAttempts = 0;
    MediaPlayer.Module.sourceData = {};
    MediaPlayer.Module.timeouts = {};
    MediaPlayer.sourceData = {};
    MediaPlayer.state = MediaPlayer.STATE.DEFAULT;
    MediaPlayer.close = function() {
        // TODO
        console.log("Closing MediaPlayer...");
        window.removeEventListener("keydown", onShortcut);
        MediaPlayer.layout.superNode.parentNode.removeChild(MediaPlayer.layout.superNode);
        for (let timeout in MediaPlayer.Module.timeouts) {
            window.clearTimeout(timeout);
        }
        MediaPlayer.isOpen = false;
        MediaPlayer.layout = {};
        MediaPlayer.sourceData = {};
        MediaPlayer.Module.sourceData = {};
        MediaPlayer.state = MediaPlayer.STATE.DEFAULT;
        window.location.hash = "";
        document.body.classList.remove("mediaplayer-open");
        MediaPlayer.documentActiveElement.focus();
    };
    MediaPlayer.maximize = function() {
        console.log("Maximizing MediaPlayer...");
        MediaPlayer.layout.button_minimize.innerHTML = "<i class='fa fa-compress'></i>";
        MediaPlayer.layout.button_minimize.removeEventListener("click", MediaPlayer.maximize);
        MediaPlayer.layout.button_minimize.addEventListener("click", MediaPlayer.minimize, false);
        MediaPlayer.layout.button_minimize.title = "Minimize";
        MediaPlayer.layout.button_light_off.style.display = "block";
        MediaPlayer.layout.superNode.classList.remove("minimized");
        document.body.classList.add("mediaplayer-open");
        window.addEventListener("keydown", onShortcut, false);
    };
    MediaPlayer.minimize = function() {
        console.log("Minimizing MediaPlayer...");
        MediaPlayer.layout.button_minimize.innerHTML = "<i class='fa fa-expand'></i>";
        MediaPlayer.layout.button_minimize.removeEventListener("click", MediaPlayer.minimize);
        MediaPlayer.layout.button_minimize.addEventListener("click", MediaPlayer.maximize, false);
        MediaPlayer.layout.button_minimize.title = "Maximize";
        MediaPlayer.layout.button_light_off.style.display = "none";
        MediaPlayer.layout.superNode.classList.add("minimized");
        document.body.classList.remove("mediaplayer-open");
        window.removeEventListener("keydown", onShortcut);
    };
    MediaPlayer.next = function() {
        goTo(MediaPlayer.layout.select_episode.selectedIndex + 1);
    };
    MediaPlayer.open = function() {
        console.log("Opening MediaPlayer...");
        MediaPlayer.isOpen = true;
        return new Promise(function(resolve, reject) {
            Storage.init().then(function() {
                MediaPlayer.mediadata = {
                    id: parseInt(window.location.href.match(/^https?:\/\/(www\.)?myanimelist\.net\/(anime|manga)(\/|\.php\?id=)([0-9]+)/)[4]),
                    titles: [document.querySelector("#contentWrapper span[itemprop=name]").textContent.trim()]
                };
                let enligshTitles = document.body.innerHTML.match(/<span class=['"]dark_text['"]>english:<\/span>(.*?)(<\/div>|\n)/i);
                let synonyms = document.body.innerHTML.match(/<span class=['"]dark_text['"]>synonyms:<\/span>(.*?)(<\/div>|\n)/i);
                if (enligshTitles) {
                    MediaPlayer.mediadata.titles = MediaPlayer.mediadata.titles.concat(enligshTitles[1].trim().split(","));
                }
                if (synonyms) {
                    MediaPlayer.mediadata.titles = MediaPlayer.mediadata.titles.concat(synonyms[1].trim().split(","));
                }
                MediaPlayer.mediadata.titles = MediaPlayer.mediadata.titles.filter(function(title, pos) {
                    return MediaPlayer.mediadata.titles.indexOf(title) === pos;
                });
                MediaPlayer.mediadata.titles = MediaPlayer.mediadata.titles.map(function(title) {
                    return title.trim();
                });
                MediaPlayer.documentActiveElement = document.activeElement;
                document.body.classList.add("mediaplayer-open");
                window.location.hash = "#mediaplayer";
                MediaPlayer.layout.superNode = document.createElement("div");
                MediaPlayer.layout.superNode.id = "mediaPlayer";
                MediaPlayer.layout.superNode.className = "interactiveMode";
                resolve(MediaPlayer.layout.superNode);
                MediaPlayer.layout.div_sourceControls = document.createElement("div");
                MediaPlayer.layout.div_sourceControls.className = "sourceControls";
                MediaPlayer.layout.div_sourceControls.repaint = function() {
                    MediaPlayer.layout.button_previous.disabled = MediaPlayer.layout.select_episode.selectedIndex <= 0;
                    MediaPlayer.layout.button_next.disabled = MediaPlayer.layout.select_episode.selectedIndex === MediaPlayer.layout.select_episode.options.length - 1;
                    MediaPlayer.layout.div_sourceControls.style.display = 'none';
                    MediaPlayer.layout.div_sourceControls.offsetHeight;
                    MediaPlayer.layout.div_sourceControls.style.display = '';
                };
                MediaPlayer.layout.cloak = document.createElement("div");
                MediaPlayer.layout.cloak.className = "cloak";
                if (Storage.store.MediaPlayer.preferences.lightOff === true) {
                    MediaPlayer.layout.cloak.classList.add("light_off");
                }
                MediaPlayer.layout.cloak.addEventListener("click", function(event) {
                    MediaPlayer.close();
                }, false);
                MediaPlayer.layout.superNode.appendChild(MediaPlayer.layout.cloak);
                MediaPlayer.layout.select_source_format = document.createElement("select");
                MediaPlayer.layout.select_source_format.className = "bmalSuitable";
                MediaPlayer.layout.select_source_format.tabIndex = "1";
                MediaPlayer.layout.select_source_format.addEventListener("change", function(event) {
                    setSourceFormat(MediaPlayer.layout.select_source_format.selectedIndex);
                    setSourceLanguage(0);
                    setSource(0);
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.select_source_format);
                MediaPlayer.layout.select_source_language = document.createElement("select");
                MediaPlayer.layout.select_source_language.className = "bmalSuitable";
                MediaPlayer.layout.select_source_language.tabIndex = "1";
                MediaPlayer.layout.select_source_language.addEventListener("change", function(event) {
                    setSourceLanguage(MediaPlayer.layout.select_source_language.selectedIndex);
                    setSource(0);
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.select_source_language);
                MediaPlayer.layout.select_source = document.createElement("select");
                MediaPlayer.layout.select_source.className = "bmalSuitable";
                MediaPlayer.layout.select_source.tabIndex = "1";
                MediaPlayer.layout.select_source.addEventListener("change", function(event) {
                    setSource(MediaPlayer.layout.select_source.selectedIndex);
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.select_source);
                MediaPlayer.layout.superNode.appendChild(MediaPlayer.layout.div_sourceControls);
                MediaPlayer.layout.button_previous = document.createElement("button");
                MediaPlayer.layout.button_previous.tabIndex = "2";
                MediaPlayer.layout.button_previous.className = "bmalSuitable";
                MediaPlayer.layout.button_previous.innerHTML = "<i class='fa fa-step-backward'></i>";
                MediaPlayer.layout.button_previous.title = "Previous";
                MediaPlayer.layout.button_previous.addEventListener("click", function(event) {
                    MediaPlayer.previous();
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.button_previous);
                MediaPlayer.layout.select_episode = document.createElement("select");
                MediaPlayer.layout.select_episode.className = "bmalSuitable";
                MediaPlayer.layout.select_episode.tabIndex = "3";
                MediaPlayer.layout.select_episode.addEventListener("change", function(event) {
                    goTo(MediaPlayer.layout.select_episode.selectedIndex);
                });
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.select_episode);
                MediaPlayer.layout.button_next = document.createElement("button");
                MediaPlayer.layout.button_next.className = "bmalSuitable";
                MediaPlayer.layout.button_next.tabIndex = "4";
                MediaPlayer.layout.button_next.innerHTML = "<i class='fa fa-step-forward'></i>";
                MediaPlayer.layout.button_next.title = "Next";
                MediaPlayer.layout.button_next.addEventListener("click", function(event) {
                    MediaPlayer.next();
                });
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.button_next);
                MediaPlayer.layout.select_media = document.createElement("select");
                MediaPlayer.layout.select_media.className = "bmalSuitable";
                MediaPlayer.layout.select_media.tabIndex = "5";
                MediaPlayer.layout.select_media.addEventListener("change", function(event) {
                    MediaPlayer.Module.setMedia(MediaPlayer.layout.select_media.selectedIndex, true);
                });
                let select_media_observer = new MutationObserver(function(mutations) {
                    let event = document.createEvent("Event");
                    event.initEvent("mutations", true, true);
                    MediaPlayer.layout.select_media.dispatchEvent(event);
                });
                select_media_observer.observe(MediaPlayer.layout.select_media, {
                    childList: true,
                    subtree: true
                });
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.select_media);
                MediaPlayer.layout.button_minimize = document.createElement("button");
                MediaPlayer.layout.button_minimize.className = "bmalSuitable";
                MediaPlayer.layout.button_minimize.tabIndex = "6";
                MediaPlayer.layout.button_minimize.innerHTML = "<i class='fa fa-compress'></i>";
                MediaPlayer.layout.button_minimize.title = "Minimize";
                MediaPlayer.layout.button_minimize.addEventListener("click", MediaPlayer.minimize, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.button_minimize);
                MediaPlayer.layout.button_light_off = document.createElement("button");
                MediaPlayer.layout.button_light_off.className = "bmalSuitable";
                MediaPlayer.layout.button_light_off.tabIndex = "7";
                MediaPlayer.layout.button_light_off.innerHTML = "<i class='fa fa-lightbulb-o'></i>";
                MediaPlayer.layout.button_light_off.title = "Turn the light off";
                MediaPlayer.layout.button_light_off.addEventListener("click", function(event) {
                    if (MediaPlayer.layout.superNode.classList.contains("light_off")) {
                        MediaPlayer.layout.superNode.classList.remove("light_off");
                        Storage.store.MediaPlayer.preferences.lightOff = false;
                    } else {
                        MediaPlayer.layout.superNode.classList.add("light_off");
                        Storage.store.MediaPlayer.preferences.lightOff = true;
                    }
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.button_light_off);
                MediaPlayer.layout.button_help = document.createElement("button");
                MediaPlayer.layout.button_help.className = "bmalSuitable";
                MediaPlayer.layout.button_help.tabIndex = "9";
                MediaPlayer.layout.button_help.innerHTML = "<i class='fa fa-question'></i>";
                MediaPlayer.layout.button_help.title = "Help";
                MediaPlayer.layout.button_help.addEventListener("click", function(event) {
                    if (MediaPlayer.layout.iframe_interface.style.display === "block") {
                        MediaPlayer.layout.iframe_interface.style.display = "none";
                        MediaPlayer.layout.div_media.style.display = "block";
                    } else {
                        MediaPlayer.layout.iframe_interface.style.display = "block";
                        MediaPlayer.layout.div_media.style.display = "none";
                    }
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.button_help);
                MediaPlayer.layout.button_refresh = document.createElement("button");
                MediaPlayer.layout.button_refresh.className = "bmalSuitable special";
                MediaPlayer.layout.button_refresh.tabIndex = "10";
                MediaPlayer.layout.button_refresh.innerHTML = "<i class='fa fa-refresh'></i>";
                MediaPlayer.layout.button_refresh.title = "Clear cache and refresh";
                MediaPlayer.layout.button_refresh.addEventListener("click", function(event) {
                    let cacheEntry = TitlesMatcher.getCacheEntry(MediaPlayer.mediadata.id, MediaPlayer.source);
                    if (typeof cacheEntry !== "undefined") {
                        TitlesMatcher.removeCacheEntry(cacheEntry);
                        Storage.save();
                    }
                    setSource(MediaPlayer.layout.select_source.selectedIndex);
                }, false);
                MediaPlayer.layout.div_sourceControls.appendChild(MediaPlayer.layout.button_refresh);
                MediaPlayer.layout.div_media = document.createElement("div");
                MediaPlayer.layout.div_media.className = "media";
                MediaPlayer.layout.div_media.tabIndex = "11";
                let minimized = false;
                MediaPlayer.layout.superNode.addEventListener("webkitfullscreenchange", function(event) {
                    if (document.webkitFullscreenElement !== null) {
                        if (MediaPlayer.layout.superNode.classList.contains("minimized")) {
                            minimized = true;
                            MediaPlayer.layout.superNode.classList.remove("minimized");
                        }
                        MediaPlayer.layout.superNode.classList.add("fullscreen");
                    } else {
                        if (minimized === true) {
                            minimized = false;
                            MediaPlayer.layout.superNode.classList.add("minimized");
                        }
                        MediaPlayer.layout.superNode.classList.remove("fullscreen");
                    }
                }, false);
                MediaPlayer.layout.superNode.appendChild(MediaPlayer.layout.div_media);
                MediaPlayer.layout.iframe_interface = document.createElement("iframe");
                MediaPlayer.layout.iframe_interface.className = "interface";
                MediaPlayer.layout.iframe_interface.src = chrome.extension.getURL("resources/html/mediaplayer/shortcuts.html");
                MediaPlayer.layout.superNode.appendChild(MediaPlayer.layout.iframe_interface);
                MediaPlayer.layout.div_overlay = document.createElement("div");
                MediaPlayer.layout.div_overlay.className = "overlay";
                MediaPlayer.layout.div_media.appendChild(MediaPlayer.layout.div_overlay);
                MediaPlayer.layout.div_sourceControls.repaint();
                MediaPlayer.Module.attach().then(function() {
                    console.log("Module attached");
                    window.addEventListener("keydown", onShortcut, false);
                    console.log("Initializing MediaPlayer...");
                    MediaPlayer.setState(MediaPlayer.STATE.INITIALIZING_PLAYER);
                    MediaPlayer.layout.div_sourceControls.repaint();
                    let source = MediaPlayer.Module.SOURCES.find(function(source) {
                        return source.id === MediaPlayer.Module.Storage.preferences.sourceId;
                    });
                    let sourcesFormats = MediaPlayer.Module.SOURCES.map(function(source) {
                        return source.format;
                    }).filter(function(sourceFormat, index, array) {
                        return array.indexOf(sourceFormat) === index;
                    });
                    for (let sourceFormat of sourcesFormats) {
                        let option = document.createElement("option");
                        option.textContent = sourceFormat;
                        if (typeof source !== "undefined" && sourceFormat === source.format) {
                            option.selected = true;
                        }
                        MediaPlayer.layout.select_source_format.appendChild(option);
                    }
                    if (typeof source !== "undefined") {
                        let sourceFormatIndex = Array.prototype.slice.call(MediaPlayer.layout.select_source_format.options).map(function(option) {
                            return option.text;
                        }).indexOf(source.format);
                        setSourceFormat(sourceFormatIndex > 0 ? sourceFormatIndex : 0);
                        let sourceLanguageIndex = Array.prototype.slice.call(MediaPlayer.layout.select_source_language.options).map(function(option) {
                            return option.text;
                        }).indexOf(source.language);
                        setSourceLanguage(sourceLanguageIndex > 0 ? sourceLanguageIndex : 0);
                        let sourceIndex = Array.prototype.slice.call(MediaPlayer.layout.select_source.options).map(function(option) {
                            return option.value;
                        }).indexOf(source.format);
                        setSource(sourceIndex > 0 ? sourceIndex : 0);
                    } else {
                        setSourceFormat(0);
                        setSourceLanguage(0);
                        MediaPlayer.source = MediaPlayer.Module.SOURCES.find(function(source) {
                            return source.id === MediaPlayer.layout.select_source.options[MediaPlayer.layout.select_source.selectedIndex].value;
                        });
                        setSource(MediaPlayer.layout.select_source.selectedIndex);
                    }
                });
            });
        });
    };
    MediaPlayer.previous = function() {
        goTo(MediaPlayer.layout.select_episode.selectedIndex - 1);
    };
    MediaPlayer.setEpisode = function(index, resume) {
        console.log("Setting episode...", index);
        MediaPlayer.setState(MediaPlayer.STATE.SETTING_EPISODE);
        MediaPlayer.sourceData.episode = MediaPlayer.sourceData.episodes[index];
        MediaPlayer.layout.select_episode.options[MediaPlayer.layout.select_episode.selectedIndex].classList.add("watched");
        let historyEntryEpisode = MediaPlayer.historyEntry.episodes.find(function(entry) {
            return entry.title === MediaPlayer.sourceData.episode.title;
        });
        if (typeof historyEntryEpisode === "undefined") {
            let historyEntryEpisode = {
                title: MediaPlayer.sourceData.episode.title,
                updated_at: Date.now(),
                created_at: Date.now(),
                accessed_at: Date.now()
            };
            MediaPlayer.historyEntry.episodes.push(historyEntryEpisode);
            Storage.save();
            MediaPlayer.historyEntry.updated_at = Date.now();
            MediaPlayer.historyEntry.updated_at = Date.now();
            Storage.save();
            MediaPlayer.Module.sourceData.episode = historyEntryEpisode;
        } else {
            MediaPlayer.Module.sourceData.episode = historyEntryEpisode;
            MediaPlayer.Module.sourceData.episode.accessed_at = Date.now();
            Storage.save();
        }
        MediaPlayer.source.getMedia(MediaPlayer.sourceData.episode.url).then(function(response) {
            if (response.status === "found") {
                console.log("Media found ", response);
                MediaPlayer.sourceData.url_medias = MediaPlayer.sourceData.episode.url;
                MediaPlayer.sourceData.original_medias = response.medias;
                response.medias.sort(function(mediaA, mediaB) {
                    return mediaA.label.localeCompare(mediaB.label, "en", {
                        numeric: true
                    });
                });
                response.medias = response.medias.map(function(media) {
                    media.label = media.label.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim();
                    return media;
                });
                MediaPlayer.sourceData.medias = response.medias;
                for (let i = 0; i < response.medias.length; i++) {
                    let media = response.medias[i];
                    let option = document.createElement("option");
                    option.text = media.label;
                    option.value = media.url;
                    MediaPlayer.layout.select_media.appendChild(option);
                }
                if (MediaPlayer.layout.select_media.options.length > 1) {
                    MediaPlayer.layout.select_media.options[MediaPlayer.Module.getMediaIndex()].selected = true;
                }
                MediaPlayer.Module.setMedia(MediaPlayer.layout.select_media.selectedIndex, resume);
                MediaPlayer.layout.div_sourceControls.repaint();
            } else {
                console.log("Media not found", response);
                MediaPlayer.setState(MediaPlayer.STATE.MEDIA_NOT_FOUND);
            }
        });
    };
    MediaPlayer.setState = function(state) {
        MediaPlayer.state = state;
        console.log("MediaPlayer.state=" + MediaPlayer.state);
        if (typeof MediaPlayer.xhttp !== "undefined") {
            MediaPlayer.xhttp.aborted = true;
            MediaPlayer.xhttp.abort();
        }
        if (typeof TitlesMatcher.xhttp !== "undefined") {
            MediaPlayer.xhttp.aborted = true;
            TitlesMatcher.xhttp.abort();
        }
        if (typeof Helpers.xhttp !== "undefined") {
            MediaPlayer.xhttp.aborted = true;
            Helpers.xhttp.abort();
        }
        switch (MediaPlayer.state) {
            case MediaPlayer.STATE.DEFAULT:
                MediaPlayer.layout.div_media.className = "media";
                MediaPlayer.layout.div_sourceControls.repaint();
                break;
            case MediaPlayer.STATE.SETTING_SOURCE:
                MediaPlayer.layout.div_media.className = "media loading";
                MediaPlayer.sourceData = {};
                MediaPlayer.Module.sourceData = {};
                MediaPlayer.layout.select_episode.innerHTML = "";
                MediaPlayer.layout.select_media.innerHTML = "";
                MediaPlayer.layout.div_sourceControls.repaint();
                break;
            case MediaPlayer.STATE.SETTING_EPISODE:
                MediaPlayer.layout.div_media.className = "media loading";
                MediaPlayer.layout.select_media.innerHTML = "";
                MediaPlayer.layout.div_sourceControls.repaint();
                break;
            case MediaPlayer.STATE.INITIALIZING_PLAYER:
            case MediaPlayer.STATE.SETTING_MEDIA:
                MediaPlayer.layout.div_media.className = "media loading";
                MediaPlayer.layout.div_sourceControls.repaint();
                break;
            case MediaPlayer.STATE.MEDIA_LOADED:
                MediaPlayer.layout.div_media.className = "media";
                MediaPlayer.layout.div_sourceControls.repaint();
                break;
            case MediaPlayer.STATE.MEDIA_NOT_FOUND:
                MediaPlayer.layout.div_media.className = "media error";
                MediaPlayer.layout.div_sourceControls.repaint();
                break;
        }
        MediaPlayer.Module.onStateChange();
    };
    MediaPlayer.toggleFullscreen = function() {
        if (document.webkitFullscreenElement !== null) {
            document.webkitExitFullscreen();
        } else {
            MediaPlayer.layout.superNode.webkitRequestFullScreen();
        }
    };
}).call(MediaPlayer = {});
