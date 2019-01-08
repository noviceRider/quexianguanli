	//默认显示柱状图为true
	var showColumnChart = true;
	//当前显示图表的路径来源标识：1、表示模块使用分析，2、表示用户活跃分析
	var requestIdentity = null;
	//当前显示图表请求参数
	var requestData = [null,"today","week","month","quarter","year"];
	//当前显示图表内容参数
	var responseData = {};
	
	/**
	 * 功能：初始化页面信息
	 * @param 无
	 */
	$(function(){
		//初始化datagrid动态加载数据的url
		$('#ol').datagrid(Common.createDatagridOptionsParams(accessUrl, "", 135, {accessId:"9602"}));
	});
	
	/**
	* 功能：当选择一行时，复选框也只能选择这行
	* @param rowIndex(单击行下标)、rowData(单击行数据)
	*/
	function onClickRow(rowIndex,rowData){
		//设置成不全选
		$("#ol").datagrid("uncheckAll");
		//选择当前行
		$("#ol").datagrid("checkRow",rowIndex);
	}

	/**
	* 功能：根据输入的查询条件执行查询操作
	* @param 无
	*/
	function doSearch(){
		//searchForm输入框失去焦点
 		$("#searchForm input").blur();
 		//条件查询
 		var params = $('#searchForm').serializeObject();
 		params.accessId = "9602";
		$('#ol').datagrid('load', params); 
	}
	
	/**
	* 功能：清除选定的操作日志
	* @param 无
	*/
	function doDeleteLog() {
		//获取选中ID
		var selectedIds = Common.getSelectedIds('#ol', 'logId', 'batchLogId');
		var ids = [];
		for(var i in selectedIds){
			ids.push(selectedIds[i].value);
		}
		if(selectedIds.length > 0) {
			$.messager.confirm('提示信息','是否删除选中的操作日志？',function(r){
				if(r){
					$.ajax({  
						url: accessUrl,  
						data: {logIds:ids.join(","), accessId:"9604"},  
						type: 'post',  
						dataType: 'json',  
						success:function(data) {
							if(data.resultCode) {
								//处理成功，重新加载数据
								$('#ol').datagrid('reload');
								
								$.messager.alert('提示','成功删除选定的操作日志!','info');
							}
							else
								$.messager.alert('错误','处理过程中出现问题!','error');
						},  
						error : function() {
							$.messager.alert('错误','服务器内部错误!','error');
						}
					});		
				}
			});
		} else{
			$.messager.alert('提示信息','请选择需要删除的数据！','info');
		}
	}

	/**
	* 功能：清空所有的操作日志
	* @param 无
	*/
	function doClearAll() {
		$.messager.confirm('提示信息', '将从系统中清除所有的操作日志，该操作是不可逆的，是否继续？', function(r){
			if (r){
				$.ajax({  
					url: accessUrl,  
					type: 'post',
					data: {accessId:"9603"},
					dataType: 'json',
					success:function(data) {
						if(data.resultCode) {
							//处理成功，重新加载数据
							$('#ol').datagrid('reload');
							
							$.messager.alert('提示','成功清空所有的登录日志!','info');
						}
						else
							$.messager.alert('错误','处理过程中出现问题!','error');
					},  
					error : function() {
						$.messager.alert('错误','服务器内部错误!','error');
					}
				});		
			}
		});
	}
	
	/**
	 * 功能：定义模块使用排名弹窗格式并打开
	 * @param 无
	 */
	function openModuleSortWindow(){
		//格式化模块使用分析弹窗并打开
		$("#analysisOfUsed").show().window({
	 		 title: "模块使用分析",
			 modal:true,
	 		 resizable: false,
	 		 collapsible: false,
	 		 minimizable: false,
	 		 maximizable: false,
	 		 onClose: function(){
	 			$("#analysisOfUsed #searchForm").form('reset');
	 		 } 
		 });
		
		//设置切换图标
		$("#chartShape").html("<i class='fa fa-pie-chart' aria-hidden='true' style='font-size:24px;color:pink;vertical-align: middle;'></i>");
		//默认显示柱形图
		showColumnChart = true;
		//标识打开的是模块使用分析
		requestIdentity = 1;
		//设置图表参数，显示图表
		setChartParam();
	}
	
	/**
	 * 功能：定义活跃用户分析弹窗格式并打开
	 * @param 无
	 */
	function openUserSortWindow(){
		//格式化模块使用分析弹窗并打开
		$("#analysisOfUsed").show().window({
	 		 title: "活跃用户分析",
			 modal:true,
	 		 resizable: false,
	 		 collapsible: false,
	 		 minimizable: false,
	 		 maximizable: false,
	 		 onClose: function(){
	 			$("#analysisOfUsed #searchForm").form('reset');
	 		 } 
		 });
		
		//设置切换图标
		$("#chartShape").html("<i class='fa fa-pie-chart' aria-hidden='true' style='font-size:24px;color:pink;vertical-align: middle;'></i>");
		//默认显示柱形图
		showColumnChart = true;
		//标识打开的是用户活跃分析
		requestIdentity = 2;
		//设置图表参数，显示图表
		setChartParam();
	}
	
	/**
	 * 功能：根据时间范围获取分析结果
	 * 
	 */
	function doAnalysisByRangeTime(){
		setChartParam();
	}
	
	/**
	 * 功能：设置请求图表数据的参数，并获取响应参数
	 * @param param
	 */
	function setChartParam(param){
		//请求图表数据参数
		var data;
		
		//如果param未定义，则根据时间范围查询；否则，根据参数查询
		if(param==undefined){
			data = $("#analysisOfUsed #searchForm").serializeObject();
		} else{
			data = {"timeRange":requestData[param]};
		}
		//根据打开窗口标识查询，1、为模块使用分析，2、为用户活跃分析
		if(requestIdentity == 1){
			data.logicId = "09.05.02";
			$.ajax({  
				url: logicUrl,  
				type: 'post',
				data: data, 
				dataType: 'json',  
				success:function(data) {
					var names=[];
					var countNums=[];
					data = data.modules;
					for (var i = 0; i < data.length; i++) {
						names.push(data[i].moduleName);
						countNums.push(data[i].countNum);
					}
					responseData.names = names;
					responseData.countNums = countNums;
					showAnalysisChart();
				},  
				error : function() {
					$.messager.alert('错误','服务器内部错误!','error');
				}
			});
		} else if(requestIdentity == 2){
			data.logicId = "09.05.03";
			$.ajax({  
				url: logicUrl,  
				type: 'post',
				data: data, 
				dataType: 'json',  
				success:function(data) {
					var names=[];
					var countNums=[];
					data = data.users;
					for (var i = 0; i < data.length; i++) {
						names.push(data[i].userName);
						countNums.push(data[i].countNum);
					}
					responseData.names = names;
					responseData.countNums = countNums;
					showAnalysisChart();
				},  
				error : function() {
					$.messager.alert('错误','服务器内部错误!','error');
				}
			});
		}
	}
	
	/**
	 * 功能：显示分析结果图表
	 */
	function showAnalysisChart(){
		Highcharts.setOptions({
            lang: {
            	printChart:'打印图表',
                downloadJPEG: '下载JPEG 图片' , 
                downloadPDF: '下载PDF文档'  ,
                downloadPNG: '下载PNG 图片'  ,
                downloadSVG: '下载SVG 矢量图' , 
                exportButtonTitle: '导出图片'
            }
	    });
		if(requestIdentity == 1){
			if(showColumnChart){
				$('#mv').highcharts({
					chart: {
						type: 'column',
						width: 820,
						height: 460
					},
					title:{
						text: '模块使用分析'
					},
					xAxis: {
						categories: responseData.names,
						title: {
							align: 'high',
							text: '模块名'
						}
					},
					yAxis: {
						min: 0,
						//不能为小数
						allowDecimals:false,
						title: {
							align: 'high',
							text: '使用次数/次'
						}
					},
					tooltip: {                                                         
						valueSuffix: ' 次'                                       
					}, 
					credits: {
						enabled: false
					},
					series: [{
						name: '使用次数',
						data: responseData.countNums
					}]
				});
			}else{
				var jsonArr = [];
				for(var i=0; i<responseData.names.length; i++){
					var obj = [];
					obj.push(responseData.names[i]);
					obj.push(responseData.countNums[i]);
					jsonArr.push(obj);
				}
				$('#mv').highcharts({
					chart: {
						type: 'pie',
						width: 820,
						height: 460
					},
					credits:{
						enabled:false
					},
					title:{
						text: '模块使用分析'
					},
					subtitle:{
						text: '模块使用次数占比'
					},
					tooltip: {
						valueSuffix: ' 次'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								format: '{point.name}: {point.percentage:.1f} %'
							}
						}
					},
					series: [{
						type: 'pie',
						name: '使用次数',
						data: jsonArr
					}]
				});
			}
		} else{
			if(showColumnChart){
				$('#mv').highcharts({
					chart: {
						type: 'column',
						width: 820,
						height: 460
					},
					title:{
						text: '用户活跃分析'
					},
					xAxis: {
						categories: responseData.names,
						title: {
							align: 'high',
							text: '用户名'
						}
					},
					yAxis: {
						min: 0,
						//不能为小数
						allowDecimals:false,
						title: {
							align: 'high',
							text: '使用次数/次'
						}
					},
					tooltip: {                                                         
						valueSuffix: ' 次'                                       
					}, 
					credits: {
						enabled: false
					},
					series: [{
						name: '使用次数',
						data: responseData.countNums
					}]
				});
			}else{
				var jsonArr = [];
				for(var i=0; i<responseData.names.length; i++){
					var obj = [];
					obj.push(responseData.names[i]);
					obj.push(responseData.countNums[i]);
					jsonArr.push(obj);
				}
				$('#mv').highcharts({
					chart: {
						type: 'pie',
						width: 820,
						height: 460
					},
					credits:{
						enabled:false
					},
					title:{
						text: '用户活跃分析'
					},
					subtitle:{
						text: '用户使用次数占比'
					},
					tooltip: {
						valueSuffix: ' 次'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								format: '{point.name}: {point.percentage:.1f} %'
							}
						}
					},
					series: [{
						type: 'pie',
						name: '使用次数',
						data: jsonArr
					}]
				});
			}
		}
		
	}
	
	/**
	 * 功能：改变显示图表类型
	 */
	function changeChartShape(){
		if(showColumnChart){
			$("#chartShape").html("<i class='fa fa-bar-chart' aria-hidden='true' style='font-size:22px;color:blue;vertical-align: middle;'></i>");
			showColumnChart = false;
			showAnalysisChart();
		}else{
			$("#chartShape").html("<i class='fa fa-pie-chart' aria-hidden='true' style='font-size:24px;color:pink;vertical-align: middle;'></i>");
			showColumnChart = true;
			showAnalysisChart();
		}
	}