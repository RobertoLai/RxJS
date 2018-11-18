$(function() {
  console.log("Earthquake Visualizer with RxJS");
  observeMap(initMap());
});

function initMap() {
  const map = L.map("map").setView([33.858631, -118.279602], 7);
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
  return { map, L }; // {map:map, L:L}
}

function observeMap(Map) {
  const QUAKE_URL =
    "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp";
  $(`<blockquote class="legend">Updated every 5 seconds,<br>last update: <div id="lastUpdate"></div>

          <div id="spinner" class="text-center">
            <span>Updating...</span><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            <span class="sr-only">Loading...</span>
          </div>
    </blockquote>`).insertBefore("#legend");

  let codeLayers = {};
  const quakeLayer = Map.L.layerGroup([]).addTo(Map.map);

  let quakes = Rx.Observable.interval(5000)
    .flatMap(() =>
      Rx.DOM.jsonpRequest({
        url: QUAKE_URL,
        jsonpCallback: "eqfeed_callback"
      }).retry(3)
    )
    .flatMap(result => {
      $("#lastUpdate").html(new Date());
      return Rx.Observable.from(result.response.features);
    })
    .distinct(quake => quake.properties.code)
    .share();

  quakes.subscribe(quake => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;
    const circle = Map.L.circle([coords[1], coords[0]], size).addTo(Map.map);

    quakeLayer.addLayer(circle);
    codeLayers[quake.id] = quakeLayer.getLayerId(circle);
    $("#spinner").hide();
  });

  const table = document.getElementById("quakes_info");
  quakes
    .pluck("properties")
    .map(makeRow)
    .subscribe(row => table.appendChild(row));

  getRowFromEvent("mouseover")
    .pairwise()
    .subscribe(rows => {
      const prevCircle = quakeLayer.getLayer(codeLayers[rows[0].id]);
      const currCircle = quakeLayer.getLayer(codeLayers[rows[1].id]);
      prevCircle.setStyle({ color: "#0000ff" });
      currCircle.setStyle({ color: "#ff0000" });
    });

  getRowFromEvent("click").subscribe(rows => {
    const circle = quakeLayer.getLayer(codeLayers[rows.id]);
    Map.map.panTo(circle.getLatLng());
  });
}

function makeRow(props) {
  const row = document.createElement("tr");
  const time = new Date(props.time).toString();

  row.id = props.net + props.code;
  [props.place, props.mag, time].forEach(text => {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
  });

  return row;
}

const identity = Rx.helpers.identity;

function isHovering(element) {
  // console.log('2-is hovering on ' + element.id );
  const over = Rx.DOM.mouseover(element).map(identity(true));
  const out = Rx.DOM.mouseout(element).map(identity(false));

  return over.merge(out);
}
function getRowFromEvent(event) {
  const table = document.getElementById("quakes_info");
  return Rx.Observable.fromEvent(table, event)
    .filter(
      event =>
        event.target.tagName === "TD" && event.target.parentNode.id.length
    )
    .pluck("target", "parentNode")
    .distinctUntilChanged();
}

// Without Rx.DOM.jsonpRequest we should write this:
// let quakes = Rx.Observable.create( (observer) => {
//   window.eqfeed_callback = (response) => { response.features.forEach( (quake) => observer.onNext(quake) ) };
//   loadJSONP(QUAKE_URL);
// })

// function loadJSONP(url) {
//   let script = document.createElement('script');
//   script.src = url;
//   let head = document.getElementsByTagName('head')[0];
//   head.appendChild(script);
// }
