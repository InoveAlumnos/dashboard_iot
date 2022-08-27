// ---- Estructura de datos ----
let data = {
    luz: 0,
    volar: 0,
    motores: [0, 0, 0, 0],
    joystick: {x: 0, y: 0},
    inerciales: {heading: 0, accel: 0},
    gps: {latitude: -34.55, longitude: -58.496},
    monitoreo: {temp: 0, ram:0, cpu:0}   
}

let keepAlive = {};

let chartReady = false;
const dataMaxLen = 50;
const headingTime = new Array(dataMaxLen);
const headingData = new Array(dataMaxLen);
const accelTime = new Array(dataMaxLen);
const accelData = new Array(dataMaxLen);

function addData(time, data, bufferTime, bufferData) {
    bufferTime.push(time);
    bufferData.push(data);
    if (bufferTime.length > dataMaxLen) {
        bufferTime.shift();
        bufferData.shift();
    }
    if(chartReady == true) {
        headingChart.update();
        accelChart.update();
    }
}

addData(0, 0, headingTime, headingData);
addData(0, 0, accelTime, accelData);

let socket_connected = false;
const dashboard_topic = "dashboardiot";
const topicBase = `${dashboard_topic}/${mqttuser}`

// ---- Elementos del HTML ----
const drone = document.getElementById("drone");
const motor1 = document.querySelector("#motor1");
const motor2 = document.querySelector("#motor2");
const motor3 = document.querySelector("#motor3");
const motor4 = document.querySelector("#motor4");

const light = document.getElementById("droneLight");

const slight = document.querySelector("#slight");
light.style.opacity = 0;

const m1 = document.querySelector("#sM1");
const m2 = document.querySelector("#sM2");
const m3 = document.querySelector("#sM3");
const m4 = document.querySelector("#sM4");

m1.disabled = true;
m2.disabled = true;
m3.disabled = true;
m4.disabled = true;

// --- Funciones de ayuda ----
function updateEngineState(state) {
    if(state == true) {
        data.volar = 1;
        data.motores[0] = 1;
        data.motores[1] = 1;
        data.motores[2] = 1;
        data.motores[3] = 1;
        m1.checked = true;
        m1.disabled = false;
        m2.checked = true;
        m2.disabled = false;
        m3.checked = true;
        m3.disabled = false;
        m4.checked = true;
        m4.disabled = false;
    } else {
        data.volar = 0;
        data.motores[0] = 0;
        data.motores[1] = 0;
        data.motores[2] = 0;
        data.motores[3] = 0;
        m1.checked = false;
        m1.disabled = true;
        m2.checked = false;
        m2.disabled = true;
        m3.checked = false;
        m3.disabled = true;
        m4.checked = false;
        m4.disabled = true;
    }
}

function rotate() {
    x = data.joystick.y > 0? data.joystick.y * 60 : 0;
    y = data.joystick.x * 60 + 180;
    z = (-data.inerciales.heading);
    drone.style.webkitTransform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    drone.style.MozTransform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    drone.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}

function update() {
    data.motores[0] == true ? motor1.classList.add("propeller--on") : motor1.classList.remove("propeller--on");
    data.motores[1] == true ? motor2.classList.add("propeller--on") : motor2.classList.remove("propeller--on");
    data.motores[2] == true ? motor3.classList.add("propeller--on") : motor3.classList.remove("propeller--on");
    data.motores[3] == true ? motor4.classList.add("propeller--on") : motor4.classList.remove("propeller--on");
}

function sendActuadorUpdate(actuador) {
    if (socket_connected == true){
        if(actuador == "volar") {
            message = new Paho.MQTT.Message(String(data.volar));
            message.destinationName = `${topicBase}/actuadores/volar`;
            client.send(message);
        }
        if(actuador == "luz") {
            message = new Paho.MQTT.Message(String(data.luz));
            message.destinationName = `${topicBase}/actuadores/luces/1`;
            client.send(message);
        }
        if(actuador == "motores") {
            for(i=0; i < data.motores.length; i++) {
                message = new Paho.MQTT.Message(String(Number(data.motores[i])));
                message.destinationName = `${topicBase}/actuadores/motores/${i+1}`;
                client.send(message);
            }
        }
    }
}

// ---- Paginas ----
function showPage(id) {
    const pages = document.querySelectorAll("section");
    pages.forEach((page) => {        
        if(page.id == id) {
            page.style.display = "block";
        }
        else {
            page.style.display = "none";
        }
    });
}

let pagesBtn = document.querySelectorAll("aside a");
pagesBtn.forEach((pageBtn) => {
    pageBtn.onclick = () => {
        showPage(pageBtn.getAttribute("page"));
    }
});

pagesBtn = document.querySelectorAll("footer a");
pagesBtn.forEach((pageBtn) => {
    pageBtn.onclick = () => {
        showPage(pageBtn.getAttribute("page"));
    }
});

// ---- Instanciar elementos HTML y conectar eventos ----
slight.onchange = (e) => {
    const val = e.target.checked ? 1 : 0;
    data.luz = val;
    light.style.opacity = val;
    sendActuadorUpdate("luz");
}
const sengine = document.querySelector("#sengine");
sengine.onchange = (e) => {
    updateEngineState(e.target.checked);
    update();
    sendActuadorUpdate("volar");
    sendActuadorUpdate("motores");
}

m1.onchange = (e) => {
    data.motores[0] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}
m2.onchange = (e) => {
    data.motores[1] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}
m3.onchange = (e) => {
    data.motores[2] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}
m4.onchange = (e) => {
    data.motores[3] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}

// ---- Update users ----
//let obj = {"you": 100, "me": 75, "foo": 116, "bar": 15};
(function my_func() {
    if(Object.keys(keepAlive).length > 0) {
        let entries = Object.entries(keepAlive);
        const sorted = entries.sort((a, b) => a[1] - b[1]).reverse();

        let accumulator = ""
        for(const user of sorted){
            accumulator+=    
            `
            <div class=row>
                ${user[0]} ${user[1]}
            </div>
            `
        };

        const section = document.querySelector("#usersList");
        section.innerHTML = accumulator;
    }
    if (socket_connected == true){
        message = new Paho.MQTT.Message("1");
        message.destinationName = `${topicBase}/keepalive/request`;
        client.send(message);
    }
    setTimeout( my_func, 1000 );
})();



// ---- MQTT Websockets ----
const client = new Paho.MQTT.Client("23.92.69.190", 9001, "clientId_" + mqttuser);

// set callback handlers
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    socket_connected = true;
    client.subscribe(`${topicBase}/#`);
    client.subscribe(`${dashboard_topic}/+/sensores/gps`);
    client.subscribe(`${dashboard_topic}/+/keepalive/ack`);
}

function doFail(e) {
    console.log(e);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    socket_connected = false;
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost: " + responseObject.errorMessage);
    }
  }

// called when a message arrives
function onMessageArrived(message) {
    //console.log("onMessageArrived: " + message.destinationName + "  "+ message.payloadString);
    const msg = message.payloadString;
    if(message.destinationName == `${topicBase}/actuadores/luces/1`) {
        const val = Number(msg);
        data.luz = val;
        light.style.opacity = val;
        slight.checked = val;
    }
    else if(message.destinationName == `${topicBase}/actuadores/volar`) {
        const val = Number(msg);
        sengine.checked = val;
        updateEngineState(val);
        update();
    }
    else if(message.destinationName == `${topicBase}/actuadores/motores/1`) {
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[0] = val;
            m1.checked = val;
            update();
        }
    }
    else if(message.destinationName == `${topicBase}/actuadores/motores/2`) {
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[1] = val;
            m2.checked = val;
            update();
        }
    }
    else if(message.destinationName == `${topicBase}/actuadores/motores/3`) {
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[2] = val;
            m3.checked = val;
            update();
        }
    }
    else if(message.destinationName == `${topicBase}/actuadores/motores/4`) {
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[3] = val;
            m4.checked = val;
            update();
        }
    }
    else if(message.destinationName == `${topicBase}/sensores/joystick`) {
        const joystick = JSON.parse(msg)
        data.joystick = joystick;
        rotate();
    }
    else if(message.destinationName == `${topicBase}/sensores/inerciales`) {
        const inerciales = JSON.parse(msg)
        data.inerciales.heading = Number(inerciales["heading"]);
        data.inerciales.accel = Number(inerciales["accel"]);
        const idx = headingTime[headingTime.length - 1]
        addData(idx+1, data.inerciales.heading, headingTime, headingData);
        const idx2 = accelTime[accelTime.length - 1]
        addData(idx2+1, data.inerciales.accel, accelTime, accelData);
        rotate();
    }
    else if(message.destinationName.includes(`/sensores/gps`)) {
        const gps = JSON.parse(msg)
        const latitude = Number(gps["latitude"]);
        const longitude = Number(gps["longitude"]);
        const user = message.destinationName.split("/")[1];
        updateMarker(user, longitude, latitude);
    }
    else if(message.destinationName.includes('keepalive/ack')) {
        const user = message.destinationName.split("/")[1];
        if(! keepAlive.hasOwnProperty(user)) {
            keepAlive[user] = 0;
        }
        keepAlive[user]++;
    }
    else {
        console.log("Tópico no soportado: "+ message.destinationName);
    }

}

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
const options = {
    onSuccess: onConnect,
    onFailure: doFail,
    userName: "inoveiot",
    password: "mqtt",
}
// connect the client
client.connect(options);




