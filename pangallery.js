(function () {
    "use strict";

    var galSurface = document.getElementById("galSurface"),
        debug = document.getElementById("debug"),

        thumbs = [],

        docW = document.body.offsetWidth,
        docH = document.body.offsetHeight,
        galW, galH,

        magX, magY,
        NUM_THUMBS = 25,
        MARGIN = 80,

        clientToNormal, normalToClient,

        moveHandler, renderThumbs;

    clientToNormal = function (point) {
        // Translate the given client coordinates from (0..w, 0..h) to
        // (-1..1, -1..1), where (-1, -1) is the top left and (1, 1) is the
        // bottom right.

        return {
            x: (point.x / docW - 0.5) * 2,
            y: (point.y / docH - 0.5) * 2
        };
    };


    normalToClient = function (point) {
        // Does the reverse of clientToNormal().

        return {
            x: docW * (point.x / 2 + 0.5) | 0,
            y: docH * (point.y / 2 + 0.5) | 0
        };
    };

    moveHandler = function (evt) {
        var cpoint, npoint, gpoint;

        cpoint = { x: evt.clientX, y: evt.clientY };

        npoint = clientToNormal(cpoint);
        npoint.x *= -magX;
        npoint.y *= -magY;

        gpoint = normalToClient(npoint);
        gpoint.x -= galW / 2;
        gpoint.y -= galH / 2;

        debug.innerHTML = [
            "docW: ", docW, ", docH: ", docH, "<br>",
            "galW: ", galW, ", galH: ", galH, "<br>",
            "magX: ", magX, ", magY: ", magY, "<br>",
            "nx: ", (npoint.x * 100 | 0) / 100,
            ", ny: ", (npoint.y * 100 | 0) / 100, "<br>",
            "cx: ", cpoint.x, ", cy: ", cpoint.y, "<br>",
            "gx: ", gpoint.x, ", gy: ", gpoint.y
        ].join("");

        galSurface.style.left = gpoint.x + "px";
        galSurface.style.top = gpoint.y + "px";
    };

    renderThumbs = function () {
        var t, frag;

        frag = document.createDocumentFragment();

        for (t = 0; t < NUM_THUMBS; t += 1) {
            thumbs[t] = document.createElement("div");
            thumbs[t].className = "thumb";
            frag.appendChild(thumbs[t]);
        }

        galSurface.appendChild(frag);
    };

    (function () {
        // Set up gallery size based on thumb size and number of thumbs.
        // Layout is N x M thumbs, where N is the sqrt(NUM_THUMBS) and M is N
        // plus enough extra rows to accomodate what's left over.

        var tempThumb = document.createElement("div"),
            frag = document.createDocumentFragment(),
            tw, th, sq = Math.sqrt(NUM_THUMBS) | 0,
            extraRows;

        tempThumb.className = "thumb";
        tempThumb.style.visibility = "hidden";
        document.body.appendChild(tempThumb);

        tw = tempThumb.offsetWidth;
        th = tempThumb.offsetHeight;

        document.body.removeChild(tempThumb);

        extraRows = function () {
            return Math.ceil((NUM_THUMBS - sq * sq) / sq);
        };

        galW = sq * (tw + MARGIN * 2);
        galH = (sq + extraRows()) * (th + MARGIN * 2); // +1 row for remainders

        magX = (galW / docW) / 1.5;
        magY = (galH / docH) / 1.5;

        galSurface.style.width = galW + "px";
        galSurface.style.height = galH + "px";

        renderThumbs();
    }());

    document.body.addEventListener("mousemove", moveHandler, false);
}());

