document.getElementById("saveStyleForm").addEventListener("submit", saveStyle);

document.getElementById("gameCanvas").addEventListener("click", () => {
    let settingsPanel = document.getElementById("settingsPanelDiv");
    settingsPanel.style.display = settingsPanel.style.display == "inline" ? "none" : "inline";
});

let centreX;
let centreY;

let hoursColor;
let minutesColor;
let secondsColor;
let bgColor;
let indicatorColor;

let hoursWidth;
let minutesWidth;
let secondsWidth;
let indicWidthMins;
let indicWidthHours;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContent = canvas.getContext('2d');

    centreX = canvas.width / 2;
    centreY = canvas.height / 2;

    hoursWidth = canvas.width / 32;
    minutesWidth = canvas.width / 32;
    secondsWidth = canvas.width / 96;
    indicWidthMins = canvas.width / 320;
    indicWidthHours = canvas.width / 80;

    setColor();
    fetchStyles();
    setInterval(draw, 1000);
}

function fetchStyles() {
    const styles = JSON.parse(localStorage.getItem("styles")) || [];
    //console.log(styles);
    let stylesList = document.getElementById("stylesList");


    if (styles.length > 0) {
        stylesList.innerHTML = "";
        for (let i = 0; i < styles.length; i++) {
            let styleName = styles[i].name;
            let styleID = styles[i].id;
            /*
            let styleBgColor = styles[i].bgColor;
            let styleHoursColor = styles[i].hoursColor;
            let styleMinutesColor = styles[i].minutesColor;
            let styleSecondsColor = styles[i].secondsColor;
            */

            stylesList.innerHTML += '<div class="container-sm text-center p-4 mb-3 bg-light border rounded-3">' +
                '<h3>' + styleName + '</h3>' +
                '<button class="btn btn-primary" id="selectStyleBtn' + i + '" onclick="loadStyle(\'' + styleID + '\')">Use Style</button> ' +
                '<button class="btn btn-danger" id="DeleteStyleBtn' + i + '" onclick="deleteStyle(\'' + styleID + '\')">Delete Style</button> ' +
                '</div>';
        }
    } else {
        stylesList.innerHTML = '<div class="fw-bolder gray text-center">No elements here :( <br> Start creating your own styles by pressing on the clock!';
    }
}

function loadStyle(id) {
    console.log(id);
    let styles = JSON.parse(localStorage.getItem("styles"));

    for (let i = 0; i < styles.length; i++) {
        if (styles[i].id == id) {
            document.getElementById("indicatorsPalette").value = styles[i].indicatorColor;
            document.getElementById("bgPalette").value = styles[i].bgColor;
            document.getElementById("hoursPalette").value = styles[i].hoursColor;
            document.getElementById("minutesPalette").value = styles[i].minutesColor;
            document.getElementById("secondsPalette").value = styles[i].secondsColor;
            setColor();
        }
    }
}

function deleteStyle(id) {
    console.log(id);
    let styles = JSON.parse(localStorage.getItem("styles"));

    for (let i = 0; i < styles.length; i++) {
        if (styles[i].id == id) {
            styles.splice(i, 1);
            localStorage.setItem("styles", JSON.stringify(styles));
            fetchStyles();
        }
    }
}

function saveStyle(e) {
    let styles = JSON.parse(localStorage.getItem("styles")) || [];
    let name = document.getElementById("styleNameInput").value;
    let id = styles.length || 0;
    console.log("length: " + styles.length);

    style = {
        id: id,
        name: name,
        indicatorColor: indicatorColor,
        bgColor: bgColor,
        hoursColor: hoursColor,
        minutesColor: minutesColor,
        secondsColor: secondsColor
    };

    styles.push(style);
    localStorage.setItem("styles", JSON.stringify(styles));

    document.getElementById("saveStyleForm").reset();
    fetchStyles();
    e.preventDefault();
}


function setColor() {
    indicatorColor = document.getElementById("indicatorsPalette").value;
    bgColor = document.getElementById("bgPalette").value;
    hoursColor = document.getElementById("hoursPalette").value;
    minutesColor = document.getElementById("minutesPalette").value;
    secondsColor = document.getElementById("secondsPalette").value;
    draw();
}

function draw() {
    canvasContent.fillStyle = bgColor;
    canvasContent.arc(centreX, centreY, canvas.width / 2, 0, Math.PI * 2, true);
    canvasContent.fill();

    for (let i = 0; i < 60; i++) {
        canvasContent.beginPath();

        canvasContent.lineWidth = i % 5 == 0 ? indicWidthHours : indicWidthMins;
        let length = i % 5 == 0 ? 9 / 10 : 19 / 20;

        indicatorStartX = Math.cos(Math.PI * 2 / 60 * i) * centreX;
        indicatorStartY = Math.sin(Math.PI * 2 / 60 * i) * centreY;

        canvasContent.moveTo(centreX + (indicatorStartX * length), centreY + (indicatorStartY * length));
        canvasContent.lineTo(centreX + indicatorStartX, centreY + indicatorStartY);
        canvasContent.strokeStyle = indicatorColor;
        canvasContent.stroke();
        canvasContent.closePath();
    }

    let seconds = new Date().getSeconds();
    let minutes = new Date().getMinutes();
    let hours = new Date().getHours();

    //divisione della circonferenza goniometrica in 60 parti [2PI/60]
    //moltiplicazione del numero di secondi per 1/60 della circonferenza [2PI/60*minutes] -> ogni secondo l'angolo aumenta di 1/60
    //sottrazione di 15 dal valore ottenuto (la circonferenza goniometrica parte da destra e non dall'alto) [Math.PI * 2 / 60 * (seconds - 15)]
    //utilizzo del valore otteuto come argomento di seno e coseno per il calcolo delle coordinate X e Y della lancetta [ Math.cos(Math.PI * 2 / 60 * (seconds - 15))]
    //moltiplicazione del seno e coseno per il raggio del cerchio (seno e coseno restituiscono numeri da 0 a 1) [Math.cos(Math.PI * 2 / 60 * (seconds - 15)) * centreX]

    let secPositionX = Math.cos(Math.PI * 2 / 60 * (seconds - 15)) * centreX;
    let secPositionY = Math.sin(Math.PI * 2 / 60 * (seconds - 15)) * centreY;

    let minsPositionX = Math.cos(Math.PI * 2 / 60 * (minutes - 15)) * centreX;
    let minsPositionY = Math.sin(Math.PI * 2 / 60 * (minutes - 15)) * centreY;

    let hoursPositionX = Math.cos(Math.PI * 2 / 60 * ((hours * 5 + minutes / 12) - 15)) * centreX;
    let hoursPositionY = Math.sin(Math.PI * 2 / 60 * ((hours * 5 + minutes / 12) - 15)) * centreY;

    drawHand(secondsColor, secondsWidth, centreX, centreY, centreX + (secPositionX * 3 / 4), centreY + (secPositionY * 3 / 4));
    drawHand(minutesColor, minutesWidth, centreX, centreY, centreX + (minsPositionX * 2 / 3), centreY + (minsPositionY * 2 / 3));
    drawHand(hoursColor, hoursWidth, centreX, centreY, centreX + (hoursPositionX / 2), centreY + (hoursPositionY / 2));

    /*
    console.log(seconds + " seconds");
    console.log("sin seconds " + secPositionY);
    console.log("cos seconds " + secPositionX);
    */

    canvasContent.arc(centreX, centreY, 12, 0, Math.PI * 2, true);
    canvasContent.fill();
}

function drawHand(clr, width, startX, startY, endX, endY) {
    canvasContent.lineWidth = width;
    canvasContent.beginPath();
    canvasContent.moveTo(startX, startY);
    canvasContent.lineTo(endX, endY);
    canvasContent.strokeStyle = clr;
    canvasContent.stroke();
    canvasContent.closePath();
}
