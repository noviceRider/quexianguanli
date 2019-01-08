//查询条件新增、修改标志
var queryflag;
//选择的修改的行
var modifyRow;
//枚举新增、修改标志
var enumFlag;
//数据网格新增、修改标志
var optionflag;
//新增界面参数配置新增、修改标志
var amflag;
//编辑页面枚举新增、修改标志
var enumEditFlag;
//模块编号
var moduleCode = getString("moduleCode");
//模板参数
var templateData;
//输入框ID
var inputId;
/**
 * 初始加载数据
 */
$(function(){
	//回显模块编号
	$("#moudleCode").textbox("setValue",moduleCode);
	//根据模块编号查询数据
	$.ajax({
		url:basePath+"/gmodule_dform_moduleconfig_findById.json",
		type:"post",
		data:{moduleCode:moduleCode},
		success:function(data){
			if(data.rows!=null){
				templateData=data.rows;
				if(data.rows.configParam!=null){
					//获取配置参数
					var configParam = JSON.parse(data.rows.configParam);
					//数据回显
					$("#fm").form("load",configParam);
					//查询条件的回显
					$("#conditionTable").datagrid("loadData",configParam.queryData);
					//数据网格的回显
					$("#dgTable").datagrid("loadData",configParam.dataField);
					//编辑页面的回显
					$("#addTable").datagrid("loadData",configParam.amData);
					//导出信息的回显
					$("#exportTable").datagrid("loadData",configParam.exporRs);
				}
			}
		}
		
	});
	
	//加载查询条件新增、修改对话框
	$("#queryConditions_html").load("template_002_queryconditions_am.html",null,function(){
		//解析页面
		$.parser.parse(this);
		//加载条件类型数据
		$.ajax({
			url:basePath+"/gmodule_datadict_findall.json",
			type:"post",
			async:true,
			data:{typeCode:"DFORM_INPUT_TYPE"},
			success:function(data){
				//给查询条件类型加载数据
				$("#conditionType").combobox({
					valueField:"dictCode",
					textField:"dictDesc",
					data:data.rows,
					panelHeight:true,
					value:"10",
					onSelect:function(data){
						showConditionStyle(data.dictCode);
					}
				});
			}
		});
		//数据来源
		$("#queryConditions_fm #dataSrc").combobox({
			valueField:"dictCode",
			textField:"dictDesc",
			data:[{'dictCode':'01','dictDesc':'枚举'},{'dictCode':'02','dictDesc':'数据访问'}],
			panelHeight:true,
			value:"02",
			onSelect:function(data){
				showConditionTypeCodeStyle(data.dictCode);
			}
		});
//		$.ajax({
//			url:basePath+"/gmodule_datadict_findall.json",
//			type:"post",
//			data:{typeCode:"OPTIONS_SRC"},
//			success:function(data){
//				//给查询条件类型加载数据
//				
//			}
//		});
	});
	//加载数据网格参数新增、修改对话框
	$("#dataoptions_html").load("dataoptions_am.html",null,function(){
		//解析页面
		$.parser.parse(this);
		//构造数据网格对其方式数据
		var alignData = [{"id":"left","text":"left"},{"id":"center","text":"center"},{"id":"right","text":"right"}];
		//给查询条件类型加载数据
		$("#align").combobox({
			valueField:"id",
			textField:"text",
			data:alignData,
			panelHeight:true,
			value:"left"
		});
		//给是否格式化设置点击事件
		$("input[name='isFormatter']").unbind().click(function(){
			var value = $(this).val();
			showDataOptionTypeCode(value);
		});
	});
	
	//加载代码类型界面
	$("#typecode_html").load("../dynamictables/metamanage_dicttype.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});
	
	//加载枚举新增、修改界面
	$("#enum_am_html").load("enumhtml_am.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});
	
	//加载生成新增界面的新增、修改弹框
	$("#add_html").load("addhtml_am.html",null,function(){
		//解析页面
		$.parser.parse(this);
		//加载新增、修改弹框输入框类型
		$.ajax({
			url:basePath+"/gmodule_datadict_findall.json",
			type:"post",
			data:{typeCode:"DFORM_INPUT_TYPE"},
			success:function(data){
				//给查询条件类型加载数据
				$("#addhtml_fm #type").combobox({
					valueField:"dictCode",
					textField:"dictDesc",
					data:data.rows,
					panelHeight:true,
					value:"10",
					onSelect:function(data){
						showEditStyle(data.dictCode);
					}
				});
			}
		});
		
		//数据来源
		$("#addhtml_fm #dataSrc").combobox({
			valueField:"dictCode",
			textField:"dictDesc",
			data:[{'dictCode':'01','dictDesc':'枚举'},{'dictCode':'02','dictDesc':'数据访问'}],
			panelHeight:true,
			value:"02",
			onSelect:function(data){
				showEditTypeCodeStyle(data.dictCode);
			}
		});
//		$.ajax({
//			url:basePath+"/gmodule_datadict_findall.json",
//			type:"post",
//			data:{typeCode:"OPTIONS_SRC"},
//			success:function(data){
//				//给查询条件类型加载数据
//				$("#addhtml_fm #dataSrc").combobox({
//					valueField:"dictCode",
//					textField:"dictDesc",
//					data:data.rows,
//					panelHeight:true,
//					value:"02",
//					onSelect:function(data){
//						showEditTypeCodeStyle(data.dictCode);
//					}
//				});
//			}
//		});
	});
	
	//加载编辑页面枚举新增、修改弹框
	$("#editenum_am_html").load("editenumhtml_am.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});

	//加载数据访问选择页面
	$("#template_dataaccess").load("template_dataaccess.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});
	
	//加载业务逻辑选择页面
	$("#template_businesslogic").load("template_businesslogic.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});

	//pad配置选择页面
	$("#template_modifyjson").load("template_002_addModifyjson.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});
	
	//导出新增、修改页面
	$("#export_add_modify").load("export_add_modify.html",null,function(){
		//解析页面
		$.parser.parse(this);
	});
	
	//
	$("#conditionTable").datagrid({
		onDblClickRow:function(rowIndex,rowData){
			modifyCondition();
		}
	});
	//
	$("#dgTable").datagrid({
		onDblClickRow:function(rowIndex,rowData){
			modifyDataOption();
		}
	});
	//
	$("#addTable").datagrid({
		onDblClickRow:function(rowIndex,rowData){
			modifyAmhtml();
		}
	});
	//
	$("#exportTable").datagrid({
		onDblClickRow:function(rowIndex,rowData){
			modifyExport();
		}
	});
});

/**
 * 新增查询条件
 */
function addCondition(){
	queryflag=true;
	//打开新增对话框
	$("#queryConditions_dlg").dialog({
		modal:true,
		height:"150px",
		title:"新增查询条件",
		onClose:function(){
			//清空表单
			$("#queryConditions_fm").form("reset");
		}
	});
	//给名称获取焦点
	$('#queryConditions_fm #name').textbox().next('span').find('input').focus();
	//获取下拉框数据类型的值
	var typeValue = $("#conditionType").combobox("getValue");
	showConditionStyle(typeValue);
	//隐藏代码类型
	$("#typeCodeTr").hide();
	//隐藏枚举
	$("#enumerationTr").hide();
}

/**
 * 展示查询条件新增、修改弹框的样式
 * @param value
 */
function showConditionStyle(value){
	if(value=="12"){//下拉列表、数据单选、数据多选
		//显示代码类型
		$("#typeCodeTr").show();
		//隐藏枚举
		$("#enumerationTr").hide();
		//数据来源可编辑
		$("#queryConditions_fm #dataSrc").combobox({ disabled: false });
		//设置弹框高度
		$("#queryConditions_dlg").dialog({height:"190px"});
	}else{
		//隐藏代码类型
		$("#typeCodeTr").hide();
		//隐藏枚举
		$("#enumerationTr").hide();
		//设置高度
		$("#queryConditions_dlg").dialog({height:"150px"});
		//数据来源不可编辑
		$("#queryConditions_fm #dataSrc").combobox({ disabled: true });
	}
}

/**
 * 选择数据来源数据信息的切换
 * @param value
 */
function showConditionTypeCodeStyle(value){
	if(value=="02"){//数据字典
		//显示代码类型
		$("#typeCodeTr").show();
		//隐藏枚举
		$("#enumerationTr").hide();
		//设置弹框高度
		$("#queryConditions_dlg").dialog({height:"190x"});
	}else{
		//隐藏代码类型
		$("#typeCodeTr").hide();
		//显示枚举
		$("#enumerationTr").show();
		//设置弹框高度
		$("#queryConditions_dlg").dialog({height:"280x"});
	}
}

///**
// * 添加代码类型
// * @returns
// */
//function addAccess(){
//	showSelectDictType(function(data){
//		//设置代码类型值
//		$("#queryConditions_fm #typeDesc").textbox("setValue",data.typeDesc);
//		$("#queryConditions_fm #typeCode").val(data.typeCode);
//	});
//}

/**
 * 新增、修改弹框添加代码类型
 * @returns
 */
function addEditTypeCode(){
	showSelectDictType(function(data){
		//设置代码类型值
		$("#addhtml_fm #typeDesc").textbox("setValue",data.typeDesc);
		$("#addhtml_fm #typeCode").val(data.typeCode);
	});
}

/**
 * 展示查询条件新增、修改弹框的样式
 * @param value
 */
function showEditStyle(value){
	if(value=="12"||value=="14"||value=="15"){//下拉列表、数据单选、数据多选
		//显示代码类型
		$(".editTypeCodeTd").show();
		//隐藏枚举
		$("#editEnumerationTr").hide();
		//数据来源可编辑
		$("#addhtml_fm #dataSrc").combobox({ disabled: false });
		//设置弹框高度
		$("#addhtml_dlg").dialog({height:"225px"});
	}else{
		//隐藏代码类型
		$(".editTypeCodeTd").hide();
		//隐藏枚举
		$("#editEnumerationTr").hide();
		//设置高度
		$("#addhtml_dlg").dialog({height:"220px"});
		//数据来源不可编辑
		$("#addhtml_fm #dataSrc").combobox({ disabled: true });
	}
}

/**
 * 新增、修改弹框选择数据来源数据信息的切换
 * @param value
 */
function showEditTypeCodeStyle(value){
	if(value=="02"){//数据字典
		//显示代码类型
		$(".editTypeCodeTd").show();
		//隐藏枚举
		$("#editEnumerationTr").hide();
		//设置弹框高度
		$("#addhtml_dlg").dialog({height:"260px"});
	}else{
		//隐藏代码类型
		$(".editTypeCodeTd").hide();
		//显示枚举
		$("#editEnumerationTr").show();
		//设置弹框高度
		$("#addhtml_dlg").dialog({height:"350px"});
	}
}

//添加查询条件枚举
function addEnum(){
	enumFlag = true;
	//打开新对话框
	$("#enum_am").dialog({
		modal:true,
		title:"新增枚举信息",
		
		onClose:function(){
			//清空表单数据
			$("#enum_fm").form("reset");
		}
	});
	//给值获取焦点
	$('#enum_fm #value').textbox().next('span').find('input').focus();
}

/**
 * 关闭查询条件对话框
 */
function closeEnum(){
	//清空表单数据
	$("#enum_fm").form("reset");
	//关闭对话框
	$("#enum_am").dialog("close");
}

/**
 * 保存查询条件枚举信息
 */
function saveEnum(){
	if($("#enum_fm").form("validate")){
		//获取表单数据
		var data = $("#enum_fm").serializeObject();
		//获取选中的数据
		var selOpt = $("#columnEnumId option:selected");
		if(enumFlag){
			var option = "<option>"+data.value+"-"+data.text+"</option>";
			$("#columnEnumId").append(option);
		}else{
			selOpt.text(data.value+"-"+data.text);
		}
		//关闭对话框
		$("#enum_am").dialog("close");
	}
}

/**
 * 删除查询条件枚举
 */
function removeEnum(){
	//获取选中的数据
	var selOpt = $("#columnEnumId option:selected");
	if(selOpt.length==0){
		$.messager.alert("提示","请选择要删除的数据","info");
	}else{
		$.messager.confirm("提示","是否要删除这条数据？删除后将无法恢复！",function(r){
			if(r){
				selOpt.remove();
			}
		});
	}
}

/**
 * 修改查询条件枚举
 */
function modifyEnum(){
	enumFlag = false;
	//获取选中的数据
	var selOpt = $("#columnEnumId option:selected");
	if(selOpt.length==0){
		$.messager.alert("提示","请选择要修改的数据","info");
	}else{
		//打开修改对话框
		$("#enum_am").dialog({
			modal:true,
			title:"修改枚举信息",
			onClose:function(){
				//清空表单数据
				$("#enum_fm").form("reset");
			}
		});
		//获取选中的文本值
		var text = selOpt.text();
		//将文本分割为数组
		var array = text.split("-");
		var data={value:array[0],text:array[1]};
		//数据回显
		$("#enum_fm").form("load",data);
	}
}

//添加编辑页面枚举
function addEditEnum(){
	enumEditFlag = true;
	//打开新对话框
	$("#editenum_am").dialog({
		modal:true,
		title:"新增枚举信息",
		
		onClose:function(){
			//清空表单数据
			$("#editenum_fm").form("reset");
		}
	});
	//给值获取焦点
	$('#editenum_fm #value').textbox().next('span').find('input').focus();
}

/**
 * 关闭新增、修改界面枚举对话框
 */
function closeEditEnum(){
	//清空表单数据
	$("#editenum_fm").form("reset");
	//关闭对话框
	$("#editenum_am").dialog("close");
}

/**
 * 保存编辑页面枚举信息
 */
function saveEditEnum(){
	if($("#editenum_fm").form("validate")){
		//获取表单数据
		var data = $("#editenum_fm").serializeObject();
		//获取选中的数据
		var selOpt = $("#columnEditEnum option:selected");
		if(enumEditFlag){
			var option = "<option>"+data.value+"-"+data.text+"</option>";
			$("#columnEditEnum").append(option);
		}else{
			selOpt.text(data.value+"-"+data.text);
		}
		//关闭对话框
		$("#editenum_am").dialog("close");
	}
}

/**
 * 删除编辑页面枚举
 */
function removeEditEnum(){
	//获取选中的数据
	var selOpt = $("#columnEditEnum option:selected");
	if(selOpt.length==0){
		$.messager.alert("提示","请选择要删除的数据","info");
	}else{
		$.messager.confirm("提示","是否要删除这条数据？删除后将无法恢复！",function(r){
			if(r){
				selOpt.remove();
			}
		});
	}
}

/**
 * 修改编辑页面枚举
 */
function modifyEditEnum(){
	enumEditFlag = false;
	//获取选中的数据
	var selOpt = $("#columnEditEnum option:selected");
	if(selOpt.length==0){
		$.messager.alert("提示","请选择要修改的数据","info");
	}else{
		//打开修改对话框
		$("#editenum_am").dialog({
			modal:true,
			title:"修改枚举信息",
			onClose:function(){
				//清空表单数据
				$("#editenum_fm").form("reset");
			}
		});
		//获取选中的文本值
		var text = selOpt.text();
		//将文本分割为数组
		var array = text.split("-");
		var data={value:array[0],text:array[1]};
		//数据回显
		$("#editenum_fm").form("load",data);
	}
}

/**
 * 查询条件保存
 */
function saveQueryConditions(){
	if($("#queryConditions_fm").form("validate")){
		//获取数据
		var data=$("#queryConditions_fm").serializeObject();
		data.typeName = $("#conditionType").combobox("getText");
		//所有枚举文本值
		var options = $("#columnEnumId option");
		//新建数组
		var array = new Array();
		if(options.length>0){
			options.each(function() {
			    text= $(this).text();
			    //分割
			    var texts = text.split("-");
			    //新建对象
			    var obj = {value:texts[0],text:texts[1]};
			    array.push(obj);
			});
		}
		data.enum = array;
		//获取查询条件所有数据
		var conditionData = $("#conditionTable").datagrid("getData").rows;
		if(conditionData.length==0){
			//给数据网格添加一行
			$("#conditionTable").datagrid("appendRow",data);
			//清空枚举数据
			$("#columnEnumId").empty();
			//关闭对话框
			$("#queryConditions_dlg").dialog("close");
			//清空表单
			$("#queryConditions_fm").form("reset");
		}else{
			//名称存在标志
			var nameExist=false;
			//标题存在标志
			var labelExist=false;
			for(var i=0;i<conditionData.length;i++){
				if(queryflag){//新增的验证
					if(conditionData[i].name==data.name){
						nameExist= true;
					}
					if(conditionData[i].label==data.label){
						nameExist= true;
					}
				}else{//修改的验证
					if(modifyRow.name!=data.name){
						if(conditionData[i].name==data.name){
							nameExist= true;
						}
					}
					if(modifyRow.label!=data.label){
						if(conditionData[i].label==data.label){
							labelExist= true;
						}
					}
				}
			}
			if(nameExist==true&&labelExist==false){
				$.messager.alert("提示","名称已经存在","info");
			}else if(nameExist==false&&labelExist==true){
				$.messager.alert("提示","标题已经存在","info");
			}else if(nameExist==true&&labelExist==true){
				$.messager.alert("提示","名称和标题都已存在","info");
			}else{
				if(queryflag){
					//给数据网格添加一行
					$("#conditionTable").datagrid("appendRow",data);
				}else{
					//获取修改行的索引
					var index =  $("#conditionTable").datagrid("getRowIndex",modifyRow);
					$("#conditionTable").datagrid("updateRow",{index:index,row:data});
				}
				//清空枚举数据
				$("#columnEnumId").empty();
				//关闭对话框
				$("#queryConditions_dlg").dialog("close");
				//清空表单
				$("#queryConditions_fm").form("reset");
			}
		}
	}
}

/**
 * 关闭查询条件
 */
function closeQueryConditions(){
	//清空表单
	$("#queryConditions_fm").form("reset");
	//关闭对话框
	$("#queryConditions_dlg").dialog("close");
}

/**
 * 修改查询条件
 */
function modifyCondition(){
	queryflag=false;
	//获取表格的数据
	var row = $("#conditionTable").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示","请选择要修改的数据！","info");
	}else{
		modifyRow=row;
		if(modifyRow.type == "12"){
			//显示代码类型
			$("#typeCodeTr").show();
			//隐藏枚举
			$("#enumerationTr").hide();
			//数据来源可编辑
			$("#queryConditions_fm #dataSrc").combobox({ disabled: false });
			//设置弹框高度
			$("#queryConditions_dlg").dialog({height:"190px"});
			if(modifyRow.dataSrc=="02"){//数据字典
				//显示代码类型
				$("#typeCodeTr").show();
				//隐藏枚举
				$("#enumerationTr").hide();
				//设置弹框高度
				$("#queryConditions_dlg").dialog({height:"190x"});
			}else{
				//隐藏代码类型
				$("#typeCodeTr").hide();
				//显示枚举
				$("#enumerationTr").show();
				//设置弹框高度
				$("#queryConditions_dlg").dialog({height:"280x"});
			}
		}else{
			//隐藏代码类型
			$("#typeCodeTr").hide();
			//隐藏枚举
			$("#enumerationTr").hide();
			//设置高度
			$("#queryConditions_dlg").dialog({height:"150px"});
			//数据来源不可编辑
			$("#queryConditions_fm #dataSrc").combobox({ disabled: true });
		}
		//打开修改对话框
		$("#queryConditions_dlg").dialog({
			modal:true,
			title:"修改查询条件",
			onClose:function(){
				//清空表单
				$("#queryConditions_fm").form("reset");
			}
		});
		//数据回显
		$("#queryConditions_fm").form("load",row);
		//将文本分割为数组
		if(modifyRow.enum.length > 0){
			loadEnum("columnEnumId",modifyRow.enum);
		}
		//给名称获取焦点
		$('#queryConditions_fm #name').textbox().next('span').find('input').focus();
	}
}

/**
 * 加载枚举信息
 * @param boxId
 * @param data
 */
function loadEnum(boxId,data) {
	$("#"+boxId).empty();
	for ( var i in data) {
		var option = "<option>"+data[i].value+"-"+data[i].text+"</option>";
		$("#"+boxId).append(option);
	}
}

/**
 * 删除查询条件数据表格数据
 */
function removeCondition(){
	//获取表格的数据
	var row = $("#conditionTable").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示","请选择要删除的数据！","info");
	}else{
		$.messager.confirm("提示","是否要删除这条数据，删除后将无法恢复！",function(r){
			if(r){
				//获取删除行的索引
				var index = $("#conditionTable").datagrid("getRowIndex",row);
				//删除
				$("#conditionTable").datagrid("deleteRow",index);
			}
		});
	}
}

/**
 * 新增数据网格参数
 */
function addDataOption(){
	optionflag=true;
	//打开新增对话框
	$("#dataoptions_dlg").dialog({
		modal:true,
		title:"新增网格参数",
		onClose:function(){
			//清空表单
			$("#dataoptions_fm").form("reset");
		}
	});
	//给名称获取焦点
	$('#field').textbox().next('span').find('input').focus();
	//隐藏类别编码列
	$(".optionTypeCodeTd").hide();
	//获取是否格式化的值
	var value = $("inpput [name='isFormatter']:checked").val();
	showDataOptionTypeCode(value);
}

/**
 * 展示数据网格编辑弹框样式
 * @param value
 */
function showDataOptionTypeCode(value){
	if(value=="1"){//格式化数据
		//显示类别编码列
		$(".optionTypeCodeTd").show();
	}else{
		//隐藏类别编码列
		$(".optionTypeCodeTd").hide();
	}
}

/**
 * 添加数据网格的类别编码
 */
function addDataOPtionTypeCode(){
	showSelectDictType(function(data){
		//设置代码类型值
		$(".optionTypeCodeTd #typeDesc").textbox("setValue",data.typeDesc);
		$(".optionTypeCodeTd #typeCode").val(data.typeCode);
	});
}

/**
 * 数据网格参数保存
 */
function saveDataOption(){
	if($("#dataoptions_fm").form("validate")){
		//获取数据
		var data=$("#dataoptions_fm").serializeObject();
		//获取数据网格所有参数
		var dgData = $("#dgTable").datagrid("getData").rows;
		if(dgData.length==0){
			//给数据网格添加一行
			$("#dgTable").datagrid("appendRow",data);
			//关闭对话框
			$("#dataoptions_dlg").dialog("close");
			//清空表单
			$("#dataoptions_fm").form("reset");
		}else{
			//列名存在标志
			var fieldExist=false;
			//属性存在标志
			var titlelExist=false;
			for(var i=0;i<dgData.length;i++){
				if(optionflag){//新增的验证
					if(dgData[i].field==data.field){
						fieldExist= true;
					}
					if(dgData[i].title==data.title){
						titlelExist= true;
					}
				}else{//修改的验证
					if(modifyRow.field!=data.field){
						if(dgData[i].field==data.field){
							fieldExist= true;
						}
					}
					if(modifyRow.title!=data.title){
						if(dgData[i].title==data.title){
							titlelExist= true;
						}
					}
				}
			}
			if(fieldExist==true&&titlelExist==false){
				$.messager.alert("提示","列名已经存在","info");
			}else if(fieldExist==false&&titlelExist==true){
				$.messager.alert("提示","属性已经存在","info");
			}else if(fieldExist==true&&titlelExist==true){
				$.messager.alert("提示","列名和属性都已存在","info");
			}else{
				if(optionflag){
					//给数据网格添加一行
					$("#dgTable").datagrid("appendRow",data);
				}else{
					//获取修改行的索引
					var index =  $("#dgTable").datagrid("getRowIndex",modifyRow);
					$("#dgTable").datagrid("updateRow",{index:index,row:data});
				}
				//关闭对话框
				$("#dataoptions_dlg").dialog("close");
				//清空表单
				$("#dataoptions_fm").form("reset");
			}
		}
	}
}

/**
 * 关闭数据网格参数对话框
 */
function closeDataOption(){
	//清空表单
	$("#dataoptions_fm").form("reset");
	//关闭对话框
	$("#dataoptions_dlg").dialog("close");
}

/**
 * 修改网格数据
 */
function modifyDataOption(){
	optionflag=false;
	//获取表格的数据
	var row = $("#dgTable").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示","请选择要修改的数据！","info");
	}else{
		modifyRow=row;
		//打开修改对话框
		$("#dataoptions_dlg").dialog({
			modal:true,
			title:"修改参数",
			onClose:function(){
				//清空表单
				$("#dataoptions_fm").form("reset");
			}
		});
		//数据回显
		$("#dataoptions_fm").form("load",row);
		var isRadio=$("#isRadio input:radio:checked").val();
		if(isRadio=="1"){//格式化数据
			//显示类别编码列
			$(".optionTypeCodeTd").show();
		}else{
			//隐藏类别编码列
			$(".optionTypeCodeTd").hide();
		}
		//给表头名获取焦点
		$('#field').textbox().next('span').find('input').focus();
	}
}

/**
 * 删除数据表格参数
 */
function removeDataOption(){
	//获取表格的数据
	var row = $("#dgTable").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示","请选择要删除的数据！","info");
	}else{
		$.messager.confirm("提示","是否要删除这条数据，删除后将无法恢复！",function(r){
			if(r){
				//获取删除行的索引
				var index = $("#dgTable").datagrid("getRowIndex",row);
				//删除
				$("#dgTable").datagrid("deleteRow",index);
			}
		});
	}
}

/**
 * 添加新增、修改界面配置参数
 */
function addAmhtml(){
	amflag=true;
	//打开新增对话框
	$("#addhtml_dlg").dialog({
		modal:true,
		title:"添加新增、修改界面参数",
		onClose:function(){
			//清空表单
			$("#addhtml_fm").form("reset");
		}
	});
	//给标题获取焦点
	$('#addhtml_fm #title').textbox().next('span').find('input').focus();
	//获取下拉框数据类型的值
	var typeValue = $("#addhtml_fm #type").combobox("getValue");
	showEditStyle(typeValue);
	//隐藏代码类型
	$(".editTypeCodeTd").hide();
	//隐藏枚举
	$("#editEnumerationTr").hide();
}

/**
 * 修改新增、修改界面配置参数
 */
function modifyAmhtml(){
	amflag=false;
	//获取表格的数据
	var row = $("#addTable").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示","请选择要修改的数据！","info");
	}else{
		modifyRow=row;
		if(modifyRow.type=="12"||modifyRow.type=="14"||modifyRow.type=="15"){//下拉列表、数据单选、数据多选
			//显示代码类型
			$(".editTypeCodeTd").show();
			//隐藏枚举
			$("#editEnumerationTr").hide();
			//数据来源可编辑
			$("#addhtml_fm #dataSrc").combobox({ disabled: false });
			//设置弹框高度
			$("#addhtml_dlg").dialog({height:"225px"});
			if(modifyRow.dataSrc=="02"){//数据字典
				//显示代码类型
				$(".editTypeCodeTd").show();
				//隐藏枚举
				$("#editEnumerationTr").hide();
				//设置弹框高度
				$("#addhtml_dlg").dialog({height:"225px"});
			}else{
				//隐藏代码类型
				$(".editTypeCodeTd").hide();
				//显示枚举
				$("#editEnumerationTr").show();
				loadEnum("columnEditEnum",row.enum);
				//设置弹框高度
				$("#addhtml_dlg").dialog({height:"280x"});
			}
		}else{
			//隐藏代码类型
			$(".editTypeCodeTd").hide();
			//隐藏枚举
			$("#editEnumerationTr").hide();
			//设置高度
			$("#addhtml_dlg").dialog({height:"220px"});
			//数据来源不可编辑
			$("#addhtml_fm #dataSrc").combobox({ disabled: true });
		}
		//打开修改对话框
		$("#addhtml_dlg").dialog({
			modal:true,
			title:"修改新增、修改界面参数",
			onClose:function(){
				//清空表单
				$("#addhtml_fm").form("reset");
			}
		});
		//数据回显
		$("#addhtml_fm").form("load",row);
		//给标题获取焦点
		$('#addhtml_fm #title').textbox().next('span').find('input').focus();
	}
}

/**
 * 删除新增、修改界面配置参数
 */
function removeAmhtml(){
	//获取表格的数据
	var row = $("#addTable").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示","请选择要删除的数据！","info");
	}else{
		$.messager.confirm("提示","是否要删除这条数据，删除后将无法恢复！",function(r){
			if(r){
				//获取删除行的索引
				var index = $("#addTable").datagrid("getRowIndex",row);
				//删除
				$("#addTable").datagrid("deleteRow",index);
			}
		});
	}
}

/**
 * 关闭新增、修改界面参数配置弹框
 */
function closeAmhtml(){
	//清空表单
	$("#addhtml_fm").form("reset");
	//关闭对话框
	$("#addhtml_dlg").dialog("close");
}

/**
 * 数据网格参数保存
 */
function saveAmhtml(){
	if($("#addhtml_fm").form("validate")){
		//获取数据
		var data=$("#addhtml_fm").serializeObject();
		data.typeName = $("#type").combobox("getText");
		//所有枚举文本值
		var options = $("#columnEditEnum option");
		//新建数组
		var array = new Array();
		if(options.length>0){
			options.each(function() {
			    text= $(this).text();
			    //分割
			    var texts = text.split("-");
			    //新建对象
			    var obj = {value:texts[0],text:texts[1]};
			    array.push(obj);
			});
		}
		data.enum = array;
		//获取数据网格所有参数
		var dgData = $("#addTable").datagrid("getData").rows;
		if(dgData.length==0){
			//给数据网格添加一行
			$("#addTable").datagrid("appendRow",data);
			//关闭对话框
			$("#addhtml_dlg").dialog("close");
			//清空表单
			$("#addhtml_fm").form("reset");
		}else{
			//名称存在标志
			var nameExist=false;
			//标题存在标志
			var titlelExist=false;
			for(var i=0;i<dgData.length;i++){
				if(amflag){//新增的验证
					if(dgData[i].name==data.name){
						nameExist= true;
					}
					if(dgData[i].title==data.title){
						titlelExist= true;
					}
				}else{//修改的验证
					if(modifyRow.name!=data.name){
						if(dgData[i].name==data.name){
							nameExist= true;
						}
					}
					if(modifyRow.title!=data.title){
						if(dgData[i].title==data.title){
							titlelExist= true;
						}
					}
				}
			}
			if(nameExist==true&&titlelExist==false){
				$.messager.alert("提示","名称已经存在","info");
			}else if(nameExist==false&&titlelExist==true){
				$.messager.alert("提示","标题已经存在","info");
			}else if(nameExist==true&&titlelExist==true){
				$.messager.alert("提示","名称和标题都已存在","info");
			}else{
				if(amflag){
					//给数据网格添加一行
					$("#addTable").datagrid("appendRow",data);
				}else{
					//获取修改行的索引
					var index =  $("#addTable").datagrid("getRowIndex",modifyRow);
					$("#addTable").datagrid("updateRow",{index:index,row:data});
				}
				//关闭对话框
				$("#addhtml_dlg").dialog("close");
				//清空表单
				$("#addhtml_fm").form("reset");
			}
		}
	}
}

/**
 * 保存所有参数
 */
function SaveAllData(){
	if($("#fm").form("validate")){
		var parserParams = $("#fm").serializeObject();
		//获取查询条件
		var queryData = $("#conditionTable").datagrid("getData").rows;
		//获取数据网格参数
		var dataField = $("#dgTable").datagrid("getData").rows;
		//获取新增、修改界面配置参数
		var amData = $("#addTable").datagrid("getData").rows;
		/*if(queryData.length==0&&dataField.length!=0){
			$.messager.alert("提示","查询条件不能为空！","info");
		}else if(queryData.length!=0&&dataField.length==0){
			$.messager.alert("提示","数据网格参数不能为空！","info");
		}else if(queryData.length==0&&dataField.length==0){
			$.messager.alert("提示","查询条件和数据网格参数不能为空！","info");
		}else{
			var parserParams ={url:url,title:title,queryData:queryData,dataFields:dataField};
			var data = parseHtml(parserParams);
			$.ajax({
				url:basePath+"/gmodule_dataaccessapi_template_export.json",
				type:"post",
				data:data,
				success:function(data){
				}
			});
		}*/
		//新建单行数组
		var singleLine = new Array();
		//非单行数组
		var multiLine = new Array();
		//循环将两列和四列分开
		for(var i=0;i<amData.length;i++){
			if(amData[i].isSingleLine=="1"){
				singleLine.push(amData[i]);
			}else{
				multiLine.push(amData[i]);
			}
		}
		parserParams.queryData=queryData;
		parserParams.dataField=dataField;
		parserParams.amData=amData;
		parserParams.singleLine=singleLine;
		parserParams.multiLine=multiLine;
		var data = parseHtml(parserParams);
		//转换为字符串
		var parseJson = JSON.stringify(data);
		$.ajax({
			url:basePath+"/gmodule_dform_template_export.json",
			type:"post",
			data:{parseJson:parseJson},
			success:function(data){
				templateData.configParam=parseJson;
				console.log(templateData);
				if(data.resultCode=="1"){
					//保存配置参数
					$.ajax({
						url:basePath+"/gmodule_dform_moduleconfig_modifyModuleconfig.json",
						type:"post",
						data:templateData,
						success:function(data){
							if(data.resultCode=="0"){
								$.messager.alert("提示","配置参数保存失败！","info");
							}else{
								//返回到上一个页面
								history.back(-1);
							}
						}
					});
				}else{
					$.messager.alert("提示","生成界面失败！","info");
				}
			}
		});
	}
}


/**
 * 对数据网格进行操作
 */
function conditionHandle(value,row,index){
	var html="<a href=\"javascript:void(0)\" style=\"color:blue;\" onclick=\"moveUp("+index+");\">上移</a>";
	html+="<a href=\"javascript:void(0)\" style=\"color:blue;margin-left:20px;\" onclick=\"moveDown("+index+");\">下移</a>";
	return html;
}

/**
 * 上移,原理是交换前一行和当前行的数据
 * @param index 上移行的索引
 */
function moveUp(index,row){
	if(index!=0){//不是第一行
		//获取前一行的数据
		var toDown = $("#conditionTable").datagrid("getData").rows[index-1];
		//获取当前行数据
		var toUp = $("#conditionTable").datagrid("getData").rows[index];
		//交换数据
		$("#conditionTable").datagrid("getData").rows[index]=toDown;
		$("#conditionTable").datagrid("getData").rows[index-1]=toUp;
		//刷新
		$("#conditionTable").datagrid('refreshRow', index);
        $("#conditionTable").datagrid('refreshRow', index - 1);
        $("#conditionTable").datagrid('selectRow', index - 1);
	}else{
		$.messager.alert("提示","已经是第一条数据！","info");
	}
}

/**
 * 下移
 * @param index 上移行的索引
 */
function moveDown(index,row){
	//获取所有行数
	var rows = $("#conditionTable").datagrid("getData").rows;
	if(index!=rows.length-1){//不是第一行
		//获取后一行的数据
		var toUp = $("#conditionTable").datagrid("getData").rows[index+1];
		//获取当前行数据
		var toDown = $("#conditionTable").datagrid("getData").rows[index];
		//交换数据
		$("#conditionTable").datagrid("getData").rows[index]=toUp;
		$("#conditionTable").datagrid("getData").rows[index+1]=toDown;
		//刷新
		$("#conditionTable").datagrid('refreshRow', index);
        $("#conditionTable").datagrid('refreshRow', index+1);
        $("#conditionTable").datagrid('selectRow', index+1);
	}else{
		$.messager.alert("提示","已经是最后一条数据！","info");
	}
}

/**
 * 对数据网格进行操作
 */
function optionHandle(value,row,index){
	var html="<a href=\"javascript:void(0)\" style=\"color:blue;\" onclick=\"optionMoveUp("+index+");\">上移</a>";
	html+="<a href=\"javascript:void(0)\" style=\"color:blue;margin-left:20px;\" onclick=\"optionMoveDown("+index+");\">下移</a>";
	return html;
}

/**
 * 对导出参数数据网格进行操作
 */
function exportHandle(value,row,index){
	var html="<a href=\"javascript:void(0)\" style=\"color:blue;\" onclick=\"exportMoveUp("+index+");\">上移</a>";
	html+="<a href=\"javascript:void(0)\" style=\"color:blue;margin-left:20px;\" onclick=\"exportMoveDown("+index+");\">下移</a>";
	return html;
}

/**
 * 上移,原理是交换前一行和当前行的数据
 * @param index 上移行的索引
 */
function optionMoveUp(index,row){
	if(index!=0){//不是第一行
		//获取前一行的数据
		var toDown = $("#dgTable").datagrid("getData").rows[index-1];
		//获取当前行数据
		var toUp = $("#dgTable").datagrid("getData").rows[index];
		//交换数据
		$("#dgTable").datagrid("getData").rows[index]=toDown;
		$("#dgTable").datagrid("getData").rows[index-1]=toUp;
		//刷新
		$("#dgTable").datagrid('refreshRow', index);
        $("#dgTable").datagrid('refreshRow', index - 1);
        $("#dgTable").datagrid('selectRow', index - 1);
	}else{
		$.messager.alert("提示","已经是第一条数据！","info");
	}
}

/**
 * 下移
 * @param index 上移行的索引
 */
function optionMoveDown(index,row){
	//获取所有行数
	var rows = $("#dgTable").datagrid("getData").rows;
	if(index!=rows.length-1){//不是第一行
		//获取后一行的数据
		var toUp = $("#dgTable").datagrid("getData").rows[index+1];
		//获取当前行数据
		var toDown = $("#dgTable").datagrid("getData").rows[index];
		//交换数据
		$("#dgTable").datagrid("getData").rows[index]=toUp;
		$("#dgTable").datagrid("getData").rows[index+1]=toDown;
		//刷新
		$("#dgTable").datagrid('refreshRow', index);
        $("#dgTable").datagrid('refreshRow', index+1);
        $("#dgTable").datagrid('selectRow', index+1);
	}else{
		$.messager.alert("提示","已经是最后一条数据！","info");
	}
}

/**
 * 给空验证、是否单行设置值
 * @param value
 * @param row
 * @param index
 */
function setValide(value,row,index){
	if(value=="1"){
		return "<img src='../../../css/themes/icons/ok.png'/>";
	}else{
		return "—";
	}
}

//==============================================================

/**
 * 创建数据网格的参数对象
 * 参数： loadUrl 动态加载数据的url 
 * 		  headHeight 包含表格前与表格头以及分页部分的高度
 **/
function createDatagridOptionsExta(bPath, loadUrl, headHeight,a,b,c){
	var hHeight = (typeof headHeight != "undefined") ? headHeight : 135;
	var rowCount = Math.floor((document.body.clientHeight - hHeight)/25);
	var opts = {};
	opts['url'] = bPath + loadUrl;
	opts['pageList'] = [10, 20, 30, 40, 50];
	opts['pageSize'] = rowCount;
	opts['pageList'].push(rowCount);
	opts['accessType']=a;
	opts['categoryCode']=b;
	opts['keyWord']=c;
	
 	//当数据查询完成时，判断数据是否超过一页，如果少于一页，则不显示分页，否则显示分页
 	opts['onLoadSuccess'] = function(data){
 		$(".datagrid-body").css("overflow", "hidden");
		if(data.total<=opts.pageSize){
			$(".datagrid-pager").hide();
		}else{
			$(".datagrid-pager").show();
		}
	};
 	
	return opts;
}

/**
 *初始化下拉树
 */
function loadLeftTree() {
	$("#categoryTree").combotree({
		url:basePath+"/apron_punish_dataaccess_category_findallleaf.json",
		onBeforeExpand:function(node,param){  
             $('#categoryTree').combotree("tree").tree("options").url = basePath+"/apron_punish_dataaccess_category_findallleaf.json?";         
         },
        loadFilter:function(data){
        	return data.rows;
        }
	});
}

function changeValue(boxId) {
    $("#"+boxId+"AccessCodeId").val("");
    $("#"+boxId+"AccessDescId").textbox("setValue","");
}

/**
 * 选择数据访问
 * @param accessType
 * @param boxId
 */
function addAccess(accessType,boxId,categoryCode) {
	var apiType = $("#"+boxId+"TypeId").combobox("getValue");
	if (apiType == "" || apiType == null) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择API类型！", "info");
	} else if(apiType == 0) {
		var categoryCode1=categoryCode==undefined?"":categoryCode;
		inputId = boxId;
		loadLeftTree();
		//给数据网格加载数据
		var params={categoryCode:categoryCode1,keyWord:'',typeCode:accessType};
		//$("#template_dataaccess_dg").datagrid(createDatagridOptionsExta(basePath, "/apron_punish_accesstype_findpage.json",135,accessType,'',''));
		$("#template_dataaccess_dg").datagrid({
			url:basePath + "/apron_punish_dataaccess_findpagebycategorycode.json",
			method:"post",
			dataType:"json",
			queryParams: params
		});
		
		$("#template_dataaccess_dg").datagrid({
				//行的单击事件
				onClickRow:function(index,row){
					//取消所有选择行
					$("#template_dataaccess_dg").datagrid("uncheckAll");
					//选中当前行
					$("#template_dataaccess_dg").datagrid("checkRow",index);
				},
				onDblClickRow:function(index,row){
					//取消所有选中行
					$("#template_dataaccess_dg").datagrid("uncheckAll");
					//选中当前行
					$("#template_dataaccess_dg").datagrid("checkRow",index);
					
					//选中数据
					selectAccess();
				}
		});
		
		//打开窗口
		$("#template_dataaccess_div").dialog({
			title:"选择数据访问",
			modal:true,
			onClose : function() {
				// 清空数据
				$("#accessForm").form("reset");
			},
		}).dialog("open").dialog("center");
	} else if(apiType == 1) {
		addLogic(boxId);
	}
}

/**
 * 数据访问页面查询按钮
 */
function searchAccess() {
	var params={keyWord:$("#accessKeyWordId").textbox("getValue"),categoryCode:$("#categoryTree").combobox("getValue")};
	$("#template_dataaccess_dg").datagrid("reload",params);
}

/**
 * 数据访问页面选择按钮
 */
function selectAccess() {
	// 获取选中数据
	var access = $("#template_dataaccess_dg").datagrid("getSelected");
	$("#"+inputId+"AccessCodeId").val(access.accessCode);
	$("#"+inputId+"AccessDescId").textbox("setValue",access.accessDesc);
	
	cancelSelectAccess();
}

/**
 * 数据访问页面取消按钮
 */
function cancelSelectAccess() {
	$("#template_dataaccess_div").dialog('close');
	$("#accessForm").form('reset');
}

//======================================================================================

/**
 *初始化下拉树
 */
function loadLogicTree(boxId) {
	$("#logicTypeTree").combotree({
		url:basePath+"/apron_punish_dataaccess_category_findallleaf.json",
		onBeforeExpand:function(node,param){  
             $('#logicTypeTree').combotree("tree").tree("options").url = basePath+"/apron_punish_dataaccess_category_findallleaf.json?";         
         },
        loadFilter:function(data){
        	return data.rows;
        }
	});
}

/**
 * 选择业务逻辑
 */
function addLogic(boxId) {
	inputId = boxId;
	loadLogicTree();
	//给数据网格加载数据
	var params={categoryCode:'',keyWord:''};
	$("#template_logic_dg").datagrid({
		url:basePath + "/gmodule_dataaccess_businesslogic_findpage.json",
		method:"post",
		dataType:"json",
		queryParams: params
	});
	
	$("#template_logic_dg").datagrid({
			//行的单击事件
			onClickRow:function(index,row){
				//取消所有选择行
				$("#template_logic_dg").datagrid("uncheckAll");
				//选中当前行
				$("#template_logic_dg").datagrid("checkRow",index);
			},
			onDblClickRow:function(index,row){
				//取消所有选中行
				$("#template_logic_dg").datagrid("uncheckAll");
				//选中当前行
				$("#template_logic_dg").datagrid("checkRow",index);
				
				//选中数据
				selectLogic();
			}
	});
	
	//打开窗口
	$("#template_business_div").dialog({
		title:"选择业务逻辑",
		modal:true,
		onClose : function() {
			// 清空数据
			$("#logicForm").form("reset");
		},
	}).dialog("open").dialog("center");
}

/**
 *业务逻辑页面查询按钮
 */
function searchLogic() {
	var params={keyWord:$("#logicKeyWordId").textbox("getValue"),logicType:$("#logicTypeTree").combobox("getValue")};
	$("#template_logic_dg").datagrid("reload",params);
}

/**
 *业务逻辑页面选择按钮
 */
function selectLogic() {
	// 获取选中数据
	var logic = $("#template_logic_dg").datagrid("getSelected");
	$("#"+inputId+"AccessCodeId").val(logic.logicCode);
	$("#"+inputId+"AccessDescId").textbox("setValue",logic.logicName);
	
	cancelSelectLogic();
}

/**
 * 业务逻辑页面取消按钮
 */
function cancelSelectLogic() {
	$("#template_business_div").dialog('close');
	$("#logicForm").form('reset');
}

/**
 * 格式化是否重复验证列
 * @param value
 * @param index
 * @param row
 */
function isRepeat(value,index,row){
	return value == "" || value == null ? "—" : "<img src='../../../css/themes/icons/ok.png'/>";
}

/**
 * 格式化类型列
 * @param value
 * @param index
 * @param row
 */
function formartterType(value,index,row){
	return value;
}

