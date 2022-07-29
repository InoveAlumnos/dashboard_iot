var center_lat = -34.556961;
var center_lon = -58.495059;
var zoom = 13;
var map = new ol.Map({
target: 'map',
layers: [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  })
],
view: new ol.View({
  center: ol.proj.fromLonLat([center_lon, center_lat]),
  zoom: zoom
})
});

// -- set initial marker
const markerlayer = new ol.layer.Vector({
  source: new ol.source.Vector()
});
map.addLayer(markerlayer);

 
const iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'http://www.openstreetmap.org/openlayers/img/marker.png',
      //src: 'dron_yellow_25.png',
    }),
});

const element = document.getElementById('popup');

const popup = new Popup();
map.addOverlay(popup);


// display popup on click
map.on('click', function (e) {
  const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    const name = feature.get('name');
    const description = feature.get('description');
    popup.show(e.coordinate, `<b>${name}</b></br>${description}`);
  } else {
    popup.hide();
  }
  
});

function updateMarker(id, m_lon, m_lat) {
  marker_id = -1;
  for (i=0; i<markerlayer.getSource().getFeatures().length; i++) {
    const feature = markerlayer.getSource().getFeatures()[i];
    if(feature.get('name') == id) {
      marker_id = i;
      break;
    }
  }
  if(marker_id >= 0) {
    const feature = markerlayer.getSource().getFeatures()[marker_id];
    feature.set("description", `lat: ${m_lat}, long: ${m_lon}`);
    feature.getGeometry().setCoordinates(ol.proj.fromLonLat([m_lon, m_lat]));
  } else {
    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([m_lon, m_lat])),
      name: id,
      description: `lat: ${m_lat}, long: ${m_lon}`,
    });
    iconFeature.setStyle(iconStyle);
    markerlayer.getSource().addFeature(iconFeature);
  }
}

function movemarker() {
    const markernumber = 0;
    markerlayer.getSource().getFeatures()[markernumber].getGeometry().setCoordinates(ol.proj.fromLonLat([center_lon, center_lat - 0.005]));
}