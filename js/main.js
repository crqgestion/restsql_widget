(function () {
	/**
	 *Globals
	 */
	var attrList = ['temperature','battery voltage'];/*TODO not Hard-Coded*/
	var entity_type = 'Sensor';
	var data_graph = null;
	var entities_to_query=null;
	/**
	 * Functions
	 */

	function onNGSISuccess (entities){
		var server = MashupPlatform.prefs.get('history_server');

		data_graph=new Array();
		entities_to_query=0;
		for (var entity in entities) {
			entities_to_query++;
			getSQL(entity,server); /*Launch GETS*/
		}
	}
	function onSQLdata(entity_data){ /*Data here is a Room with temp and presuare*/
		var index=data_graph.length;
		var entity_id=entity_data[0].entityId;

		data_graph[entity_id]={
			data: new Array()
		};
		
		for (var i=0;i<entity_data.length;i++) {
			var attr_name=entity_data[i].attrName;
			if (data_graph[entity_id].data[attr_name]==undefined){ /*Create new data array to push data*/
				data_graph[entity_id].data[attr_name]=new Array();
			}
			data_graph[entity_id].data[attr_name].push([  parseInt(entity_data[i].recvTimeTs)*1000, parseFloat(entity_data[i].attrValue)  ]);/*Add data to graph obj*/
		}
		
		if (entities_to_query===0)
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
		MashupPlatform.wiring.pushEvent('data_out',(graph));

	}
	function getSQL(entity,server){
		var url= server+'/'+entity+'_'+entity_type;
		MashupPlatform.http.makeRequest(url, {
			method: 'GET',
			onSuccess: function (response) {
					entities_to_query--;
					var forecast_data;
					forecast_data = JSON.parse(response.responseText);
					if (forecast_data.error) {
						onError(response);
					} else {
						onSQLdata(forecast_data);
					}
			},
			onFailure: function (response) {
				entities_to_query--;
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