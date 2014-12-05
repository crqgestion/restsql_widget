(function () {
	
	var server = MashupPlatform.prefs.get('server');
	var entity = 'Room1';
	var entity_type = 'Room';//Room2_Room
	var url= server+'/'+entity+'_'+entity_type;

	MashupPlatform.http.makeRequest(url, {
			method: 'GET',
			onSuccess: function (response) {
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

})();