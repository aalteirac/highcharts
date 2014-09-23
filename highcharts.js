requirejs.config({
	shim : {
		"extensions/highcharts/js/highchartslib" : {
			"deps" : []
		},
      	"extensions/highcharts/js/data" : {
			"deps" : ["./highchartslib"]
		},
        "extensions/highcharts/js/highlightSerie" : {
              "deps" : ["./highchartslib"]
        },
      	"extensions/highcharts/js/highcharts-more" : {
              "deps" : ["./highchartslib"]
        },
       	"extensions/highcharts/js/spider" : {
              "deps" : ["./highchartslib"]
        },
      	"extensions/highcharts/js/exporting" : {
              "deps" : ["./highchartslib"]
        },
        "extensions/highcharts/js/highslide-full.min" : {
              "deps" : ["./highchartslib"]
        },
        "extensions/highcharts/js/highslide.config" : {
              "deps" : ["./highchartslib","./highslide-full.min"]
        },
      
	}
});


define( ["jquery","text!./css/highslide.css","./js/highchartslib","./js/data","./js/exporting","./js/highslide-full.min","./js/highlightSerie","./js/highslide.config","./js/spider","./js/highcharts-more"], function ( $,hcss) {
	'use strict';
  	$( "<style>" ).html( hcss ).appendTo( "head" );
	return {
		initialProperties: {
			version: 1.0,
            chartType:"line",
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		},
		definition: 
			{
			type: "items",
			component: "accordion",
			items: {
              	additionalProperties: {
					type: "items",
					label: "Chart Settings",
					items: {
						property1: {
                          	ref: "chartType",
                          	type : "string",
							component : "dropdown",
							label : "Chart Type",
                            options : [{value:"line",label:"Line"},{value:"area",label:"Area"},{value:"bar",label:"Bar"},{value:"spider",label:"Spider"}]
                        },
                        CustomSwitchProp: {
                          type: "boolean",
                          component: "switch",
                          label: "Show Null Value",
                          ref: "shownull",
                          options: [ {
                              value: true,
                              label: "On"
                          }, {
                              value: false,
                              label: "Off"
                          } ],
                          defaultValue: true
                      	}	
                    }
                },
				dimensions: {
					uses: "dimensions",
					min: 1,
                  	max:2
				},
				measures: {
					uses: "measures",
					min: 1,
                  	max:1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {
          	var lastrow = 0;
          	var self=this;
			var html = '<div id="highcharts" style="min-width: 310px; height: 100%; margin: 0 auto"></div>';
          	$element.html( html );
          	var dimLabel="";
          	var measureLabel=""
          	dimLabel=this.backendApi.getDimensionInfos()[0].qFallbackTitle;
            var dimCpt=this.backendApi.getDimensionInfos().length;
          	$.each(this.backendApi.getMeasureInfos(), function(key, value) {
				 measureLabel=value.qFallbackTitle; 
              	 	
			});
          	var dimOne=[];
          	var dimTwo=[];
            var series=[];
          	var idSelectionCol=0;
          	var typeChart=typeof(layout)!='undefined'?layout.chartType:'line';
          	var maxLgt=0;
            function isIn(arr,name,y){
              for(var k=0;k<arr.data.length;k++){
                	if(arr.data[k].name==name && arr.data[k].y==y)
                      return true;
              }
              return false;
            }
            if(dimCpt==1){
              	series.push({name:dimLabel,data:[],id:""});
                this.backendApi.eachDataRow(function(rownum, row) {
                  lastrow = rownum;
                  if((row[0].qText=="-" && layout.shownull)|| row[0].qText!="-"){
                    dimOne.push(row[0].qText);
                    series[0].data.push({name:row[0].qText,y:parseFloat(row[1].qText),id:row[0].qElemNumber});
                  }
              	});
            }
            else{
              idSelectionCol++;	
              this.backendApi.eachDataRow(function(rownum, row) {
                lastrow = rownum;
                if(row[1] && ((row[0].qText=="-" && layout.shownull)|| row[0].qText!="-")){
                  if(dimOne.indexOf(row[0].qText)===-1) dimOne.push(row[0].qText);
                  if(row[1] && dimTwo.indexOf(row[1].qText)===-1 && row[1].qText!='-') {
                     dimTwo.push(row[1].qText);
                     series.push({name:row[1].qText,data:[],id:row[1].qElemNumber});
                  }
                  for(var i=0;i<series.length;i++){
                    if(series[i].name===row[1].qText){
                      if(!isIn(series[i],row[0].qText,parseFloat(row[2].qText))){
                        series[i].data.push({name:row[0].qText,y:parseFloat(row[2].qText)});
                        maxLgt=Math.max(maxLgt,series[i].data.length);
                      }
                    }
                  }
                }
              });
            }
          	for(var i=0;i<series.length;i++){
              for(var j=0;j<dimOne.length;j++){
                var found=false;
                for(var k=0;k<series[i].data.length;k++){
                  if(series[i].data[k].name==dimOne[j])
                    found=true;
                }
                if(!found){
                  //insert null
                  series[i].data.splice(j,0,{name:dimOne[j],y:null});
                }
              }
            }
          	
          	var requestPage = [{
					qTop : lastrow + 1,
					qLeft : 0,
					qWidth : 10, //should be # of columns
					qHeight : Math.min(50, this.backendApi.getRowCount() - lastrow)
			}];
          	if(this.backendApi.getRowCount()!=lastrow+1)
              self.backendApi.getData(requestPage).then(function(dataPages) {
                  self.paint($element,layout);
              });
          	else
              if(typeChart=='spider')
              	spider(series,dimOne);
          	  else	
				lnbararea(self,series,typeChart,idSelectionCol,dimLabel,measureLabel);
         
		}
	};
} );
