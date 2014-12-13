(function () {
	/**
	 *Globals
	 */
	var attrList = ['temperature','battery voltage'];/*TODO not Hard-Coded*/
	var entity_type = 'Sensor';
	var data_graph = null;
	var data_entities=null;
	/**
	 * Functions
	 */
	function setData2Grapth (sql_data,attrName){
		var data = new Array();
		for (var i = 0; i < sql_data.length; i++) {
			if (sql_data[i].attrName!=attrName)
				continue;
 			data.push( [  parseInt(sql_data[i].recvTimeTs)*1000, parseFloat(sql_data[i].attrValue)  ] );
		}
		return data;
	}
	
	function onNGSISuccess (entities){
		var server = MashupPlatform.prefs.get('history_server');

		data_graph=new Array();
		data_entities=0;
		for (var entity in entities) {
			data_entities++;
			getSQL(entity,server); /*Launch GETS*/
		}
	}
	function onSQLdata(sqldata){ /*Data here is a Room with temp and presuare*/
		for (var i = 0; i < attrList.length; i++) {
			data_graph.push(setData2Grapth(sqldata,attrList[i]));
		}
		if (data_entities===0)
			SendGraph();
	}
	function SendGraph(){
		var config={
			xaxis : {
				mode: 'time'
				},
			yaxis :{
				autoscale: true
			}
		};	
		/*Event HERE!*/
		var graph={config:config,data:data_graph};
		console.log('GRAPH');
		console.log(JSON.stringify(graph));
		MashupPlatform.wiring.pushEvent('data_out',JSON.stringify('START'));
		MashupPlatform.wiring.pushEvent('data_out',JSON.stringify(graph));
		MashupPlatform.wiring.pushEvent('data_out',JSON.stringify('END'));
	}
	function getSQL(entity,server){
		var url= server+'/'+entity+'_'+entity_type;
		MashupPlatform.http.makeRequest(url, {
			method: 'GET',
			onSuccess: function (response) {
					data_entities--;
					var forecast_data;
					forecast_data = JSON.parse(response.responseText);
					if (forecast_data.error) {
						onError(response);
					} else {
						onSQLdata(forecast_data);
					}
			},
			onFailure: function (response) {
				data_entities--;
				onError(response);
			}
		});
	}
	function onError (response){
		console.log('Error!');
		console.log(response);
	}
	
	/**
	 *Initialization
	 */
	var ngsi = new NGSI.Connection(MashupPlatform.prefs.get('ngsi_server'));
	/*Getting data**/
	ngsi.query([{
							isPattern: true,
							id: '.',/*All*/
							type: entity_type
					}],
					null,
					{
						flat: true,
						onSuccess: onNGSISuccess,
						onFailure: onError
					}
					);
	
})();