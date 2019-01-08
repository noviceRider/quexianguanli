/**
* 加载页面
*/
$(function(){
	projectList();		//调用项目下拉列表方法
	defectStatus();		//调用页面加载方法
})
/**
 * 页面加载
 */
function defectStatus(){
	timeVerification();		//调用时间验证
	$.ajax({
		url:basePath+'/defectStatusDistribution.json',
		type:'post',
		dataType:'json',
		success:function(data){
			var bing = []; //饼图数据
			for(index in data.rows){
				bing[index] = [
					data.rows[index].issueStateName,
					data.rows[index].count
				]
			}
			Highcharts.chart('showdefectStatusDistribution', {
				    chart: {
				        type: 'column'
				    },
				    title: {
				        text: '缺陷状态分布'
				    },
				    xAxis: {
				        type: 'category',
				        labels: {
				            rotation: 0,
				            style: {
				                fontSize: '13px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: '数值'
				        }
				    },
				    legend: {
				        enabled: false
				    },
				    series: [{
				        name: '缺陷状态',
				        data: bing,
				        dataLabels: {
				            enabled: true,
				            rotation: 0,
				            color: '#FFFFFF',
				            align: 'right',
				            format: '{point.y:.1f}',
				            y: 0,
				            style: {
				                fontSize: '15px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    }],
				    plotOptions:{
				    	column: {
				            pointWidth:50
				            }
				    }
				});
		}
	})
}

/**
* 项目下拉列表
*/
function projectList(){
	$.ajax({
		url:basePath+'/queryProjectTwo.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#defectStatusDistributionProjectId").combobox({
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
* 搜索
*/
function defectStatusDistribution(){
	var verify = $("#defectStatusDistributionSearch").form('validate');//判断返回的true还是false
	if(verify){
		var params = $("#defectStatusDistributionSearch").serializeObject();//序列化表单
		$.ajax({
			url:basePath+'/defectStatusDistribution.json',
			type:'post',
			data:params,
			dataType:'json',
			success:function(data){
				var bing = []; //饼图数据
				for(index in data.rows){
					bing[index] = [
						data.rows[index].issueStateName,
						data.rows[index].count
					]
				}
				Highcharts.chart('showdefectStatusDistribution', {
					    chart: {
					        type: 'column'
					    },
					    title: {
					        text: '缺陷状态分布'
					    },
					    xAxis: {
					        type: 'category',
					        labels: {
					            rotation: 0,
					            style: {
					                fontSize: '13px',
					                fontFamily: 'Verdana, sans-serif'
					            }
					        }
					    },
					    yAxis: {
					        min: 0,
					        title: {
					            text: '数值'
					        }
					    },
					    legend: {
					        enabled: false
					    },
					    series: [{
					        name: '缺陷状态',
					        data: bing,
					        dataLabels: {
					            enabled: true,
					            rotation: 0,
					            color: '#FFFFFF',
					            align: 'right',
					            format: '{point.y:.1f}',
					            y: 0,
					            style: {
					                fontSize: '15px',
					                fontFamily: 'Verdana, sans-serif'
					            }
					        }
					    }],
					    plotOptions:{
					    	column: {
					            pointWidth:50
					            }
					    }
					});
			}
		})
	}else{
		 $.messager.alert('警告','登记时间不正确'); 
	}
	
}

/**
 * 时间
 */
function timeVerification(){
	$("#defectStatusDistributionStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//开始时间
	$("#defectStatusDistributionEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//完成时间
}

function timevalidate(){
	$("#defectStatusDistributionStartTime").datebox('isValid');
	$("#defectStatusDistributionEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#defectStatusDistributionStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#defectStatusDistributionEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
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