(function() {
    const MIGRATIONS = {
        "8_30_2016": function() {
            return Storage.clear();
        }
    };
    const SCHEMA = {
        "BetterMyAnimeList": {
            "migrations": []
        },
        "MediaPlayer": {
            "history": {
                "entries": []
            },
            "preferences": {
                "lightOff": true,
                "minimized": false
            }
        },
        "Reading": {
            "preferences": {
                "sourceId": ""
            }
        },
        "Streaming": {
            "preferences": {
                "playback": {
                    "muted": false,
                    "sourceId": "",
                    "volume": 1,
                    "quality": "720p"
                }
            }
        },
        "TitlesMatcher": {
            "cache": {
                "entries": []
            }
        }
    };
    Storage.store = {};
    Storage.init = function() {
        return new Promise(function(resolve, reject) {
            Helpers.runGenerator(function*() {
                for (let key in SCHEMA) {
                    yield Storage.load(key, SCHEMA[key]);
                }
                for (let migration in MIGRATIONS) {
                    if (Storage.store.BetterMyAnimeList.migrations.indexOf(migration) === -1) {
                        console.log("Migrating for " + migration);
                        yield MIGRATIONS[migration]();
                        Storage.store.BetterMyAnimeList.migrations.push(migration);
                        yield Storage.save();
                    }
                }
                resolve();
            });
        });
    };
    Storage.save = function() {
        return new Promise(function(resolve, reject) {
            Helpers.runGenerator(function*() {
                for (let storeItem in Storage.store) {
                    let items = {};
                    items[storeItem] = Storage.store[storeItem];
                    yield Storage.set(items);
                }
                resolve();
            });
        });
    };
    Storage.clear = function() {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.clear(resolve);
        });
    };
    Storage.get = function(keys) {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.get(keys, resolve);
        });
    };
    Storage.load = function(key, value) {
        return new Promise(function(resolve, reject) {
            Storage.get(key).then(function(items) {
                if (typeof items[key] !== "undefined") {
                    Storage.store[key] = items[key];
                } else {
                    Storage.store[key] = value;
                }
                resolve();
            });
        });
    };
    Storage.remove = function(keys) {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.remove(keys, resolve);
        });
    };
    Storage.set = function(items) {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.set(items, resolve);
        });
    };
}).call(Storage = {});
