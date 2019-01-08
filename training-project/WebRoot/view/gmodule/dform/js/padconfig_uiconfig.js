var addWidget = null;//控件中的data
var widgtData;//txt配置文本中的数据
var textId;//属性框显示编号
//easyui-propertygrid中name和value值修改
var mycolumns = [[
                  {field:'name',title:'属性',width:100,sortable:true},
                  {field:'value',title:'值',width:100,resizable:false}
              ]];

/**
 * 初始化
 */
$(function(){
	/*if($("#uiConfigId").textbox("getValue") != null && $("#uiConfigId").textbox("getValue") != ''){
		//回显视图
		echoPreview();
	}*/
	$.ajax({
		url: "js/widget.txt",
		type: "post",
		dataType: "json",
		success: function(data){
			widgtData = data;
		}	
	});
	
});

/**
 * 初始化组件列表
 */
function initWidget(){
	//编号初始化赋值1000
	textId = 1000;
	//隐藏图片
	$("#previewImg").css("display","none");
	
	$("#container_preview").empty();
	//加载控件数据
	$.ajax({
		url: "js/widget.txt",
		type: "post",
		dataType: "json",
		success: function(data){
			var $p = $("#widgetList").empty();
			//加载左边控件
			for(var i in data){
				//图片加载地址
				var imgSrc = "images/buttons/"+i+".png";
				//显示控件名的span的id
				var widgetSpanId = "widgetSpan" + i;
				if(i == 0){
					$("<div class='prompt' style='text-align:center;'>布局控件</div>").appendTo($p);
				}else if(i == 3){
					$("<div class='prompt' style='text-align:center;'>文本控件</div>").appendTo($p);
				}
				$("<div class='item_widget'><img src='"+imgSrc+"' style='height:24px;rowwidth:30px;'><span id='"+widgetSpanId+"'></span</div>")
				.attr("data", JSON.stringify(data[i]))
				//.text(data[i].name)
				.click(function(){
					$("#previewImg").attr("src","");
					var item = JSON.parse($(this).attr("data"));
					addWidget = item;
					$("#pg_widget").propertygrid({
						data: item.properties,
						rowStyler: function(index,row){
							if (row.group == "noShow"){
								return 'display:none'; 
							}
							if(row.flag == "id"){
								row.value = textId;
							}else if(row.flag == "img"){
								$("#previewImg").attr("src",""+row.value+"");
								$("#previewImg").css("display","block");
								return 'display:none'; 
							}
							
						}
					});
					if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
				})
				.appendTo($p);
				//显示控件名
				$("#"+widgetSpanId+"").text(data[i].name);
			}
			$("#pg_widget").propertygrid({
				data: ""
			});
		}
	});
}

/**
 * 属性网络点击事件
 */
function pgClick(){
	var row = $("#pg_widget").propertygrid("getSelected");
	if(row.editor == "text-name" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#optionsTn_datagrid").datagrid('loadData',data);
		}
		//打开对话框
		$("#optionsTnAdd").dialog({
			closed: false
		});
	}else if(row.editor == "value-text" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#optionsVt_datagrid").datagrid('loadData',data);
		}
		//打开对话框
		$("#optionsVtAdd").dialog({
			closed: false
		});
	}else if(row.editor == "select" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#addSelectName").val(data.name);
			$("#addSelectDefault").val(data["default"]);
			$("#select_datagrid").datagrid('loadData',data.options);
		}
		//打开对话框
		$("#selectAdd").dialog({
			closed: false
		});
	}else if(row.editor == "descList"){
		if(row.value != "" && row.value != "[]"){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#paveDamage_datagrid").datagrid('loadData',data[0].paveDamage);
			$("#apronDevice_datagrid").datagrid('loadData',data[1].apronDevice);
		}
		//打开对话框
		$("#descListAdd").dialog({
			closed: false
		});
	}else if(row.editor == "checks" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#checks_datagrid").datagrid('loadData',data);
		}
		//打开对话框
		$("#checksAdd").dialog({
			closed: false
		});
	}else if(row.editor == "useInfo" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			//将linkedName拼接为字符串回显
			for(var i in data.options){
				if(data.options[i].linkedName != ""){
					var str ="";
					for(var j in data.options[i].linkedName){
						if(j < data.options[i].linkedName.length-1){
							str = str + data.options[i].linkedName[j] + ",";
						}else{
							str = str + data.options[i].linkedName[j];
						}
					}
					data.options[i].linkedName = str;
				}
			}
			$("#useInfo_datagrid").datagrid('loadData',data.options);
			$("#addUseInfoName").val(data.name);
			$("#addUseInfoDefault").val(data["default"]);
		}
		//打开对话框
		$("#useInfoAdd").dialog({
			closed: false
		});
	}else if(row.editor == "deviceInfo" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			//将linkedName拼接为字符串回显
			for(var i in data.options){
				if(data.options[i].linkedName != ""){
					var str ="";
					for(var j in data.options[i].linkedName){
						if(j < data.options[i].linkedName.length-1){
							str = str + data.options[i].linkedName[j] + ",";
						}else{
							str = str + data.options[i].linkedName[j];
						}
					}
					data.options[i].linkedName = str;
				}
			}
			$("#deviceInfo_datagrid").datagrid('loadData',data.options);
			$("#addDeviceInfoName").val(data.name);
		}
		//打开对话框
		$("#deviceInfoAdd").dialog({
			closed: false
		});
	}else if(row.editor == "apuInfo" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			//将linkedName拼接为字符串回显
			for(var i in data.options){
				if(data.options[i].linkedName != ""){
					var str ="";
					for(var j in data.options[i].linkedName){
						if(j < data.options[i].linkedName.length-1){
							str = str + data.options[i].linkedName[j] + ",";
						}else{
							str = str + data.options[i].linkedName[j];
						}
					}
					data.options[i].linkedName = str;
				}
			}
			$("#apuInfo_datagrid").datagrid('loadData',data.options);
			$("#addApuInfoName").val(data.name);
			$("#addApuInfoDefault").val(data["default"]);
		}
		//打开对话框
		$("#apuInfoAdd").dialog({
			closed: false
		});
	}else if(row.editor == "text-t-p" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#optionsTtp_datagrid").datagrid('loadData',data);
		}
		//打开对话框
		$("#optionsTtpAdd").dialog({
			closed: false
		});
	}else if(row.editor == "header" && row.value != "[]"){
		if(row.value != ""){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			$("#header_datagrid").datagrid('loadData',data);
		}
		//打开对话框
		$("#headerAdd").dialog({
			closed: false
		});
	}else if(row.editor == "columns" && row.value != "[]"){
		if(row.value != "" && row.value != "[]"){
			//如果有数据加载数据
			var data = JSON.parse(row.value);
			for(var i in data.columns){
				if(data.columns[i].names != ""){
					var str ="";
					for(var j in data.columns[i].names){
						if(j < data.columns[i].names.length-1){
							str = str + data.columns[i].names[j] + ",";
						}else{
							str = str + data.columns[i].names[j];
						}
					}
					data.columns[i].names = str;
				}
			}
			$("#checkItemData_datagrid").datagrid('loadData',data[0].data);
			$("#addColumnsCheckItemName").val(data[0].names);
			$("#addColumnsCheckItemType").val(data[0].type);
			$("#arriveTimeDefault_datagrid").datagrid('loadData',data[1]["default"]);
			$("#addColumnsArriveTimeName").val(data[1].names);
			$("#addColumnsArriveTimeType").val(data[1].type);
			$("#checkFlagDefault_datagrid").datagrid('loadData',data[2]["default"]);
			$("#addColumnsCheckFlagName").val(data[2].names);
			$("#addColumnsCheckFlagType").val(data[2].type);
		}
		//打开对话框
		$("#columnsAdd").dialog({
			closed: false
		});
	}
	
}

/**
 * optionsTn属性对话框添加
 */
function doAddOptionsTn(){
	//给数据网络添加input框中的数据
	$("#optionsTn_datagrid").datagrid("appendRow",{
		text: $("#addTextTn").val(),
		name: $("#addNameTn").val()
	});
	//清空输入框
	$("#addTextTn").val("");
	$("#addNameTn").val("");
}

/**
 * options属性对话框删除
 */
function doRemoveOptionsTn(){
	//获取选中行
	var row = $("#optionsTn_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#optionsTn_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#optionsTn_datagrid").datagrid("deleteRow",index);
}


/**
 * options属性对话框保存
 */
function doSaveOptionsTn(){
	//获取对话框中数据网络的数据
	var data = $("#optionsTn_datagrid").datagrid("getRows");
	//解析为json字符串
	var dataJson = JSON.stringify(data);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#optionsTnAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#optionsTn_datagrid').datagrid('loadData', { total: 0, rows: [] });  
}

/**
 * options属性对话框取消
 */
function doCancelOptionsTn(){
	//关闭对话框
	$("#optionsTnAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#optionsTn_datagrid').datagrid('loadData', { total: 0, rows: [] });  
}

/**
 * optionsVt属性对话框添加
 */
function doAddOptionsVt(){
	//给数据网络添加input框中的数据
	$("#optionsVt_datagrid").datagrid("appendRow",{
		value: $("#addValueVt").val(),
		text: $("#addTextVt").val()
	});
	//清空输入框
	$("#addValueVt").val("");
	$("#addTextVt").val("");
}

/**
 * optionsVt属性对话框删除
 */
function doRemoveOptionsVt(){
	//获取选中行
	var row = $("#optionsVt_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#optionsVt_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#optionsVt_datagrid").datagrid("deleteRow",index);
}


/**
 * optionsVt属性对话框保存
 */
function doSaveOptionsVt(){
	//获取对话框中数据网络的数据
	var data = $("#optionsVt_datagrid").datagrid("getRows");
	//解析为json字符串
	var dataJson = JSON.stringify(data);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#optionsVtAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#optionsVt_datagrid').datagrid('loadData', { total: 0, rows: [] });  
}

/**
 * optionsVt属性对话框取消
 */
function doCancelOptionsVt(){
	//关闭对话框
	$("#optionsVtAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#optionsVt_datagrid').datagrid('loadData', { total: 0, rows: [] });  
}

/**
 * select属性对话框添加
 */
function doAddSelect(){
	//给数据网络添加input框中的数据
	$("#select_datagrid").datagrid("appendRow",{
		value: $("#addSelectValue").val(),
		text: $("#addSelectText").val()
	});
	//清空输入框
	$("#addSelectValue").val("");
	$("#addSelectText").val("");
}

/**
 * select属性对话框删除
 */
function doRemoveSelect(){
	//获取选中行
	var row = $("#select_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#select_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#select_datagrid").datagrid("deleteRow",index);
}


/**
 * select属性对话框保存
 */
function doSaveSelect(){
	//获取对话框中数据网络的数据
	var data = $("#select_datagrid").datagrid("getRows");
	//定义对象
	var select = {};
	select.name = $("#addSelectName").val();
	select["default"] = $("#addSelectDefault").val();
	select.options = data;
	//解析为json字符串
	var dataJson = JSON.stringify(select);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#selectAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#select_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$("#addSelectName").val("");
	$("#addSelectDefault").val("");
}

/**
 * select属性对话框取消
 */
function doCancelSelect(){
	//关闭对话框
	$("#selectAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#select_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$("#addSelectName").val("");
	$("#addSelectDefault").val("");
}

/**
 * paveDamage属性添加
 */
function doAddPaveDamage(){
	//给数据网络添加input框中的数据
	$("#paveDamage_datagrid").datagrid("appendRow",{
		value: $("#addPaveDamageValue").val(),
		text: $("#addPaveDamageText").val()
	});
	//清空输入框
	$("#addPaveDamageValue").val("");
	$("#addPaveDamageText").val("");
}

/**
 * apronDevice属性添加
 */
function doAddApronDevice(){
	//给数据网络添加input框中的数据
	$("#apronDevice_datagrid").datagrid("appendRow",{
		value: $("#addApronDeviceValue").val(),
		text: $("#addApronDeviceText").val()
	});
	//清空输入框
	$("#addApronDeviceValue").val("");
	$("#addApronDeviceText").val("");
}

/**
 * paveDamage属性删除
 */
function doRemovePaveDamage(){
	//获取选中行
	var row = $("#paveDamage_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#paveDamage_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#paveDamage_datagrid").datagrid("deleteRow",index);
}

/**
 * apronDevice属性删除
 */
function doRemoveApronDevice(){
	//获取选中行
	var row = $("#apronDevice_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#apronDevice_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#apronDevice_datagrid").datagrid("deleteRow",index);
}


/**
 * descList属性对话框保存
 */
function doSaveDescList(){
	//获取对话框中数据网络的数据
	var pdData = $("#paveDamage_datagrid").datagrid("getRows");
	var adData = $("#apronDevice_datagrid").datagrid("getRows");
	//定义数组
	var paveDamageObj = {};
	paveDamageObj.paveDamage = pdData;
	var apronDeviceObj = {};
	apronDeviceObj.apronDevice = adData;
	var descList = [];
	descList.push(paveDamageObj);
	descList.push(apronDeviceObj);
	//解析为json字符串
	var dataJson = JSON.stringify(descList);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#descListAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#paveDamage_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$('#apronDevice_datagrid').datagrid('loadData', { total: 0, rows: [] });
}

/**
 * descList属性对话框取消
 */
function doCancelDescList(){
	//关闭对话框
	$("#descListAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#paveDamage_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$('#apronDevice_datagrid').datagrid('loadData', { total: 0, rows: [] });
}

/**
 * checks属性对话框添加
 */
function doAddChecks(){
	//给数据网络添加input框中的数据
	$("#checks_datagrid").datagrid("appendRow",{
		checkLabel: $("#addChecksCheckLabel").val(),
		noteLabel: $("#addChecksNoteLabel").val(),
		checkName: $("#addChecksCheckName").val(),
		noteName: $("#addChecksNoteName").val(),
		"default": $("#addChecksDefault").val()
	});
	//清空输入框
	$("#addChecksCheckLabel").val("");
	$("#addChecksNoteLabel").val("");
	$("#addChecksCheckName").val("");
	$("#addChecksNoteName").val("");
	$("#addChecksDefault").val("");
}

/**
 * checks属性对话框删除
 */
function doRemoveChecks(){
	//获取选中行
	var row = $("#checks_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#checks_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#checks_datagrid").datagrid("deleteRow",index);
}


/**
 * checks属性对话框保存
 */
function doSaveChecks(){
	//获取对话框中数据网络的数据
	var data = $("#checks_datagrid").datagrid("getRows");
	//定义对象
	for(var i in data){
		var options = [{"value":"YES","text":"是"},{"value":"No","text":"否"}];
		data[i].options = options;
	}
	//解析为json字符串
	var dataJson = JSON.stringify(data);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#checksAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#checks_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addChecksCheckLabel").val("");
	$("#addChecksNoteLabel").val("");
	$("#addChecksCheckName").val("");
	$("#addChecksNoteName").val("");
	$("#addChecksDefault").val("");
}

/**
 * checks属性对话框取消
 */
function doCancelChecks(){
	//关闭对话框
	$("#checksAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#checks_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addChecksCheckLabel").val("");
	$("#addChecksNoteLabel").val("");
	$("#addChecksCheckName").val("");
	$("#addChecksNoteName").val("");
	$("#addChecksDefault").val("");
}

/**
 * useInfo属性对话框添加
 */
function doAddUseInfo(){
	//给数据网络添加input框中的数据
	$("#useInfo_datagrid").datagrid("appendRow",{
		value: $("#addUseInfoOpValue").val(),
		text: $("#addUseInfoOpText").val(),
		visible: $("#addUseInfoOpVisible").val(),
		name: $("#addUseInfoOpName").val(),
		linkedName: $("#addUseInfoOpLinkedName").val()
	});
	//清空输入框
	$("#addUseInfoOpValue").val("");
	$("#addUseInfoOpText").val("");
	$("#addUseInfoOpVisible").val("");
	$("#addUseInfoOpName").val("");
	$("#addUseInfoOpLinkedName").val("");
}

/**
 * useInfo属性对话框删除
 */
function doRemoveUseInfo(){
	//获取选中行
	var row = $("#useInfo_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#useInfo_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#useInfo_datagrid").datagrid("deleteRow",index);
}


/**
 * useInfo属性对话框保存
 */
function doSaveUseInfo(){
	//获取对话框中数据网络的数据
	var data = $("#useInfo_datagrid").datagrid("getRows");
	console.log(data);
	//定义对象
	var useInfo = {};
	useInfo.name = $("#addUseInfoName").val();
	useInfo["default"] = $("#addUseInfoDefault").val();
	for(var i in data){
		console.log(data[i].linkedName);
		var linkedName = data[i].linkedName.split(",");
		data[i].linkedName = linkedName;
	}
	useInfo.options = data;
	//解析为json字符串
	var dataJson = JSON.stringify(useInfo);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#useInfoAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#useInfo_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addUseInfoName").val("");
	$("#addUseInfoDefault").val("");
	$("#addUseInfoOpValue").val("");
	$("#addUseInfoOpText").val("");
	$("#addUseInfoOpVisible").val("");
	$("#addUseInfoOpName").val("");
	$("#addUseInfoOpLinkedName").val("");
}

/**
 * useInfo属性对话框取消
 */
function doCancelUseInfo(){
	//关闭对话框
	$("#useInfoAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#useInfo_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addUseInfoName").val("");
	$("#addUseInfoDefault").val("");
	$("#addUseInfoOpValue").val("");
	$("#addUseInfoOpText").val("");
	$("#addUseInfoOpVisible").val("");
	$("#addUseInfoOpName").val("");
	$("#addUseInfoOpLinkedName").val("");
}

/**
 * deviceInfo属性对话框添加
 */
function doAddDeviceInfo(){
	//给数据网络添加input框中的数据
	$("#deviceInfo_datagrid").datagrid("appendRow",{
		"default": $("#addDeviceInfoOpDefault").val(),
		value: $("#addDeviceInfoOpValue").val(),
		text: $("#addDeviceInfoOpText").val(),
		name: $("#addDeviceInfoOpName").val(),
		linkedName: $("#addDeviceInfoOpLinkedName").val()
	});
	//清空输入框
	$("#addDeviceInfoOpDefault").val("");
	$("#addDeviceInfoOpValue").val("");
	$("#addDeviceInfoOpText").val("");
	$("#addDeviceInfoOpName").val("");
	$("#addDeviceInfoOpLinkedName").val("");
}

/**
 * deviceInfo属性对话框删除
 */
function doRemoveDeviceInfo(){
	//获取选中行
	var row = $("#deviceInfo_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#deviceInfo_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#deviceInfo_datagrid").datagrid("deleteRow",index);
}


/**
 * deviceInfo属性对话框保存
 */
function doSaveDeviceInfo(){
	//获取对话框中数据网络的数据
	var data = $("#deviceInfo_datagrid").datagrid("getRows");
	//定义对象
	var deviceInfo = {};
	deviceInfo.name = $("#addDeviceInfoName").val();
	for(var i in data){
		var linkedName = data[i].linkedName.split(",");
		data[i].linkedName = linkedName;
	}
	deviceInfo.options = data;
	//解析为json字符串
	var dataJson = JSON.stringify(deviceInfo);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#deviceInfoAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#deviceInfo_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addDeviceInfoName").val("");
	$("#addDeviceInfoOpDefault").val("");
	$("#addDeviceInfoOpValue").val("");
	$("#addDeviceInfoOpText").val("");
	$("#addDeviceInfoOpName").val("");
	$("#addDeviceInfoOpLinkedName").val("");
}

/**
 * deviceInfo属性对话框取消
 */
function doCancelDeviceInfo(){
	//关闭对话框
	$("#deviceInfoAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#deviceInfo_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addDeviceInfoName").val("");
	$("#addDeviceInfoOpDefault").val("");
	$("#addDeviceInfoOpValue").val("");
	$("#addDeviceInfoOpText").val("");
	$("#addDeviceInfoOpName").val("");
	$("#addDeviceInfoOpLinkedName").val("");
}

/**
 * apuInfo属性对话框添加
 */
function doAddApuInfo(){
	//给数据网络添加input框中的数据
	$("#apuInfo_datagrid").datagrid("appendRow",{
		value: $("#addApuInfoOpValue").val(),
		text: $("#addApuInfoOpText").val(),
		linkedName: $("#addApuInfoOpLinkedName").val()
	});
	//清空输入框
	$("#addApuInfoOpValue").val("");
	$("#addApuInfoOpText").val("");
	$("#addApuInfoOpLinkedName").val("");
}

/**
 * apuInfo属性对话框删除
 */
function doRemoveApuInfo(){
	//获取选中行
	var row = $("#apuInfo_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#apuInfo_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#apuInfo_datagrid").datagrid("deleteRow",index);
}


/**
 * apuInfo属性对话框保存
 */
function doSaveApuInfo(){
	//获取对话框中数据网络的数据
	var data = $("#apuInfo_datagrid").datagrid("getRows");
	//定义对象
	var apuInfo = {};
	apuInfo.name = $("#addApuInfoName").val();
	apuInfo["default"] = $("#addApuInfoDefault").val();
	for(var i in data){
		var linkedName = data[i].linkedName.split(",");
		data[i].linkedName = linkedName;
	}
	apuInfo.options = data;
	//解析为json字符串
	var dataJson = JSON.stringify(apuInfo);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#apuInfoAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#apuInfo_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addApuInfoName").val("");
	$("#addApuInfoDefault").val("");
	$("#addApuInfoOpValue").val("");
	$("#addApuInfoOpText").val("");
	$("#addApuInfoOpLinkedName").val("");
}

/**
 * apuInfo属性对话框取消
 */
function doCancelApuInfo(){
	//关闭对话框
	$("#apuInfoAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#apuInfo_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addApuInfoName").val("");
	$("#addApuInfoDefault").val("");
	$("#addApuInfoOpValue").val("");
	$("#addApuInfoOpText").val("");
	$("#addApuInfoOpLinkedName").val("");
}

/**
 * optionsTtp属性对话框添加
 */
function doAddOptionsTtp(){
	//给数据网络添加input框中的数据
	$("#optionsTtp_datagrid").datagrid("appendRow",{
		text: $("#addTextTtp").val(),
		textName: $("#addTextNameTtp").val(),
		picName: $("#addPicNameTtp").val()
	});
	//清空输入框
	$("#addTextTtp").val("");
	$("#addTextNameTtp").val("");
	$("#addPicNameTtp").val("");
}

/**
 * optionsTtp属性对话框删除
 */
function doRemoveOptionsTtp(){
	//获取选中行
	var row = $("#optionsTtp_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#optionsTtp_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#optionsTtp_datagrid").datagrid("deleteRow",index);
}


/**
 * optionsTtp属性对话框保存
 */
function doSaveOptionsTtp(){
	//获取对话框中数据网络的数据
	var data = $("#optionsTtp_datagrid").datagrid("getRows");
	//解析为json字符串
	var dataJson = JSON.stringify(data);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#optionsTtpAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#optionsTtp_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addTextTtp").val("");
	$("#addTextNameTtp").val("");
	$("#addPicNameTtp").val("");
}

/**
 * optionsTtp属性对话框取消
 */
function doCancelOptionsTtp(){
	//关闭对话框
	$("#optionsTtpAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#optionsTtp_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addTextTtp").val("");
	$("#addTextNameTtp").val("");
	$("#addPicNameTtp").val("");
}

/**
 * header属性对话框添加
 */
function doAddHeader(){
	//给数据网络添加input框中的数据
	$("#header_datagrid").datagrid("appendRow",{
		label: $("#addHeaderLabel").val(),
		width: $("#addHeaderWidth").val(),
		align: $("#addHeaderAlign").val()
	});
	//清空输入框
	$("#addHeaderLabel").val("");
	$("#addHeaderWidth").val("");
	$("#addHeaderAlign").val("");
}

/**
 * header属性对话框删除
 */
function doRemoveHeader(){
	//获取选中行
	var row = $("#header_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#header_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#header_datagrid").datagrid("deleteRow",index);
}


/**
 * header属性对话框保存
 */
function doSaveHeader(){
	//获取对话框中数据网络的数据
	var data = $("#header_datagrid").datagrid("getRows");
	//解析为json字符串
	var dataJson = JSON.stringify(data);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#headerAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#header_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addHeaderLabel").val("");
	$("#addHeaderWidth").val("");
	$("#addHeaderAlign").val("");
}

/**
 * header属性对话框取消
 */
function doCancelHeader(){
	//关闭对话框
	$("#headerAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#header_datagrid').datagrid('loadData', { total: 0, rows: [] });
	//清空输入框
	$("#addHeaderLabel").val("");
	$("#addHeaderWidth").val("");
	$("#addHeaderAlign").val("");
}

/**
 * checkItem属性添加
 */
function doAddCheckItemData(){
	//给数据网络添加input框中的数据
	$("#checkItemData_datagrid").datagrid("appendRow",{
		label: $("#addColumnsCheckItemDataLabel").val(),
		value: $("#addColumnsCheckItemDataValue").val()
	});
	//清空输入框
	$("#addColumnsCheckItemDataLabel").val("");
	$("#addColumnsCheckItemDataValue").val("");
}

/**
 * arriveTime属性添加
 */
function doAddArriveTimeDefault(){
	//给数据网络添加input框中的数据
	$("#arriveTimeDefault_datagrid").datagrid("appendRow",{
		value: $("#addArriveTimeDefaultValue").val()
	});
	//清空输入框
	$("#addArriveTimeDefaultValue").val("");
}

/**
 * checkFlag属性添加
 */
function doAddCheckFlagDefault(){
	//给数据网络添加input框中的数据
	$("#checkFlagDefault_datagrid").datagrid("appendRow",{
		value: $("#addCheckFlagDefaultValue").val()
	});
	//清空输入框
	$("#addCheckFlagDefaultValue").val("");
}

/**
 * checkItem属性删除
 */
function doRemoveCheckItemData(){
	//获取选中行
	var row = $("#checkItemData_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#checkItemData_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#checkItemData_datagrid").datagrid("deleteRow",index);
}

/**
 * arriveTime属性删除
 */
function doRemoveArriveTimeDefault(){
	//获取选中行
	var row = $("#arriveTimeDefault_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#arriveTimeDefault_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#arriveTimeDefault_datagrid").datagrid("deleteRow",index);
}

/**
 * checkFlag属性删除
 */
function doRemoveCheckFlagDefault(){
	//获取选中行
	var row = $("#checkFlagDefault_datagrid").datagrid("getSelected");
	//获取选中行的index
	var index = $('#checkFlagDefault_datagrid').datagrid('getRowIndex', row);
	//删除选中行数据
	$("#checkFlagDefault_datagrid").datagrid("deleteRow",index);
}

/**
 * columns属性对话框保存
 */
function doSaveColumns(){
	//获取对话框中数据网络的数据
	var ciData = $("#checkItemData_datagrid").datagrid("getRows");
	var atData = $("#arriveTimeDefault_datagrid").datagrid("getRows");
	var afData = $("#checkFlagDefault_datagrid").datagrid("getRows");
	//定义数组
	var columns = [];
	//定义数组中的类
	var checkItem = {};
	checkItem.names = $("#addColumnsCheckItemName").val().split(",");
	checkItem.type = $("#addColumnsCheckItemType").val();
	checkItem.data = ciData;
	columns.push(checkItem);
	
	var arriveTime = {};
	arriveTime.names = $("#addColumnsArriveTimeName").val().split(",");
	arriveTime.type = $("#addColumnsArriveTimeType").val();
	arriveTime["default"] = atData;
	columns.push(arriveTime);
	
	var checkFlag = {};
	checkFlag.names = $("#addColumnsCheckFlagName").val().split(",");
	checkFlag.type = $("#addColumnsCheckFlagType").val();
	var options = [{"value":1,"text":"是"},{"value":0,"text":"否"}];
	checkFlag.options = options;
	checkFlag["default"] = afData;
	columns.push(checkFlag);
	//解析为json字符串
	var dataJson = JSON.stringify(columns);
	//获取选中行
	var row = $("#pg_widget").propertygrid("getSelected");
	//获取选中行的index
	var index = $('#pg_widget').propertygrid('getRowIndex', row);
	//关闭对话框
	$("#columnsAdd").dialog({
		closed: true
	});
	//更新当前行
	$("#pg_widget").propertygrid("updateRow",{
		index: index,
		row:{
			value: dataJson
		}
	});
	//清空对话框中数据网络
	$('#checkItemData_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$('#arriveTimeDefault_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$('#checkFlagDefault_datagrid').datagrid('loadData', { total: 0, rows: [] });
}

/**
 * columns属性对话框取消
 */
function doCancelColumns(){
	//关闭对话框
	$("#columnsAdd").dialog({
		closed: true
	});
	//清空对话框中数据网络
	$('#checkItemData_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$('#arriveTimeDefault_datagrid').datagrid('loadData', { total: 0, rows: [] });
	$('#checkFlagDefault_datagrid').datagrid('loadData', { total: 0, rows: [] });
}

/**
 * 添加方法
 */
var selectDivId;//被选中的divID
function addPreview(){
	if(addWidget.classify == "form"){//判断为form
		//已经有form框退出函数
		if($("#container_preview").children().length != 0){
			return;
		}
		var formId = "form1";
		//准备添加的form的DIV
		var ad =$("<div class='form_preview' id='"+formId+"' style='width:95%;min-height:95%;padding:10px;'></span></div>")
				.click(function(){
					//清除图片
					$("#previewImg").attr("src","");
					if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
					//属性网络加载data
					$("#pg_widget").propertygrid({
						data: JSON.parse($("#"+formId+"").attr("data"))
					});
					
					selectDivId = formId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+selectDivId+"").addClass("bg_click");
				});
		
		//给div添加data属性
		ad.attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
		
		//将div中的data转换为对象
		var str =JSON.parse(ad.attr("data"));
		
		//添加div
		$("#container_preview").append(ad);
		//$(".form_preview").text("form(" + str[3].value +")");
		if(str[3].value == ""){
			$("#"+formId+"").text("form");
		}else{
			$("#"+formId+"").text("form(" + str[3].value +")");
		}
	}else if(addWidget.classify == "category"){
		//定义div的id
		var categoryId = "category" + $("#"+selectDivId+"").children().length;
		//准备添加的catagory的DIV
		var ad =$("<div class='catagory_preview' id='"+categoryId+"' style='width:90%;min-height:200px;margin-left:auto;margin-right:auto;margin-top:5px;padding:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></span></div>")
				.click(function(){
					//清除图片
					$("#previewImg").attr("src","");
					$("#pg_widget").propertygrid({
						data: JSON.parse($("#"+categoryId+"").attr("data"))
					});
					if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
					selectDivId = categoryId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+selectDivId+"").addClass("bg_click");
					event.stopPropagation();
				});
		
		//给div添加data属性
		ad.attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
		
		//将div中的data转换为对象
		var str =JSON.parse(ad.attr("data"));
		
		//添加div
		if($("#"+selectDivId+"").attr("class") == "form_preview bg_click"){
			$("#"+selectDivId+"").append(ad);
			if(str[2].value == ""){
				$("#"+categoryId+"").text("category");
			}else{
				$("#"+categoryId+"").text("category("+str[2].value+")");
			}
		}
	}else if(addWidget.classify == "groups"){
		//定义div的id
		var groupsId =""+selectDivId+"" +"groups" + $("#"+selectDivId+"").children().length;
		//准备添加的groups的DIV
		var ad =$("<div class='groups_preview' id='"+groupsId+"' style='width:80%;min-height:50px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>")
				.click(function(){
					//清除图片
					$("#previewImg").attr("src","");
					$("#pg_widget").propertygrid({
						data: JSON.parse($("#"+groupsId+"").attr("data"))
					});
					if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
					selectDivId = groupsId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+selectDivId+"").addClass("bg_click");
					event.stopPropagation();
				});
		
		//给div添加data属性
		ad.attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
		
		//将div中的data转换为对象
		var str =JSON.parse(ad.attr("data"));
		
		//添加div
		if($("#"+selectDivId+"").attr("class") == "catagory_preview bg_click"){
			$("#"+selectDivId+"").append(ad);
			if(str[2].value == ""){
				$("#"+groupsId+"").text("groups");
			}else{
				$("#"+groupsId+"").text("groups("+str[2].value+")");
			}
		}
	}else if(addWidget.classify == "items"){
		//定义div的id
		var itemsId =""+selectDivId+"" +"items" + $("#"+selectDivId+"").children().length;
		//准备添加的items的DIV
		var ad =$("<div class='items_preview' id='"+itemsId+"' style='width:80%;min-height:20px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>")
				.click(function(){
					//清除图片
					$("#previewImg").attr("src","");
					$("#pg_widget").propertygrid({
						data: JSON.parse($("#"+itemsId+"").attr("data")),
						rowStyler: function(index,row){
							if (row.group == "noShow"){
								return 'display:none'; 
							}else if(row.flag == "img"){
								$("#previewImg").attr("src",""+row.value+"");
								$("#previewImg").css("display","block");
								return 'display:none'; 
							}
						}
					});
					if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
					selectDivId = itemsId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+itemsId+"").addClass("bg_click");
					event.stopPropagation();
				});
		
		//给div添加data属性
		ad.attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
		
		//将div中的data转换为对象
		var str =JSON.parse(ad.attr("data"));
		
		//添加div
		if($("#"+selectDivId+"").attr("class") == "groups_preview bg_click" || $("#"+selectDivId+"").attr("class") == "items_items_preview bg_click"){
			$("#"+selectDivId+"").append(ad);
			//$("#"+itemsId+"").text(str[3].value + "(" + str[4].value + ")");
			if(str.length > 5){
				if(str[4].value == ""){
					$("#"+itemsId+"").text(str[3].value);
				}else{
					$("#"+itemsId+"").text(str[3].value + "(" + str[4].value + ")");
				}
			}else{
				if(str[3].value == ""){
					$("#"+itemsId+"").text(str[2].value);
				}else{
					$("#"+itemsId+"").text(str[2].value + "(" + str[3].value + ")");
				}
			}
		}
	}else if(addWidget.classify == "items-items"){
		//定义div的id
		var itemsId =""+selectDivId+"" +"items" + $("#"+selectDivId+"").children().length;
		//准备添加的items的DIV
		var ad =$("<div class='items_items_preview' id='"+itemsId+"' style='width:80%;min-height:20px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>")
				.click(function(){
					//清除图片
					$("#previewImg").attr("src","");
					$("#pg_widget").propertygrid({
						data: JSON.parse($("#"+itemsId+"").attr("data")),
						rowStyler: function(index,row){
							if (row.group == "noShow"){
								return 'display:none'; 
							}else if(row.flag == "img"){
								$("#previewImg").attr("src",""+row.value+"");
								$("#previewImg").css("display","block");
								return 'display:none'; 
							}
						}
					});
					if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
					selectDivId = itemsId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+selectDivId+"").addClass("bg_click");
					event.stopPropagation();
				});
		
		//给div添加data属性
		ad.attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
		
		//将div中的data转换为对象
		var str =JSON.parse(ad.attr("data"));
		
		//添加div
		if($("#"+selectDivId+"").attr("class") == "groups_preview bg_click"){
			$("#"+selectDivId+"").append(ad);
			$("#"+itemsId+"").text(str[3].value);
		}
	}else if(addWidget.classify == "options"){
		//定义div的id
		var optionsId =""+selectDivId+"" +"options" + $("#"+selectDivId+"").children().length;
		//准备添加的options的DIV
		var ad =$("<div class='options_preview' id='"+optionsId+"' style='width:80%;min-height:10px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;'></div>")
				.click(function(){
					$("#pg_widget").propertygrid({
						data: JSON.parse($("#"+optionsId+"").attr("data"))
					});
					selectDivId = optionsId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+selectDivId+"").addClass("bg_click");
					event.stopPropagation();
				});
		
		//给div添加data属性
		ad.attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
		var str =JSON.parse(ad.attr("data"));
		
		//添加DIV
		if($("#"+selectDivId+"").attr("class") == "items_preview"){
			$("#"+selectDivId+"").append(ad);
			$("#"+optionsId+"").text(str[3].value + "(" + str[4].value + ")");
		}
	}
	
	//清空属性框中内容
	addWidget = null;
	$("#pg_widget").propertygrid({
		data: ""
	});
	textId++;//编号加1
	//清除图片
	$("#previewImg").attr("src","");
	$("#previewImg").css("display","none");
}

/**
 * 修改控件
 */
function editPreview(){
	$("#"+selectDivId+"").attr("data", JSON.stringify($("#pg_widget").propertygrid("getData").rows));
	var str = $("#pg_widget").propertygrid("getData").rows;
	/*if($("#"+selectDivId+"").attr("class") == "form_preview bg_click"){
		$("#"+selectDivId+"").text("form(" + str[3].value + ")");
	}else if($("#"+selectDivId+"").attr("class") == "catagory_preview bg_click"){
		$("#"+selectDivId+"").text("catagory(" + str[2].value + ")");
	}else if($("#"+selectDivId+"").attr("class") == "groups_preview bg_click"){
		$("#"+selectDivId+"").text("groups(" + str[2].value + ")");
	}else{
		if(str.length > 4){
			$("#"+selectDivId+"").text(""+str[3].value+"(" + str[4].value + ")");
		}else{
			$("#"+selectDivId+"").text(""+str[2].value+"(" + str[3].value + ")");
		}
	}*/
	if($("#"+selectDivId+"").attr("class") == "items_preview bg_click"){
		if(str.length > 4){
			$("#"+selectDivId+"").text(""+str[3].value+"(" + str[4].value + ")");
		}else{
			$("#"+selectDivId+"").text(""+str[2].value+"(" + str[3].value + ")");
		}
	}
	
	//清空属性框中内容
	addWidget = null;
	$("#pg_widget").propertygrid({
		data: ""
	});
	//清除图片
	$("#previewImg").attr("src","");
	$("#previewImg").css("display","none");
}

/**
 * 删除控件
 */
function removePreview(){
	$("#"+selectDivId+"").remove();
	
	//清空属性框中内容
	addWidget = null;
	$("#pg_widget").propertygrid({
		data: ""
	});
	//清除图片
	$("#previewImg").attr("src","");
	$("#previewImg").css("display","none");
}

/**
 * 生成json字符串
 */
function produceJson(){
	//定义最终需要的json对象
	var finalJson = {};
	//获取div中的data属性
	var formJson = JSON.parse($("#form1").attr("data"));
	var form = {};
	//拼接form对象
	for(var i in formJson){
		form[formJson[i].flag] = formJson[i].value;
		//groups.str[i].name = str[i].value;
	}
	finalJson.form = form;
	
	finalJson.form.category = [];
	
	//拼接分类信息
	var categoryIdArr = [];//用于存放分类的id
	var category = $("#form1").children();//存放表单下的子元素
	for(var i=0; i<category.length; i++){
		//往数组中存放分类id
		categoryIdArr.push(category.eq(i).attr("id"));
		//将div中的data属性解析为对象
		var json = JSON.parse(category.eq(i).attr("data"));
		var c = {};
		//生成分类对象
		for(var j in json){
			c[json[j].flag] = json[j].value;
		}
		finalJson.form.category.push(c);
	}
	
	//拼接分组信息
	//var groupsIdArr = [];
	for(var i=0; i<categoryIdArr.length; i++){
		//获取分类div下的一级字元素
		var groups = $("#"+categoryIdArr[i]+"").children();
		if(groups.length != 0){
			finalJson.form.category[i].groups = [];
		}
		for(var j=0; j<groups.length; j++){
			//将div中的data属性解析为对象
			var json = JSON.parse(groups.eq(j).attr("data"));
			var c = {};
			//生成分组对象
			for(var x in json){
				if(json[x].value != "" && json[x].value != null){
					c[json[x].flag] = json[x].value;
				}
			}
			finalJson.form.category[i].groups.push(c);
			
			
			//拼接items信息
			var items = $("#"+groups.eq(j).attr("id")+"").children();
			if(items.length != 0){
				finalJson.form.category[i].groups[j].items = [];
			}
			for(var w=0; w<items.length; w++){
				//将div中的data属性解析为对象
				var itemJson = JSON.parse(items.eq(w).attr("data"));
				console.log(items.eq(w));
				var itemData = {};
				//生成items对象
				for(var e in itemJson){
					if(itemJson[e].group != "noSave"){
						if(itemJson[e].editor != "text" && Object.prototype.toString.call(itemJson[e].editor) != '[object Object]' && itemJson[e].editor != "type"){
							if(itemJson[e].value != "" && itemJson[e].value != null){
								itemData[itemJson[e].flag] = JSON.parse(itemJson[e].value);
							}else{
								itemData[itemJson[e].flag] = "";
							}
						}else{
							//如果为linkedName类型，转换为数组
							if(itemJson[e].flag == "linkedName"){
								itemData[itemJson[e].flag] = [];
								var linkedNameArr = itemJson[e].value.split(",");
								itemData[itemJson[e].flag] = linkedNameArr;
							}else{
								itemData[itemJson[e].flag] = itemJson[e].value;
							}
						}
					}
				}
				finalJson.form.category[i].groups[j].items.push(itemData);
				
				//items下的items
				var options = $("#"+items.eq(w).attr("id")+"").children();
				if(options.length != 0){
					finalJson.form.category[i].groups[j].items[w].items = [];
				}
				for(var r=0; r<options.length; r++){
					var optionJson = JSON.parse(options.eq(r).attr("data"));
					var optionData = {};
					for(var t in optionJson){
						if(optionJson[t].group != "noSave"){
							if(optionJson[t].editor != "text" && Object.prototype.toString.call(optionJson[t].editor) != '[object Object]' && optionJson[t].editor != "type"){
								if(optionJson[t].value != "" && optionJson[t].value != null){
									optionData[optionJson[t].flag] = JSON.parse(optionJson[t].value);
								}else{
									optionData[optionJson[t].flag] = "";
								}
							}else{
								//如果为linkedName类型，转换为数组
								if(optionJson[t].flag == "linkedName"){
									optionData[optionJson[t].flag] = [];
									var linkedNameArr = optionJson[e].value.split(",");
									optionData[optionJson[t].flag] = linkedNameArr;
								}else{
									optionData[optionJson[t].flag] = optionJson[t].value;
								}
							}
						}
						//optionData[optionJson[t].name] = optionJson[t].value;
					}
					finalJson.form.category[i].groups[j].items[w].items.push(optionData);
				}
			}
		}
	}
	
	//格式化json字符串
	var content = JSON.stringify(finalJson, null, 4);
	//关闭ui配置框
	$("#padconfig_uiconfig_div").dialog("close");
	$("#uiConfigId").textbox("setValue",content);
}

/**
 * 回显视图
 */
function echoPreview(){
	//清除图片
	$("#previewImg").attr("src","");
	if($("#previewImg").attr("src") == ""){
		$("#previewImg").css("display","none");
	}
	$("#pg_widget").propertygrid({
		data: ""
	});
	//将UI配置json字符串解析为对象
	var echoObject= JSON.parse($("#uiConfigId").textbox("getValue"));
	
	//生成form框
	var formId = "form1";
	//准备添加的form的DIV
	var formAd =$("<div class='form_preview' id='"+formId+"' style='width:95%;min-height:95%;padding:10px;'></div>")
			.click(function(){
				//清除图片
				$("#previewImg").attr("src","");
				if($("#previewImg").attr("src") == ""){
					$("#previewImg").css("display","none");
				}
				
				$("#pg_widget").propertygrid({
					data: JSON.parse($("#"+formId+"").attr("data"))
				});
				selectDivId = formId;
				//选中效果实现
				$("#container_preview div").removeClass('bg_click');
				$("#"+selectDivId+"").addClass("bg_click");
			});
	
	//拼接div中的data
	//var formArr = [];
	var formWidgt = JSON.parse(JSON.stringify(widgtData[0].properties));
	formObject = echoObject.form;
	for(var fi in formObject){
		for(var d in formWidgt){
			if(fi == formWidgt[d].flag){
				formWidgt[d].value = formObject[fi];
			}
		}
	}
	//给div添加data属性
	formAd.attr("data", JSON.stringify(formWidgt));
	//添加formDIV
	$("#container_preview").append(formAd);
	if(formWidgt[3].value == ""){
		$(".form_preview").text("form");
	}else{
		$(".form_preview").text("form(" + formWidgt[3].value + ")");
	}
	
	//生成category框
	for(var i in echoObject.form.category){
		//得到的category对象
		var categoryObj = echoObject.form.category[i];
		//保存的div的id
		var categoryId = "category" + i;
		
		//准备添加的category的DIV
		var categoryAd =$("<div class='catagory_preview' id='"+categoryId+"' style='width:90%;min-height:200px;margin-left:auto;margin-right:auto;margin-top:5px;padding:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>");
		//循环中绑定click事件
		categoryAd.bind("click", {index: categoryId}, clickHandler);  
		function clickHandler(event) {
			//清除图片
			$("#previewImg").attr("src","");
			if($("#previewImg").attr("src") == ""){
				$("#previewImg").css("display","none");
			}
			
	        var categoryId= event.data.index;  
	        $("#pg_widget").propertygrid({
				data: JSON.parse($("#"+categoryId+"").attr("data"))
			});
			selectDivId = categoryId;
			//选中效果实现
			$("#container_preview div").removeClass('bg_click');
			$("#"+selectDivId+"").addClass("bg_click");
			event.stopPropagation();
	    }  
		
		//拼接div中的data
		//var categoryArr = [];
		var categoryWidgt = JSON.parse(JSON.stringify(widgtData[1].properties));
		for(var j in categoryObj){
			for(var cd in categoryWidgt){
				if(j == categoryWidgt[cd].flag){
					categoryWidgt[cd].value = categoryObj[j];
				}
			}
		}
		
		//给div添加data属性
		categoryAd.attr("data", JSON.stringify(categoryWidgt));
		//添加formDIV
		$("#form1").append(categoryAd);
		if(categoryWidgt[2].value == ""){
			$("#"+categoryId+"").text("category");
		}else{
			$("#"+categoryId+"").text("category("+categoryWidgt[2].value+")");
		}
		
		
		//生成groups框
		for(var q in echoObject.form.category[i].groups){
			//得到的groups对象
			var groupsObj = echoObject.form.category[i].groups[q];
			//保存的id
			var groupsId = "category" + i + "groups" + q;
			
			//准备添加的groups的div
			var groupsAd = $("<div class='groups_preview' id='"+groupsId+"' style='width:80%;min-height:50px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>");
			//循环中绑定click事件
			groupsAd.bind("click", {index: groupsId}, groupsClickHandler);  
			function groupsClickHandler(event) {
				//清除图片
				$("#previewImg").attr("src","");
				if($("#previewImg").attr("src") == ""){
					$("#previewImg").css("display","none");
				}
				
		        var groupsId= event.data.index;  
		        $("#pg_widget").propertygrid({
					data: JSON.parse($("#"+groupsId+"").attr("data"))
				});
				selectDivId = groupsId;
				//选中效果实现
				$("#container_preview div").removeClass('bg_click');
				$("#"+selectDivId+"").addClass("bg_click");
				event.stopPropagation();
		    } 
			
			//拼接div中的data
			//var groupsArr = [];
			var groupsWidgt = [];
			groupsWidgt = JSON.parse(JSON.stringify(widgtData[2].properties));
			for(var w in groupsObj){
				for(var gw in groupsWidgt){
					if(w == groupsWidgt[gw].flag){
						groupsWidgt[gw].value = groupsObj[w];
					}
				}
			}
			
			//给div添加data属性
			groupsAd.attr("data", JSON.stringify(groupsWidgt));
			//添加formDIV
			$("#"+categoryId+"").append(groupsAd);
			if(groupsWidgt[2].value == ""){
				$("#"+groupsId+"").text("groups");
			}else{
				$("#"+groupsId+"").text("groups("+groupsWidgt[2].value+")");
			}
			
			//生成items框
			for(var r in echoObject.form.category[i].groups[q].items){
				//得到items对象
				var itemsObj = echoObject.form.category[i].groups[q].items[r];
				//保存的id
				var itemsId = "category" + i + "groups" + q + "items" + r;
				
				//准备添加的items的div
				var itemsAd = $("<div class='items_preview' id='"+itemsId+"' style='width:80%;min-height:20px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>");
				if(itemsObj.type == 24){
					itemsAd = $("<div class='items_items_preview' id='"+itemsId+"' style='width:80%;min-height:20px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>");
				}
				//循环中绑定click事件
				itemsAd.bind("click", {index: itemsId}, itemsClickHandler);  
				function itemsClickHandler(event) {
					//清除图片
					$("#previewImg").attr("src","");
					
			        var itemsId= event.data.index;  
			        $("#pg_widget").propertygrid({
						data: JSON.parse($("#"+itemsId+"").attr("data")),
						rowStyler: function(index,row){
							if (row.group == "noShow"){
								return 'display:none'; 
							}else if(row.flag == "img"){
								$("#previewImg").attr("src",""+row.value+"");
								$("#previewImg").css("display","block");
								return 'display:none'; 
							}
						}
					});
			        if($("#previewImg").attr("src") == ""){
						$("#previewImg").css("display","none");
					}
					selectDivId = itemsId;
					//选中效果实现
					$("#container_preview div").removeClass('bg_click');
					$("#"+selectDivId+"").addClass("bg_click");
					event.stopPropagation();
			    } 
				
				//定义数组的下标
				var number = 0;
				if(itemsObj.type < 6){
					number = Number(itemsObj.type) + 2;
				}
				if(6 < itemsObj.type && itemsObj.type < 15){
					number = Number(itemsObj.type) + 3;
				}
				if(15 < itemsObj.type){
					number = Number(itemsObj.type) + 4;
				}
				if(itemsObj.type == "6"){
					if(itemsObj.where == undefined){
						number = 9;
					}else{
						number = 8;
					}
				}
				if(itemsObj.type == "15"){
					if(itemsObj.where == undefined){
						number = 19;
					}else{
						number = 18;
					}
				}
				if(itemsObj.type == "1001"){
					number = 31;
				}
				//取得配置文件相应控件的properties
				var itemsWidgt = JSON.parse(JSON.stringify(widgtData[number].properties));
				//循环将对象中的value存入到控件中。准备div中的data属性
				for(var t in itemsObj){
					for(var iw in itemsWidgt){
						if(t == itemsWidgt[iw].flag){
							itemsWidgt[iw].value = itemsObj[t];
							//如果为数组或者对象，解析为字符串后存入value中
							if(Object.prototype.toString.call(itemsObj[t]) == '[object Array]' || Object.prototype.toString.call(itemsObj[t]) == '[object Object]'){
								itemsWidgt[iw].value = JSON.stringify(itemsObj[t]);
								//如果为linkedName，将数组拼接为字符串存入value
								if(t == "linkedName"){
									var str ="";
									for(var m in itemsObj[t]){
										if(m < itemsObj[t].length-1){
											str = str + itemsObj[t][m] + ",";
										}else{
											str = str + itemsObj[t][m];
										}
									}
									itemsWidgt[iw].value = str;
								}
							}
						}
					}
				}
				
				//给div添加data属性
				itemsAd.attr("data", JSON.stringify(itemsWidgt));
				//添加itemsDIV
				$("#"+groupsId+"").append(itemsAd);
				if(itemsWidgt.length > 5){
					if(itemsWidgt[4].value == ""){
						$("#"+itemsId+"").text(""+itemsWidgt[3].value);
					}else{
						$("#"+itemsId+"").text(""+itemsWidgt[3].value+"(" + itemsWidgt[4].value + ")");
					}
				}else{
					if(itemsWidgt[3].value){
						$("#"+itemsId+"").text(""+itemsWidgt[2].value);
					}else{
						$("#"+itemsId+"").text(""+itemsWidgt[2].value+"(" + itemsWidgt[3].value + ")");
					}
				}
				
				
				//生成items下的item
				for(var y in echoObject.form.category[i].groups[q].items[r].items){
					//得到items-items对象
					var itemsItemsObj = echoObject.form.category[i].groups[q].items[r].items[y];
					//保存的id
					var itemsItemsId = "category" + i + "groups" + q + "items" + r + "uitems" + y;
					
					//准备添加的options的div
					var optionsAd = $("<div class='options_preview' id='"+itemsItemsId+"' style='width:80%;min-height:10px;padding:5px;margin-left:auto;margin-right:auto;margin-top:5px;' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'></div>");
					//循环中绑定click事件
					optionsAd.bind("click", {index: itemsItemsId}, optionsClickHandler);  
					function optionsClickHandler(event) {
						//清除图片
						$("#previewImg").attr("src","");
						
				        var itemsItemsId= event.data.index;  
				        $("#pg_widget").propertygrid({
							data: JSON.parse($("#"+itemsItemsId+"").attr("data")),
							rowStyler: function(index,row){
								if (row.group == "noShow"){
									return 'display:none'; 
								}else if(row.flag == "img"){
									$("#previewImg").attr("src",""+row.value+"");
									$("#previewImg").css("display","block");
									return 'display:none'; 
								}
							}
						});
				        if($("#previewImg").attr("src") == ""){
							$("#previewImg").css("display","none");
						}
						selectDivId = itemsItemsId;
						//选中效果实现
						$("#container_preview div").removeClass('bg_click');
						$("#"+selectDivId+"").addClass("bg_click");
						event.stopPropagation();
				    } 
					
					//定义数组的下标
					var number = 0;
					if(itemsItemsObj.type < 6){
						number = Number(itemsItemsObj.type) + 2;
					}
					if(6 < itemsItemsObj.type && itemsItemsObj.type < 15){
						number = Number(itemsItemsObj.type) + 3;
					}
					if(15 < itemsItemsObj.type){
						number = Number(itemsItemsObj.type) + 4;
					}
					if(itemsItemsObj.type == "6"){
						if(itemsItemsObj.where == undefined){
							number = 9;
						}else{
							number = 8;
						}
					}
					if(itemsItemsObj.type == "15"){
						if(itemsItemsObj.where == undefined){
							number = 19;
						}else{
							number = 18;
						}
					}
					if(itemsItemsObj.type == "1001"){
						number = 31;
					}
					//取得配置文件相应控件的properties
					var itemsItemsWidgt = JSON.parse(JSON.stringify(widgtData[number].properties));
					//循环将对象中的value存入到控件中。准备div中的data属性
					for(var n in itemsItemsObj){
						for(var iiw in itemsItemsWidgt){
							if(n == itemsItemsWidgt[iiw].flag){
								itemsItemsWidgt[iiw].value = itemsItemsObj[n];
								//如果为数组或者对象，解析为字符串后存入value中
								if(Object.prototype.toString.call(itemsItemsObj[n]) == '[object Array]' || Object.prototype.toString.call(itemsItemsObj[n]) == '[object Object]'){
									itemsItemsWidgt[iiw].value = JSON.stringify(itemsItemsObj[n]);
									//如果为linkedName，将数组拼接为字符串存入value
									if(n == "linkedName"){
										var str ="";
										for(var m in itemsItemsObj[n]){
											if(m < itemsItemsObj[n].length-1){
												str = str + itemsItemsObj[n][m] + ",";
											}else{
												str = str + itemsItemsObj[n][m];
											}
										}
										itemsItemsWidgt[iiw].value = str;
									}
								}
							}
						}
					}
					
					//给div添加data属性
					optionsAd.attr("data", JSON.stringify(itemsItemsWidgt));
					//添加itemsDIV
					$("#"+itemsId+"").append(optionsAd);
					if(itemsItemsWidgt.length > 5){
						if(itemsItemsWidgt[4].value == ""){
							$("#"+itemsItemsId+"").text(itemsItemsWidgt[3].value);
						}else{
							$("#"+itemsItemsId+"").text(""+itemsItemsWidgt[3].value+"(" + itemsItemsWidgt[4].value + ")");
						}
					}else{
						if(itemsItemsWidgt[3].value == ""){
							$("#"+itemsItemsId+"").text(itemsItemsWidgt[2].value);
						}else{
							$("#"+itemsItemsId+"").text(""+itemsItemsWidgt[2].value+"(" + itemsItemsWidgt[3].value + ")");
						}
					}
					
				}
			
			}
		
		}
	}
	//回显时初始化编号
	textId = 1000 + $("#container_preview div").length;
}

/**
 * 拖拽div
 */
function allowDrop(ev)
{	
	ev.stopPropagation();
    ev.preventDefault();
}
var firdiv = null;
//拖div时的方法
function drag(ev,divdom)
{
	ev.stopPropagation();
	firdiv = divdom;
    ev.dataTransfer.setData("inner",firdiv.innerHTML);
    ev.dataTransfer.setData("innerText",firdiv.innerText);
}
//放div时的方法
function drop(ev,secDiv)
{	
	ev.stopPropagation();
    ev.preventDefault();
    if(firdiv != secDiv){
    	//交替之后取消选中效果
    	$("#container_preview div").removeClass('bg_click');
    	//分别获取data和class
    	var secId = secDiv.id;
    	var secData = $("#"+secId+"").attr("data");
    	var secClass = $("#"+secId+"").attr("class");
    	var firId = firdiv.id;
    	var firData = $("#"+firId+"").attr("data");
    	var firClass = $("#"+firId+"").attr("class");
    	//如果class属性相等，或为同一级别进行交替
    	if(secClass == firClass ||(secClass == "items_items_preview" && firClass == "items_preview") || (firClass == "items_items_preview" && secClass == "items_preview")){
    		//交替data
    		$("#"+secId+"").attr("data",firData);
    		$("#"+firId+"").attr("data",secData);
    		//交替class
    		$("#"+secId+"").attr("class",firClass);
    		$("#"+firId+"").attr("class",secClass);
    		
    		//获取子元素
    		var firChild = $("#"+firId+"").children();
    		var secChild = $("#"+secId+"").children();
    		
    		//获取div的文本内容
    		var firText = $("#"+firId+"").prop("firstChild").nodeValue;
    		var secText = $("#"+secId+"").prop("firstChild").nodeValue;
    		
    		//交替文本内容
    		firdiv.innerText = secText;
    		secDiv.innerText  = firText;
    		//交替子元素
    		$("#"+firId+"").append(secChild);
    		$("#"+secId+"").append(firChild);
    		
    		//交替之后取消选中效果
    		$("#container_preview div").removeClass('bg_click');
    		//交替之后取消图片显示
    		$("#previewImg").attr("src","");
    		if($("#previewImg").attr("src") == ""){
    			$("#previewImg").css("display","none");
    		}
    		//交替之后取消属性框内容
    		$("#pg_widget").propertygrid({
    			data: ""
    		});
    	}
    }
}

