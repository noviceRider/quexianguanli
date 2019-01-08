var saveUrl;//新增或修改保存时请求的url
var isNew = true;//是否为新增，true:新增，false：修改

/**
 * 功能:动态加载树形菜单
 * 参数：无
 */
$(function(){
	$("#tt").tree({
		url:logicUrl,
		method:"post",
		animate:true,
		queryParams: {logicId:"09.03.02",isUsed:1},
		loadFilter:function(data1,parent){
			var data = data1.rows;
				return data;
		},
		onSelect:function(node){
			if($("#tt").tree("isLeaf",node.target)){
				$("#dg").datagrid({
					url:accessUrl,
					method:"post",
					dataType:"json",
					queryParams: {
						menuId:node.id,
						accessId: "9501"
					}
				});
			}
		},
		onClick:function(node){
			if(!$("#tt").tree("isLeaf",node.target)){
				$("#tt").tree("toggle",node.target);
			}
		}
	});
});

/**
 * 功能：服务器校验，新增时输入的功能编号是否存在
 * 参数：无
 */
function funcValid(){
	$("#funcId").validatebox({
		required:true,
		missingMessage:"功能编号不能为空",
		invalidMessage:"功能编号已经存在",
		validType:"remoteValid['" + logicUrl + "', 'funcId', " + 
		"{logicId:'09.04.01', menuId:'" + $("#menuId").html() + "'}]"
	});
}

/**
 * 功能：打开新增对话框
 * 参数：无
 */
function doAddNode(){
	isNew = true;//新增
	var node = $("#tt").tree("getSelected");
	if(node==null||!$("#tt").tree("isLeaf",node.target)){
		$.messager.alert("提示信息","请正确选择所属模块!","info");
		return;
	}
	saveUrl = basePath + "/frame_manage_func_add.json";//新增请求的url
	
	$("#hiddenOrShow").css("display","none");
	$("#funcIdText").css("display","none");
	$("#pName").html($("#tt").tree("getSelected").text);
	$("#menuId").css("display","");
	$("#funcId").css("width","85px");
	$("#funcId").css("display","");
	$("#menuId").html($("#tt").tree("getSelected").id + ".");
	
	funcValid();//初始化后台校验
	$("#funcName").validatebox({required: true, missingMessage: "功能名称不能为空"});
	
	$("#dlg_save").show().dialog({
		iconCls:"icon-save",
		title:"新增",
		width:346,
		height:220,
		modal:true,
		buttons:"#btn_dlg",
		onClose:function(){
			$("#form_save").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#funcId").focus();
	}, 300);
}

/**
 * 打开修改对话框
 * 参数：无
 */
function doModify(){
	isNew = false;//修改
	//得到要修改的节点
	//var rows = $("#dg").datagrid("getChecked");
	var funcIds = Common.getSelectedIds("#dg", "funcId", "funcId");
	if(funcIds==null||funcIds.length==0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	}else if(funcIds.length>1){
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	var funcId = funcIds[0].value;
	
	$.ajax({
		url:accessUrl,
		type:"post",  
		data:{funcId:funcId,accessId:"9502"},
		dataType:"json", 
		success:function(data){
			var func = data;
			//填充数据
			$("[name='funcId']").val(func.funcId);
			$("[name='funcId']").css("display","none");
			$("#funcIdText").html(func.funcId);
			$("#funcIdText").css("display","");
			$("[name='funcName']").val(func.funcName);
			$("[name='funcDesc']").val(func.funcDesc);
			$("#hiddenOrShow").css("display","");
			$("[name='isUsed']").attr("checked",func.isUsed=="1"?true:false);
			$("[name='sortNo']").val(func.sortNo);
			$("#pName").html(func.menuName);
			$("#menuId").css("display","none");
			$("#funcName").validatebox({required: true, missingMessage: "功能名称不能为空"});
		}
	});
	
	//设置修改请求路径URL
	saveUrl = basePath + "/frame_manage_func_modify.json";
	
	//显示对话框
	$("#dlg_save").show().dialog({
		iconCls:"icon-save",
		title:"修改",
		width:346,
		height:220,
		modal:true,
		buttons:"#btn_dlg",
		onClose:function(){
			$("#form_save").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#funcName").focus();
	}, 300);
}

/**
 * 功能:取消按钮点击事件，重置输入表单，关闭对话框
 * 参数：无
 */
function doCancel(){
	$("#form_save").form("reset");
	$("#dlg_save").dialog("close");
}

/**
 * 功能：排序号自动填写，默认与功能编号相同
 * 参数：无
 */
function autoFill(){
	var value = $("[name='funcId']").val();
	$("[name='sortNo']").val(value);
}

/**
 * 功能：保存修改或添加
 * 参数：无
 */
function doSave(){
	if($("#form_save").form("validate")){
		var f = $("#form_save").serializeObject();
		f.isUsed = $("[name='isUsed']").is(":checked")?"1":"0";
		//alert(JSON.stringify(f));
		//如果是新增，拼接funcId,设置menuId
		var accessId = "9504";
		if(isNew){
			var menuId =  $("#tt").tree("getSelected").id;
			f.funcId = menuId + "." + f.funcId;
			f.menuId = menuId;
			accessId = "9503";
		}
		f.accessId = accessId;
		
		$.ajax({
			url:accessUrl,
			type:"post",
			data:f,
			dataType:"json",
			success:function(data){
				if(data.resultCode=="1"){
					//更新表格中的数据
					$("#dg").datagrid("reload");
					//$.messager.alert("提示信息","保存成功！");
					doCancel();
				}else{
					$.messager.alert("提示信息","保存失败！","info");
				}
			},
			error:function() {
				$.messager.alert("错误信息","服务器内部错误!","error");
			}
		});
	}
}

/**
 * 功能：格式化isUsed列的显示效果
 * 参数：
 * 	value：某行该列的值
 * 	row：该行的数据
 * 	index：该行的下标
 */
function isUsedFormatter(value, row, index){
	if(value==1){
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} else if(value==0){
		return  "—";
	}
}

/**
 * 功能：删除选中功能
 * 参数：无
 */
function doDelete(){
	var ids = Common.getSelectedIds("#dg", "funcId", "batchFuncId");
	if(ids==null||ids.length==0){
		$.messager.alert("提示信息","请选择要删除的数据！","info");
		return;
	}
	var funcIds = [];
	for(var i in ids){
		funcIds.push("'"+ids[i].value+"'");
	}
	
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r){
		if(r){
			$.ajax({
				url:accessUrl,
				type:"post",
				data:{funcIds:funcIds.join(","),accessId:"9505"},
				success:function(data){
					//更新表格中的数据
					if(data.resultCode==1){
						//更新表格中的数据
						$("#dg").datagrid("reload");
						//$.messager.alert("提示信息","删除数据成功！");
						doCancel();
					}else{
						$.messager.alert("提示信息","删除数据失败！","info");
					}
				},
				error:function() {
					$.messager.alert("错误信息","服务器内部错误!","error");
				}
			});
		};
	});
}

/**
 * 功能：双击行事件
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onDblClickRow(rowIndex,rowData){
	onClickRow(rowIndex,rowData);
	doModify();
}

/**
 * 功能：单击行事件，当选择一行时，复选框也只能选择这行
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onClickRow(rowIndex,rowData){
	//设置成不全选
	$("#dg").datagrid("uncheckAll");
	//选择当前行
	$("#dg").datagrid("checkRow",rowIndex);
}


