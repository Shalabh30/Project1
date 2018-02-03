  var markers = [];
  
   // this function displays map and adds functionality
      function initMap() {
       var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 35.855007, lng: -78.840645},
          zoom: 6

        }); // map object end

                 map.addListener('click', function(e) {
                placeMarkerAndPanTo(e.latLng, map);

              }); // click function end
            }



                function setMapOnAll(map) {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        } // loop end

      } // setMapOnAll function end 

            function placeMarkerAndPanTo(latLng, map) {

              var marker = new google.maps.Marker({
                position: latLng,
                map: map
              }); // marker object end
              
              map.panTo(latLng);   
              setMapOnAll(null);
             
              markers.push(marker);
              
              var lat = marker.getPosition().lat();
              var lng = marker.getPosition().lng();

                     
              console.log("marker position is" ,lat, lng); 

              var geocoder = new google.maps.Geocoder;
             



              function geocodeLatLng(geocoder, map) {
              geocoder.geocode({'location': latLng}, function(results, status) {
                if (status === 'OK') {
                  
                  
                  var locality, state;
                  getState: for (let i = 0; i < results[0].address_components.length; i++) {
                    for (let j = 0; j < results[0].address_components[i].types.length; j++) {
                      if (results[0].address_components[i].types[j] === "locality") {
                        locality = results[0].address_components[i].long_name;
                      } // locality end
                      if (results[0].address_components[i].types[j] === "administrative_area_level_1") {
                        state = results[0].address_components[i].long_name;
                        getArticles(locality, state, "P");
                        break getState;

                      }
                    } 
                  } //getState loop end
                  console.log(locality);
                  console.log(state);
                } // if status statement end
              }); // geocoder.geocode function end
            } // geocodeLatLng function end

      
                
                  //console.log(state);

            geocodeLatLng(geocoder, map);




   

      } // map "initmap" function end



function getArticles(locality, state, type) {

  var conceptName;
 
  var name;
  if (type === "P") {
    name = locality;
  } else {
    name = state;
  }
  var urlGeo = "https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/semantic/v2/geocodes/query.json";
  urlGeo += '?' + $.param({
    'api-key': "b9f91d369ff59547cd47b931d8cbc56b:0:74623931",
    'name': name,
    'feature_class': type
  });
  $.ajax({
    url: urlGeo,
    method: 'GET'
  }).done(function(result) {
    console.log(result);
    if (result.results.length != 0) {
      if (type === "P") {
        for (let i = 0; i < result.results.length; i++) {
          if (result.results[i].admin_name1 === state) {
            conceptName = result.results[i].concept_name;
            i = result.results.length;
          }
        }
      } else {
        conceptName = result.results[0].concept_name;
      }
      for (let i = 0; i < conceptName.length; i++) {
        if (conceptName[i] === " ") {
          conceptName = conceptName.slice(0, i) + "%20" + conceptName.slice(i+1);
        }
      }
      var urlSem = "https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/semantic/v2/concept/name/nytd_geo/" + conceptName;
      urlSem += '?' + $.param({
      'api-key': "b9f91d369ff59547cd47b931d8cbc56b:0:74623931",
      'fields': "article_list"
      });
      console.log(urlSem);
      $.ajax({
        url: urlSem,
        method: 'GET'
      }).done(function(result) {


        $("#well-section").empty();
        renderArticles(result.results[0].article_list.results);

        console.log("urlSem result is ", result);

      }).fail(function(err) {
        throw err;
      });
    } else {
      getArticles(locality, state, "A");
    }
  }).fail(function(err) {
    throw err;
  });


}


  function renderArticles(arr) {
    for (let i = 0; i < arr.length; i++) {
      var panel = $("<div>");
      panel.attr("class", "panel");
      var heading = $("<div>");
      heading.attr("class", "panel-heading");
      panel.append(heading);
      var link = $("<a>");
      link.attr("href", arr[i].url);
      link.attr("target", "_blank");
      heading.append(link);
      var title = $("<strong>");
      title.attr("class", "panel-title");
      title.text(arr[i].title);
      link.append(title);
      var body = $("<div>");
      body.attr("class", "panel-body");
      body.text(arr[i].body);
      panel.append(body);
      $("#well-section").append(panel);
    }
  }
$("#clear").on("click", function() {

  $("#well-section").empty();
});

// function SearchBtn() {
//         getArticles();
//         var startDate = $("#start-year");
//         var endDate = $("#end-year");
//         var newsDate = result.results[0].article_list.results.date
//         if(startDate.charAt(0)=== newsDate.charAt(0) && startDate.charAt(1)=== newsDate.charAt(1) && startDate.charAt(2)=== newsDate.charAt(2) && startDate.charAt(3)=== newsDate.charAt(3)){
//             $("#well-section").empty();
//         renderArticles(result.results[0].article_list.results);

//         console.log("urlSem result is ", result);
//           }
// }