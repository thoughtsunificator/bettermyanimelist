(function() {
    Helpers.getHistoryEntry = function(id, sourceID) {
        let historyEntry;
        for (let i = 0; i < Storage.store.MediaPlayer.history.entries.length; i++) {
            let entry = Storage.store.MediaPlayer.history.entries[i];
            if (entry.id === id && entry.sourceID === sourceID) {
                historyEntry = entry;
                break;
            }
        }
        return historyEntry;
    };
    Helpers.solveChallenge = function(body, host, callback) {
        function replayXHR() {
            let xhttp1 = new XMLHttpRequest();
            Helpers.xhttp = xhttp1;
            xhttp1.onreadystatechange = function() {
                if (xhttp1.readyState === 4) {
                    if (xhttp1.status === 200) {
                        callback();
                    } else if (typeof xhttp1.aborted === "undefined") {
                        if (xhttp1.responseXML !== null) {
                            Helpers.solveChallenge(xhttp1.responseXML.documentElement.innerHTML, host, callback);
                        } else {
                            setTimeout(function() {
                                replayXHR();
                            }, 1000);
                        }
                    }
                }
            };
            xhttp1.open("GET", "http://" + host, true);
            xhttp1.responseType = "document";
            xhttp1.send();
        }
        try {
            let challenge = body.match(/name="jschl_vc" value="(\w+)"/);
            let jsChlVc = challenge[1];
            challenge = body.match(/getElementById\('cf-content'\)[\s\S]+?setTimeout.+?\r?\n([\s\S]+?a\.value =.+?)\r?\n/i);
            challenge_pass = body.match(/name="pass" value="(.+?)"/)[1];
            challenge = challenge[1];
            challenge = challenge.replace(/a\.value =(.+?) \+ .+?;/i, '$1');
            challenge = challenge.replace(/\s{3,}[a-z](?: = |\.).+/g, '');
            challenge = challenge.replace(/'; \d+'/g, '');
            let answerResponse = {
                'jschl_vc': jsChlVc,
                'jschl_answer': (eval(challenge) + host.length),
                'pass': challenge_pass
            };
            MediaPlayer.Module.timeouts.cdn = setTimeout(function() {
                let xhttp1 = new XMLHttpRequest();
                Helpers.xhttp = xhttp1;
                xhttp1.onreadystatechange = function() {
                    if (xhttp1.readyState === 4) {
                        if (xhttp1.status === 200) {
                            callback();
                        } else if (typeof xhttp1.aborted === "undefined") {
                            setTimeout(function() {
                                replayXHR();
                            }, 1000);
                        }
                    }
                };
                xhttp1.open("GET", "http://" + host + "/cdn-cgi/l/chk_jschl?jschl_vc=" + answerResponse.jschl_vc + "&pass=" + answerResponse.pass + "&jschl_answer=" + answerResponse.jschl_answer, true);
                xhttp1.send();
            }, 5001);
        } catch (ex) {
            console.log(ex.stack);
            setTimeout(function() {
                callback();
            }, 1000);
        }
    };
    Helpers.pad = function(number, length) {
        let paddedNumber = "";
        for (let i = 0; i < length - number.toString().length; i++) {
            paddedNumber = paddedNumber.concat("0");
        }
        paddedNumber = paddedNumber.concat(number);
        return paddedNumber;
    };
    Helpers.runGenerator = function(generator) {
        let iterator = generator();
        return Promise.resolve().then(function handleNext(value) {
            let next = iterator.next(value);
            return (function handleResult(next) {
                if (next.done === true) {
                    return next.value;
                } else {
                    return Promise.resolve(next.value).then(handleNext).catch(function(exception) {
                        Promise.resolve(iterator.throw(exception)).then(handleResult);
                    });
                }
            })(next);
        }).catch(function(exception) {
            console.error(exception.stack);
        });
    };
    Helpers.secondsToHours = function(seconds) {
        seconds = seconds || 0;
        let hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        let minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return (hours > 0 ? (Helpers.pad(hours, 2) + ":") : "").concat(Helpers.pad(minutes, 2)).concat(":" + Helpers.pad(seconds, 2));
    };
}).call(Helpers = {});
