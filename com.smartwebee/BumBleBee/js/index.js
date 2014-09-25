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

	device:{},
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
		navigator.camera = cordova.require("org.bcsphere.camera.camera");
		
	},
	
	onBCReady : function(){
		//document.addEventListener("newDevice",app.newDevice,false)
		app.device = new BC.Device({deviceAddress:DEVICEADDRESS,type:DEVICETYPE});
		app.subscribe();
	},

	write : function(){
		
		//var device = new BC.Device({deviceAddress:"78:C5:E5:99:26:37",type:"BLE"});
		app.device.connect(function(){
			app.device.discoverServices(function(){
				var service = app.device.getServiceByUUID("fffa")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("ff00")[0];
					var text=document.getElementById("range").value;
					character.write("Hex",text,function(data){
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
		app.device.connect(function(){
			app.device.discoverServices(function(){
				var service = app.device.getServiceByUUID("fffa")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("ff00")[0];
					character.read(function(data){
						document.getElementById("charactisticArea").innerHTML=JSON.stringify(data.value.getHexString());
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
	subscribe : function(){
		
		app.device.connect(function(){
			app.device.discoverServices(function(){
				var service = app.device.getServiceByUUID("fffa")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("ff01")[0];					
					character.subscribe(app.notify);
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
	notify : function(data){
		var value = data.value.getHexString();
		if(value == "01"){			
			navigator.camera.tackPicture(function(){
			},function(){
				alert("take error!!");
			});
		}else if(value == "02"){	
			alert("准备调摄像头");
		}else{
			alert("get nothing!!");
		}
	},
	unsubscribe : function(){
		app.device.connect(function(){
			app.device.discoverServices(function(){
				var service = app.device.getServiceByUUID("fffa")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("ff01")[0];					
					character.unsubscribe(function(data){
						alert("unsubscribe success");					
					},function(){
						alert("unsubscribe error");
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