(function() {
    function getResults(title, source) {
        return new Promise(function(resolve, reject) {
            let pages = [{
                label: 1,
                start: "0"
            }];
            let titleResults = [];
            Helpers.runGenerator(function*() {
                for (let i = 0; i < pages.length; i++) {
                    let pageResults = yield new Promise(function(resolve1, reject2) {
                        let pageResults = [];
                        search(title, source.titlesmatcher.domain, pages[i].start).then(function(response) {
                            if (typeof response !== "undefined") {
                                pageResults = pageResults.concat(response.results);
                            }
                            resolve1(pageResults);
                        });
                    });
                    titleResults = titleResults.concat(pageResults);
                }
                resolve(titleResults);
            });
        });
    }

    function search(query, domain, start) {
        return new Promise(function(resolve, reject) {
            let xhttp = new XMLHttpRequest();
            TitlesMatcher.xhttp = xhttp;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        resolve(xhttp.response);
                    } else if (typeof xhttp.aborted === "undefined") {
                        resolve();
                    }
                }
            };
            xhttp.open("GET", "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&prettyPrint=false&cx=015876640654173213440:7u35yqro9u8&q=" + query + "&filter=0&as_sitesearch=" + domain + "&start=" + start, true);
            xhttp.responseType = "json";
            xhttp.send();
        });
    }
    TitlesMatcher.find = function(id, titles, source) {
        return new Promise(function(resolve, reject) {
            Helpers.runGenerator(function*() {
                let found = false;
                let response;
                let url;
                console.log("Looking for a cached URL inside the titles matcher cache...");
                let cacheEntry = TitlesMatcher.getCacheEntry(id, source);
                if (typeof cacheEntry !== "undefined") {
                    url = cacheEntry.url;
                    response = yield source.getEpisodes(url);
                    if (response.status === "found") {
                        console.log("Episodes found", response);
                        found = true;
                    }
                }
                if (found === false) {
                    console.log("Looking for a mapped URL inside the source's titles matcher map...", source.titlesmatcher.map);
                    if (id in source.titlesmatcher.map) {
                        url = source.titlesmatcher.map[id].url;
                        response = yield source.getEpisodes(url);
                        if (response.status === "found") {
                            console.log("Episodes found", response);
                            found = true;
                        }
                    }
                }
                if (found === false) {
                    console.log("Testing URLs against titles...", titles);
                    loop: for (let i = 0; i < titles.length; i++) {
                        let title = titles[i];
                        url = source.buildURL(title);
                        response = yield source.getEpisodes(url);
                        if (response.status === "found") {
                            console.log("Episodes found", response);
                            found = true;
                            break loop;
                        }
                    }
                }
                if (found === false) {
                    console.log("Retrieving online results and testing URLs...", titles);
                    loop: for (let i = 0; i < titles.length; i++) {
                        let title = titles[i];
                        let urls = yield TitlesMatcher.match(title, source);
                        for (let ii = 0; ii < urls.length; ii++) {
                            url = urls[ii];
                            response = yield source.getEpisodes(url);
                            if (response.status === "found") {
                                console.log("Episodes found", response);
                                found = true;
                                break loop;
                            }
                        }
                    }
                }
                if (found === true) {
                    if (typeof cacheEntry === "undefined") {
                        console.log("Adding a new entry in the cache...", Storage.store.TitlesMatcher.cache.entries);
                        Storage.store.TitlesMatcher.cache.entries.push({
                            id: id,
                            url: url,
                            sourceID: source.id
                        });
                        Storage.save();
                    }
                }
                resolve({ url: url, response: response, found: found });
            });
        });
    };
    TitlesMatcher.removeCacheEntry = function(cacheEntry) {
        let index = Storage.store.TitlesMatcher.cache.entries.indexOf(cacheEntry);
        Storage.store.TitlesMatcher.cache.entries.splice(index, 1);
    };
    TitlesMatcher.getCacheEntry = function(id, source) {
        let cacheEntry;
        for (let i = 0; i < Storage.store.TitlesMatcher.cache.entries.length; i++) {
            let entry = Storage.store.TitlesMatcher.cache.entries[i];
            if (entry.id === id && entry.sourceID === source.id) {
                cacheEntry = entry;
                break;
            }
        }
        return cacheEntry;
    };
    TitlesMatcher.match = function(title, source) {
        return new Promise(function(resolve, reject) {
            getResults(title, source).then(function(results) {
                let urls = results.map(function(result) {
                    return result.unescapedUrl;
                });
                if (typeof source.titlesmatcher.regex.url !== "undefined") {
                    urls = urls.filter(function(url, pos) {
                        return source.titlesmatcher.regex.url.test(url) === true;
                    });
                    urls = urls.map(function(url) {
                        return source.buildURL(url.match(source.titlesmatcher.regex.url)[1]);
                    });
                }
                resolve(urls);
            });
        });
    };
}).call(TitlesMatcher = {});
