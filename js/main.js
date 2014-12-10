(function () {
	"use strict";
	
	var server = MashupPlatform.prefs.get('history_server');
	var entity = 'Room1';
	var entity_type = 'Room';//Room2_Room
	var url= server+'/'+entity+'_'+entity_type;

	  var layout,
        ngsi,
        form,
        currentData,
        error,
        info;

	
	console.log('NGSI connection');
	ngsi = new NGSI.Connection(MashupPlatform.prefs.get('ngsi_server'), {
				use_user_fiware_token: true,
	});
	console.log(ngsi);
	
	MashupPlatform.http.makeRequest(url, {
			method: 'GET',
			onSuccess: function (response) {
					console.log('HTTP connection');
					console.log(response);
					var forecast_data;
					forecast_data = JSON.parse(response.responseText);
					if (forecast_data.error) {
							onError();
					} else {
							MashupPlatform.wiring.pushEvent('data_out',forecast_data);
							//onSuccess(forecast_data);
					}
			},
			onError: function () {
					onError();
			}
	});

	window.addEventListener("DOMContentLoaded", init, false);
	
	
})();