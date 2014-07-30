/*
	Copyright 2013-2014, JUMA Technology

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var app = {

    // Application Constructor
    initialize: function() {
        app.bindCordovaEvents();
    },
    
    bindCordovaEvents: function() {
		document.addEventListener('deviceready',app.onDeviceReady,false);
        document.addEventListener('bcready', app.onBCReady, false);
    },
    
	onDeviceReady : function(){
		var BC = window.BC = cordova.require("org.bcsphere.bcjs");
	},
	
	onBCReady : function(){

	},
	
	write : function(){
		var device = new BC.Device({deviceAddress:"20:CD:39:AD:65:20",type:"BLE"});
		device.connect(function(){
			device.discoverServices(function(){
				var service = device.getServiceByUUID("ffe0")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("ffe1")[0];
					var text=document.getElementById("youWrite").value;
					character.write("ASCII",text,function(data){
						alert(JSON.stringify(data));
					},function(){
						alert("write error!");
					});
				},function(){
					alert("discoverCharacteristics error!");
				});
			},function(){
				alert("discoverServices error!");
			});
		},function(){
			alert("connnect error!");
		});
	},
	read : function(){
		var device = new BC.Device({deviceAddress:"20:CD:39:AD:65:20",type:"BLE"});
		device.connect(function(){
			device.discoverServices(function(){
				var service = device.getServiceByUUID("ffe0")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("ffe1")[0];
					character.read(function(data){
						alert(JSON.stringify(data));
						document.getElementById("charactisticArea").innerHTML=JSON.stringify(data.value.getASCIIString());
						alert(JSON.stringify(data));
					},function(){
						alert("read error!");
					});
				},function(){
					alert("discoverCharacteristics error!");
				});
			},function(){
				alert("discoverServices error!");
			});
		},function(){
			alert("connnect error!");
		});
	},
};
