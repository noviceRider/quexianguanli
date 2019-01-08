$(function(){
	projectList();		//调用项目下拉列表
	timeVerification();		//调用时间验证
	$.ajax({
		url:basePath+'/defectSeverity.json',
		type:'post',
		dataType:'json',
		success:function(data){
			console.log(data);
			var bing = []; //饼图数据
			var sum = 0;
			for(index in data.rows){
				sum += data.rows[index].count;
			}
			
			for(index in data.rows){
				bing[index] = {
					name:data.rows[index].issueSeverityName,
					y: data.rows[index].count/sum
				}
			}
			
			Highcharts.chart('showdefectSeverity', {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'
				},
				title: {
					text: '缺陷严重程度'
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						innerSize:100 ,
						size:300 ,
						cursor: 'pointer',
						dataLabels: {
							enabled: false
						},
						showInLegend: true
					}
				},
				series:[{
					data:bing
				}]
			});
		}
	})
})

/**
* 项目下拉列表
*/
function projectList(){
	$.ajax({
		url:basePath+'/queryProjectTwo.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#defectSeverityProjectId").combobox({
			    valueField:'projectId', 
			    textField:'projectName',
			    panelHeight:'100px',
			    width:120 ,
			    data:data.rows ,
			    loadFilter:function(data){
				  	   data.unshift({projectId:'',projectName:'--请选择--'});
				  	   return data;
				  	}
			});
		}
	})
}

/**
 * 时间
 */
function timeVerification(){
	$("#defectSeverityStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//开始时间
	$("#defectSeverityEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//完成时间
}

function timevalidate(){
	$("#defectSeverityStartTime").datebox('isValid');
	$("#defectSeverityEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#defectSeverityStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#defectSeverityEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
        	var judge;
        	if(!isNaN(time1) && !isNaN(time2)){
        		judge =  time1 <= time2;
        	} else {
        		judge = true;
        	}
            return judge;
        },
        message:'开始时间要小于结束时间'
    }
});

/**
* 搜索
*/
function defectSeverity(){
	var verify = $("#defectSeveritySearch").form('validate');//判断返回的是true还是false
	if(verify){
		var params = $("#defectSeveritySearch").serializeObject();//序列化表单
		$.ajax({
			url:basePath+'/defectSeverity.json',
			type:'post',
			dataType:'json',
			data:params,
			success:function(data){
				console.log(data);
				var bing = []; //饼图数据
				var sum = 0;
				for(index in data.rows){
					sum += data.rows[index].count;
				}
				
				for(index in data.rows){
					bing[index] = {
						name:data.rows[index].issueSeverityName,
						y: data.rows[index].count/sum
					}
				}
				
				Highcharts.chart('showdefectSeverity', {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie'
					},
					title: {
						text: '缺陷严重程度'
					},
					tooltip: {
						pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							innerSize:100 ,
							size:300 ,
							cursor: 'pointer',
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						}
					},
					series:[{
						data:bing
					}]
				});
			}
		})
	}else{
		 $.messager.alert('警告','登记时间不正确'); 
	}
}