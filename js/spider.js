function lnbararea(self,series,typeChart,idSelectionCol,dimLabel,measureLabel){
$('#highcharts').highcharts({
            chart: {
            	type: typeChart,
        	},  
            title: {
                text: '',
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
              	title:{
                  text:dimLabel
                },
              	type:'category'
                //categories:dimOne
            },
            yAxis: {
                title: {
                    text: measureLabel
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (e) {
                                  if(idSelectionCol==0){
                                      	if(this.id>=0)
                                  			self.selectValues(idSelectionCol, [this.id], true);
                                  }
                                  else
                                        self.selectValues(idSelectionCol, [this.series.options.id], true);
                                }
                            }
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                },
            series:series
        });
}
function spider(series,dimOne){
$('#highcharts').highcharts({
        chart: {
            polar: true,
            type: 'line'
        },

        title: {
            text: '',
            x: -80
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories: dimOne,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: false,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
        },

        series:series
    });
}