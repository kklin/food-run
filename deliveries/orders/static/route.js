// retrieve the orders for a food run, and execute a function on the response
function get_food(food_run_id, success_callback, failure_callback) {
    $.ajax({
        url     : "food_run/" + food_run_id,
        type    : "GET",
        success : function(response) {
                    success_callback(JSON.parse(response));
                  },
        failure : failure_callback,
    });
}

// make a food request based on the form input
function request_food() {
    $.ajax({
        url : "request_food", // the endpoint
        type : "POST", // http method
        data : { 'orderer'     : $('#orderer').val(),
                 name         : $('#name').val(),
                 quantity     : $('#quantity').val(),
                 food_run_id  : food_run_id }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#orderer').val(''); // remove the value from the input
            $('#name').val(''); // remove the value from the input
            $('#quantity').val(''); // remove the value from the input
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
            update_orders_list();
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            // $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
            //     " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};

var directionsService;
var placesService;
var directionsList;
var directionsMessages;
var ordersList;
var food_run_id;
var myLocation;
var geocoder;

// updates the display for the orders
function update_orders_list() {
    return new Promise(function() {
        get_food(food_run_id,
                function(orders) {
                    // clear the previous entries in the orders list
                    ordersList.empty();
                    for (var i = 0 ; i < orders.length ; i++) {
                        console.log(orders[i]);
                        // build the list item
                        li = "<li><div class=\"item\"><span class=\"quantity\">" + orders[i].quantity + "</span> <span class=\"name\">";
                        if (orders[i].quantity == 1) {
                            li += orders[i].name;
                        } else {
                            li += orders[i].name + "s";
                        }
                        li += "</span></div>";
                        li += "<div class=\"meta\">";
                        li += "requested by " + orders[i].orderer;
                        li += "</div>";
                        li += "</li>";
                        ordersList.append(li);
                    }
                },
                function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                });
    });
}

function initialize() {
  // initialize useful variables
  geocoder = new google.maps.Geocoder();
  // TODO: this is asynchronous so this data isn't always ready
  navigator.geolocation.getCurrentPosition(function(position) {
                                            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                            geocoder.geocode({'latLng': latLng},
                                                    function(result, status) { myLocation = result[1].formatted_address; })
                                            });
  directionsService = new google.maps.DirectionsService();
  placesService = new google.maps.places.PlacesService(($('#map').get(0)));
  directionsList = $('#directionsList');
  directionsMessages = $('#directions-messages');
  food_run_id = $('#food_run_id').val();
  ordersList = $('#orders-list');
  // update the UI
  update_orders_list();
}

// find a suitable restaurant, and call callback on the result
function findRestaurant(orders, callback) {
  //TODO: use promises
  //update_orders_list().then(function() {
      var query = "";
      for (var i = 0; i < orders.length; i++) {
        query += orders[i].name + " ";
      }
      // 282 2nd Street 4th floor, San Francisco, CA 94105
      var clicktimeOffice = new google.maps.LatLng(37.785636, -122.397119);
      console.log("Place search query: " + query);
      var request = {
        location: clicktimeOffice,
        radius: '500', // meters
        query: query
      };
      placesService.textSearch(request, function(results, status) {
        callback(results, status);
      });
//  });
}

function processRoute() {
    update_orders_list();
    get_food(food_run_id,
            function(orders) {
                findRestaurant(orders, function(results, status) {
                                        directionsList.empty();
                                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                          if (myLocation === undefined) {
                                              directionsMessages.html("<span class=\"error\">Your location has not been attained yet!</span>");
                                              return;
                                          }
                                          for (var i = 0; i < results.length; i++) {
                                            var place = results[i];
                                            console.log("Result " + i + ": " + place.name + " at " + place.geometry.location);
                                          }

                                          directionsMessages.empty();
                                          directionsMessages.append("Starting from <strong>" + myLocation + "</strong><br/>");
                                          directionsMessages.append("Making a food stop at <strong>" + results[0].name + "</strong><br/>");
                                          directionsMessages.append("And ending at the <strong>Clicktime office</strong>");
                                          calcRoute(myLocation, results[0].geometry.location,
                                                  function(response) {
                                                    showSteps(response);
                                                    directionsList.append("<li> Now buy those orders, you slave! </li>");
                                                    directionsList.append("<br/>");
                                                    calcRoute(results[0].geometry.location, '282 2nd Street 4th floor, San Francisco, CA 94105',
                                                        function(response) {
                                                            showSteps(response);
                                                        });
                                                  });
                                        } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                                            directionsMessages.html("<span class=\"error\">Uh oh... no suitable restaurants found</span>");
                                        }
                                    });
                });
}

function calcRoute(start, end, success) {
  // figure out the requested travel mode
  var myTravelMode = null;
  var directions_type = $('#directions_type').val();
  if (directions_type === 'Walking') {
      myTravelMode = google.maps.TravelMode.WALKING;
  } else if (directions_type === 'Biking') {
      myTravelMode = google.maps.TravelMode.BICYCLING;
  } else if (directions_type === 'Transit') {
      myTravelMode = google.maps.TravelMode.TRANSIT;
  }

  // construct request
  var request = {
      origin: start,
      destination: end,
      travelMode: myTravelMode
  };

  // Route the directions and pass the response to a
  // function to display each step
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      success(response);
    }
    // TODO: error handling
  });
}

function showSteps(directionResult) {
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    console.log(myRoute.steps[i].start_location + ": " + myRoute.steps[i].instructions);
    // TODO: these list items could contain more information
    directionsList.append("<li>" + myRoute.steps[i].instructions + "</li>");
  }
}

var main = function() {
    initialize();
    $('#route_button').click(function() {
        processRoute();
    });

    $('#refresh_button').click(function() {
        update_orders_list();
    });

    // Submit post on submit
    $('#request-food-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        request_food();
    });
}

$(document).ready(main)
