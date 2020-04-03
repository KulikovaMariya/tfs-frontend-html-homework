function requestUrls(resolveMain, urls, maxRequests) {
    let lastIndexStarted = -1;

    let completedCount = 0;

    const responsesArr = [];

    function startPromise(index) {
        if (index >= urls.length) {
            return;
        }
        lastIndexStarted = index;

        fetch(urls[index])
            .then(data => data.json())
            .then(data => responsesArr[index] = data)
            .finally(() => {
                completedCount += 1;
                if (completedCount >= urls.length) {
                    resolveMain(responsesArr);
                } else {
                    startPromise(lastIndexStarted + 1);
                }
            });
    }

    for (let i = 0; i < maxRequests && i < urls.length; i++) {
        startPromise(i);
    }
}

export function makeRequests(urls, maxRequests) {
    return new Promise(resolve => {
        requestUrls(resolve, urls, maxRequests);
    });
}
