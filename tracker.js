let subways = [];
let size = 1500;

/**
* Function gets called when the webpage loads.
*  - Makes event listeners
*  - Gets the current date and time
*  - Gets the subway locations
*/
function start() {
  let canvas = document.getElementById("subways");
  canvas.width = size;
  canvas.height = size * 1.2;
  let ctx = canvas.getContext("2d");

  //resize the map
  document.getElementById("smaller").addEventListener("click", function() {
    if (size > 300) {
      size = size - 50;
      canvas.width = size;
      canvas.height = size * 1.2;
      document.getElementById("map").width = size;
      document.getElementById("map").height = size * 1.2;
      getData(ctx);
    }
  });
  document.getElementById("bigger").addEventListener("click", function() {
    if (size < 3000) {
      size = size + 50;
      canvas.width = size;
      canvas.height = size * 1.2;
      document.getElementById("map").width = size;
      document.getElementById("map").height = size * 1.2;
      getData(ctx);
    }
  });

  //get and format date and time
  setInterval(function() {
    const d = new Date();
    const date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    let hour = d.getHours();
    let am = "am";
    if (hour == 0) {
      hour = 12;
    } else if (hour == 12) {
      am = "pm";
    } else if (hour > 12) {
      hour = hour - 12;
      am = "pm";
    }
    let minute = d.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }
    let second = d.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }
    const time = hour + ":" + minute + ":" + second;
    document.getElementById("dateTime").innerHTML = "Current date & time: " + date + " " + time + " " + am;
  }, 500);

  getData(ctx);
  setInterval(function() {
    subways = [];
    getData(ctx);
  }, 5000);
}

/**
* Gets the subway data from MBTA's API.
* @param ctx the contex of the canvas used to plot the subway locations
*/
function getData(ctx) {
  fetch("https://api-v3.mbta.com/vehicles").then(
    function(response) {
      if (response.status !== 200) {
        console.log("Error: " + response.status);
        return;
      }

      response.json().then(function(raw) {
        raw.data.forEach(ele => {
          //parse out subway vehicles
          switch (ele.id.charAt(0)) {
            case 'B':
            case 'O':
            case 'G':
            case 'R':
              subways.push(ele);
          }
        });
        populateCanvas(ctx);
      });
    }
  ).catch(function(err) {
    console.log("Fetch Error: ", err);
  });
}

/**
* Plots the subway locations on the screen.
* @param ctx the contex of the canvas used to plot the subway locations
*/
function populateCanvas(ctx) {
  ctx.clearRect(0, 0, size, size);
  subways.forEach(train => {
    const latitude = train.attributes.latitude;
    const y = (42.44 - latitude) * (size / 0.24) * 1.2;
    const longitude = train.attributes.longitude;
    const x = (longitude + 71.26) * (size / 0.28);
    ctx.beginPath();
    ctx.arc(x, y, size/375, 0, 2 * Math.PI);
    ctx.fill();
  });
}
