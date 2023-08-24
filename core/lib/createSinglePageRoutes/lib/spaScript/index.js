/*
    Script embedded in a ready-made page for SPA logic operation
*/

let getPages = {};

onload = async () => {
    let response = await fetch('/helium/getSinglePageRoute');

    if (response.ok) {
        let json = await response.json();
        getPages = json;
    }
};

const spaChangePage = async () => {
    setTimeout(() => {
        document.head.innerHTML = getPages[location.pathname].contentHead;
        document.body.innerHTML = getPages[location.pathname].contentBody;
    }, 1);
};

(function (history) {
    var pushState = history.pushState;
    history.pushState = function (state) {
        if (typeof history.onpushstate == 'function') {
            history.onpushstate({ state: state });
        }
        spaChangePage();
        return pushState.apply(history, arguments);
    };
})(window.history);

window.addEventListener('popstate', function (event) {
    spaChangePage();
});
