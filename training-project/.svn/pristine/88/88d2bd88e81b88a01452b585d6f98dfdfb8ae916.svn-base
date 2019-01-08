var typeCode;//数据类型编码
var url;//新增、修改url
var isNew;//新增、修改标志
var modifyRow;//修改的行

/**
 * 初始加载数据
 */
$(function(){
	//数据类型验证规则
	$.extend($.fn.textbox.defaults.rules, { 
		 chinese : {  
		        validator : function(value, param) {  
		            var reg = /[^\x00-\xff]/;  
		            return !reg.test(value);  
		        },  
		        message : "不能包含中文字符"  
		    }
	});
	$.extend($.fn.validatebox.defaults.rules, {
	    myRemoteValid: {
			validator: function(value, param){
				
				var params = {};
				params[param[1]] = value;
				if($(param[2]) != null) {
					params = $.extend(params, param[2]);
				}

				var data = $.ajax({  
					url: param[0],  
					type: 'post',  
					data: params,
					async:false,  
	                cache:false,
					dataType: 'json'
				}).responseJSON;	
				
				if(data.resultCode == 1)
					//通过验证
					return true;
				else 
					//未通过验证
					return false;
			},
			message: '类型编码已经存在'
	    }
	});
	//加载代码类型页面
	$("#dictType").load("dicttype.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//加载导出弹窗
	$("#dictType_export").load("dicttype_export.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	var params = {keyWord:$("#dictManage_keyWord").textbox("getValue"), typeCode: $("#typeCode").val()};
	
	//初始化数据网格
	$("#dictTable").datagrid(Common.createDatagridOptionsParams(basePath, "/gmodule_datadict_findpage.json", 135, params));
	$("#dictTable").datagrid({
		onDblClickRow:function(index,row){
			modifyDictManage();
		}
	});
	//加载代码管理新增、修改页面
	$("#dictmanage_am").load("dictmanage_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
});

/**
 * 查询数据
 */
function searchDictManage(){
	var params = {keyWord:$("#dictManage_keyWord").textbox("getValue"), typeCode: $("#typeCode").val()};
	$("#dictTable").datagrid("reload",params);
}

/**
 * 添加数据类型
 */
function addDictTypeInfo(){
	showSelectDictType(function callbackfun(data){
		//给代码类型设置值
		$("#codeType").textbox("setValue",data.typeDesc);
		$("#typeCode").val(data.typeCode);
		typeCode=data.typeCode;
		//获取加载的参数
		var params={typeCode:typeCode};
		//选择之后加载数据
		$("#dictTable").datagrid({
			mehtod:'post',
			queryParams:params,
			url:basePath+"/gmodule_datadict_findpage.json"
		});
	});
}

/**
 * 新增代码管理
 */
function addDictManage(){
	//获取代码类型值
	var value = $("#codeType").textbox("getValue");
	if(value==""){
		$.messager.alert("提示信息","请添加代码类型!");
	}else{
		//新增标志
		isNew=true;
		//设置新增url
		url=basePath+"/gmodule_datadict_add.json";
		//打开对话框
		$("#dictmanage_dlg_am").dialog({
			modal:true,
			title:"新增字典信息",
			shadow:false,
			onClose:function(){
				//清空数据
				$("#dictmanage_fm_am").form("reset");
			}
		});
		
		//禁用代码框和给输入框设置值
		$("#typeDescId").textbox("setValue", value);
		$("#typeDescId").textbox("readonly",true);
		$("#typeDescId").textbox("disable");
		
		//启用输入框
		$("#dictCodeId").textbox("enable");

		//进行验证
		validateDictManage();
		//获取焦点
		$("#dictCodeId").textbox().next("span").find("input").focus();
	}
}

/**
 * 修改代码管理
 */
function modifyDictManage(){
	//修改标志
	isNew=false;
	//设置修改url
	url=basePath+"/gmodule_datadict_modify.json";
	//获取选择的数据
	var rows=$("#dictTable").datagrid("getSelections");
	
	if(rows.length!=1){
		$.messager.alert("提示信息","请选择要修改的数据");
	}else{
		modifyRow=rows[0];
		//数据回显
		$("#dictmanage_fm_am").form("load",modifyRow);
		
		//禁用代码框
		$("#dictCodeId").textbox("disable");
		$("#typeDescId").textbox("disable");
		
		//打开对话框
		$("#dictmanage_dlg_am").dialog({
			modal:true,
			title:"修改字典信息",
			shadow:false,
			onClose:function(){
				//清空数据
				$("#dictmanage_fm_am").form("reset");
			}
		});
		
		//进行验证
		validateDictManage();
		//获取焦点
		$("#dictDescCnid").textbox().next("span").find("input").focus();
	}
}

/**
 * 新增、修改保存
 */
function saveDictManage(){
	//获取新增的数据
	var data=$("#dictmanage_fm_am").serializeObject();
	if(isNew){
		//新增时
		data.typeCode=typeCode;
	}else{
		//修改时
		data.dictCode=modifyRow.dictCode;
		data.typeCode=typeCode;
	}
	//提交数据
	if($("#dictmanage_fm_am").form("validate")){
		$.ajax({
			url:url,
			data:data,
			type:'post',
			success:function(data){
				if(data.resultCode==1){
					//关闭对话框
					$("#dictmanage_dlg_am").dialog("close");
					//清空数据
					$("#dictmanage_fm_am").form("reset");
					//刷新数据网格
					$("#dictTable").datagrid("reload");
				}else{
					$.messager.alert("提示信息","操作失败！","info");
				}
			}
		});
	}
}


/**
 * 新增、修改代码管理退出
 */
function cancelDictManage(){
	//关闭对话框
	$("#dictmanage_dlg_am").dialog("close");
	//清空数据
	$("#dictmanage_fm_am").form("reset");
}

/**
 * 删除代码管理
 */
function removeDictManage(){
	//获取修改的数据
	var rows=$("#dictTable").datagrid("getSelections");
	console.log(typeCode);
	if(rows.length!=1){
		$.messager.alert("提示信息","请选择要删除的数据");
	}else{
		$.messager.confirm("提示信息","你确定要删除这条数据吗？删除后将无法恢复！",function(r){
			if(r){
				$.ajax({
					url:basePath+"/gmodule_datadict_remove.json",
					type:'post',
					data:{dictCode:rows[0].dictCode,typeCode:typeCode},
					success:function(data){
						if(data.resultCode==1){
							//刷新数据网格
							$("#dictTable").datagrid("reload");
						}else{
							$.messager.alert("提示信息","删除失败！","info");
						}
					}
				});
			}
		});
	}
}

/**
*设置是否有效初始值
*/
function setIsUsed(value,row,index){
	if(value==1){
		return "<img src='../../../css/themes/icons/ok.png'/>";
	}else{
		return "—";
	}
}

/**
 * 验证代码管理描述，不能为空也不能重复
 */
function validateDictManage() {
	if(isNew){
		$("#dictCodeId").textbox({
			required:true,
			missingMessage:"字典编码不能为空",
//			invalidMessage:"字典编码已经存在",
//			validType:"remoteValid['"+basePath+"/gmodule_datadict_validateddictCode.json','dictCode',{dictCode:'"+$("#dictCodeId").val()+"'}]"
		});
		$("#dictDescCnid").textbox({
			required:true,
			missingMessage:"字典描述不能为空",
			invalidMessage:"字典描述已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_datadict_validatedicttypedesc.json','dictDesc',{typeCode:'"+$("#typeCode").val()+"'}]"
		});
	}else{
		$("#dictDescCnid").textbox({
			required:true,
			missingMessage:"字典描述不能为空",
			invalidMessage:"字典描述已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_datadict_validatedicttypedesc.json','dictDesc',{dictCode:'"+modifyRow.dictCode+"',typeCode:'"+$("#typeCode").val()+"'}]"
		});
	}
}

function exportDictManage(){
	//给数据网格加载数据
	$("#dictType_export_dg").datagrid({
		idField:'typeCode',
		method:"post",
		url:basePath+"/gmodule_dicttype_findpage.json"
	});
	//打开窗口
	$("#selectDictType_export").dialog({
		title:"选择数据类型导出",
		modal:true,
		onBeforeOpen:function(){
			$("#dictType_export_dg").datagrid("unselectAll");
		}
	}).dialog("open").dialog("center");
}
/**
 * 根据数据字典分类导出信息
 */
function exportData(){
	var data = [];
	var allSelect = $("#dictType_export_dg").datagrid("getSelections");
	if(allSelect.length>0){
		for(var i=0;i<allSelect.length;i++){
			data.push(allSelect[i].typeCode);
		}
		var types = data.join(",");
		$("#ff").form("submit",{
			url:basePath+"/gmodule_datadict_export.json?",
			onSubmit:function(params){
				params.typeCodes = types;
				$("#selectDictType_export").dialog("close");
			}
		});
	}else{
		$.messager.alert('提示', '请选择数据类型导出!', 'error');
	}
}

/**
 * 导入数据字典，打开导入对话框
 */
function importDictManage(){
	//打开对话框
	$("#dlg_importExcel").show().dialog({
		title : "导入数据字典信息",
		modal : true
	});
}

/**
 * 确认导入信息
 */
function doImportExcel() {
	if ($("[name='file']").val() == null
			|| $("[name='file']").val() == "") {
		$.messager.alert("提示信息", "导入文件不能为空！", "info");
	} else {
		Common.ajaxLoading();
		$("#dlg_importExcel").dialog("close");
		$("#form_import").form("submit", {
			url : basePath + "/gmodule_datadict_import.json",
			success : function(data) {
				Common.ajaxLoadEnd();
				data = JSON.parse(data);
				if (data.resultCode == "1") {
					$.messager.alert("提示", "导入成功！", "info");
					searchDictManage();
				} else {
					$.messager.alert("提示", "导入数据字典信息失败！", "info");
				}
				$("#form_import").form("reset");
			},
		    onSubmit: function(param){
		    }
		});
	}
}
/**
 * 导出弹窗中的查询
 */
function searchDictTypeExport(){
	//清除数据网格选中
	$("#dictType_export_dg").datagrid("clearSelections");
	$("#dictType_export_dg").datagrid("reload",{keyWord:$("#dictKeyWord_export").textbox("getValue")});
}
