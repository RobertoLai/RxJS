$(function() {
  console.log('Earthquake Visualizer with RxJS');
  let Map = initMap();
  observeMap(Map);
})

function initMap() {
  let map = L.map('map').setView([33.858631, -118.279602], 7);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
  return {map, L} //{map:map, L:L}
}

function observeMap(Map) {
  const QUAKE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp';
  $(`<blockquote class="legend">Updated every 5 seconds,<br>last update: <div id="lastUpdate"></div>

          <div id="spinner" class="text-center">
            <span>Updating...</span><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            <span class="sr-only">Loading...</span>
          </div>
    </blockquote>`)
    .insertBefore('#legend')

  let codeLayers = {};
  let quakeLayer = Map.L.layerGroup([]).addTo(Map.map);

  let quakes = Rx.Observable
      .interval(5000)
      .flatMap(() =>
        {
            return Rx.DOM.jsonpRequest(
                {
                  url: QUAKE_URL,
                  jsonpCallback: 'eqfeed_callback'
                }
            ).retry(3);
        })
       .flatMap( (result) => {
         $('#lastUpdate').html(new Date());
         return Rx.Observable.from(result.response.features)
       })
       .distinct( (quake) => quake.properties.code )
       .share()

  quakes.subscribe( (quake) => {
    let coords = quake.geometry.coordinates;
    let size = quake.properties.mag * 10000;
    let circle = Map.L.circle([coords[1], coords[0]], size).addTo(Map.map);

    quakeLayer.addLayer(circle);
    codeLayers[quake.id] = quakeLayer.getLayerId(circle);

    $('#spinner').hide();
  } );

  let table = document.getElementById('quakes_info');
  quakes
    .pluck('properties')
    .map(makeRow)
    .subscribe( (row) =>  table.appendChild(row) );

  getRowFromEvent('mouseover')
   .pairwise()
   .subscribe( (rows) => {
     let prevCircle = quakeLayer.getLayer(codeLayers[rows[0].id]);
     let currCircle = quakeLayer.getLayer(codeLayers[rows[1].id]);
     prevCircle.setStyle( { color: '#0000ff'} );
     currCircle.setStyle( { color: '#ff0000'} );
   })

 getRowFromEvent('click')
  .subscribe( (rows) => {
    let circle = quakeLayer.getLayer(codeLayers[rows.id]);
    Map.map.panTo(circle.getLatLng())
  })

}

function makeRow(props){
  let row = document.createElement('tr');
  row.id = props.net + props.code;

  var time = new Date(props.time).toString();
  [props.place, props.mag, time].forEach( (text) => {
    let cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
  })

  return row;
}

var identity = Rx.helpers.identity;

function isHovering(element){

  //console.log('2-is hovering on ' + element.id );

  let over = Rx.DOM.mouseover(element).map(identity(true));
  let out = Rx.DOM.mouseout(element).map(identity(false));

  return over.merge(out);
}
function getRowFromEvent(event){
  let table = document.getElementById('quakes_info');
  return Rx.Observable
           .fromEvent(table, event)
           .filter( (event) => {
             let el = event.target;
             return el.tagName === 'TD' && el.parentNode.id.length;
           })
           .pluck('target', 'parentNode')
           .distinctUntilChanged()
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
