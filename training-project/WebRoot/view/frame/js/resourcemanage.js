//是否为新增资源类型
var isNewType = true;
//是否为新增资源
var isNewRes = true;
//是否为新增资源权限
var isNewAuth = true;
//是否为修改资源类型
var isModifyType = true;

/**
 * 页面加载完成后就执行，加载资源数据
 */
$(function(){
	loadTreegrid();
});

/**
 * 加载树形网格数据
 */
function loadTreegrid(){
	//设置treegrid初始属性及方法
	$("#tg_res").treegrid({
		url:basePath + '/resource_manage_sysres_findres.json',
		idField: 'resCode',
		treeField: 'resName',
		parentField : 'pResCode',
		animate: true,
		striped:true,
		method: 'post',
		singleSelect:true,
		onBeforeExpand: onBeforeExpand,
		onClickCell:function(field,row){
			if(field=="resName"){
				var children = $("#tg_res").treegrid("getChildren",row.resCode);
				//alert(children.length);
				if(row.childNum>0||children.length>0){
					$(this).treegrid("toggle",row.resCode);
				}
			}
		},
		onDblClickCell:function(field,row){
			if(field!="resName"){
				doModify();
			}
		},
		//在树上右键点击的菜单
		onContextMenu: function(e, row){
			e.preventDefault();
			$(this).treegrid('select',row.resCode);
			$('#mm').menu('show',{
				left: e.pageX,
				top: e.pageY
			});
		}
	});
	
	//加载treegrid数据
	/*$.ajax({  
		url: basePath + '/resource_manage_sysres_findres.json',  
		type: 'post',
		async: false,
		dataType: 'json', 
		//data:$("#form_searchres").serializeObject(),
		success:function(data) {
			$("#tg_res").treegrid('loadData',data);
		},
		error : function() {
			$.messager.alert('错误','服务器内部错误!','error');
		}
	});*/
}

/**
 * 功能：节点展开之前的事件
 * @param row
 */
function onBeforeExpand(row){
	//判断是否需要加载子节点
	if(row.children==undefined||row.children==[]){
		var resCode = row.resCode;
		var childNodes = reloadChildrenMenu(row);
		$('#tg_res').treegrid('append',{
			parent: resCode,  
			data: childNodes
		});
	}
}

/**
 * 功能：加载子节点数据
 * @param row
 * @returns
 */
function  reloadChildrenMenu(row){
	var resChildData = undefined;
	//row.isUsed = $("#searchForm").find(":checkbox").is(':checked')?'':'1';
	row = $.extend({},row, $("#form_searchres").serializeObject());
	$.ajax({  
		type: 'post',
		async: false,
		data:row,
		url: basePath + '/resource_manage_sysres_findres.json',
		success:function(data) {
			resChildData = data.rows;
		},
		error : function() {
			$.messager.alert('错误','服务器内部错误!','error');
		}
	});
	
	return resChildData;
}
//------------------------------------------
/**
 * 打开资源类型列表弹窗
 * 1，加载资源类型数据
 * 2，显示资源类型列表弹出框
 */
function showResType(){
	isModifyType = true;
	$("#dg_restype").datagrid(Common.createDatagridOptionsExt(basePath, "/resource_manage_restype_list.json"));
	$("#dlg_restype").show().dialog();
}

/**
 * 打开资源权限列表弹窗
 * 1，加载资源权限数据
 * 2，显示资源权限列表弹出框
 */
function showResAuth(){
	isModifyType = false;
	$("#dg_resauth").datagrid(Common.createDatagridOptionsExt(basePath, "/resource_manage_restypeop_list.json"));
	$("#dlg_resauth").show().dialog();
}

/**
 * 打开选择资源类型对话框
 * 1，加载资源类型数据
 * 2，显示资源类型列表弹出框
 */
function selectType(){
	$("#dg_select").datagrid(Common.createDatagridOptionsExt(basePath, "/resource_manage_restype_list.json"));
	$("#dlg_select").show().dialog();
}

/**
 * 条件查询资源类型
 */
function searchType(){
	$("#dg_restype").datagrid("load",$("#form_searchtype").serializeObject());
}

/**
 * 条件查询资源权限
 */
function searchAuth(){
	$("#dg_resauth").datagrid("load",$("#form_searchauth").serializeObject());
}

/**
 * 条件查询资源
 */
function doSearch(){
	
	//加载treegrid数据
	$.ajax({  
		url: basePath + '/resource_manage_sysres_findres.json',  
		type: 'post',
		async: false,
		dataType: 'json',
		data:$("#form_searchres").serializeObject(),
		success:function(data) {
			$("#tg_res").treegrid('loadData',data);
		},
		error : function() {
			$.messager.alert('错误','服务器内部错误!','error');
		}
	});
}

/**
*分类列数据格式
*/
function resDescFormatter(value, row, index){
	if(value != null && value != "") {
		return '<span title='+value.replace(/\s+/g,"")+'>'+value+'</span>' ;
	}
}

/**
*当双击单元格时，修改当前行
*/
function onDblClickRow(rowIndex,rowData){
	if(isModifyType) {
		showModifyTypeDlg();
	}else{
		showModifyAuthDlg();
	}
}

//---------TODO 资源类型---------------------------------------
/**
 * 显示新增资源类型对话框
 */
function showAddTypeDlg(){
	isNewType = true;//新增资源类型
	$("#form_savetype").form("reset");
	$("#type_isUsed").css("display","none");
	$("#typeCode_type").css("display","none");
	$("#form_savetype [name='typeCode']").css("display","");
	
	resTypeValid();
	$("#dlg_savetype").show().dialog({
		title:"新增资源类型",
		onClose:function(){
			$("#form_savetype").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#form_savetype [name='typeCode']").focus();
	},300);
}

/**
 * 显示修改资源类型对话框
 */
function showModifyTypeDlg(){
	isNewType = false;//修改资源类型
	$("#form_savetype").form("reset");

	var row = $("#dg_restype").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择需要修改的资源类型！","info");
		return;
	}
	
	//填写数据
	$("#form_savetype").form("load",row);
	//初始化校验
	//设置类型编号不可编辑切背景为灰色
	$("#form_savetype [name='typeCode']").css("display","none");
	$("#type_isUsed").css("display","");
	$("#typeCode_type").css("display","");
	$("#typeCode_type").text(row.typeCode);
	
	resTypeValid();
	//显示对话框
	$("#dlg_savetype").show().dialog({
		title:"修改资源类型",
		onClose:function(){
			$("#form_savetype").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#form_savetype [name='typeDesc']").focus();
	},300);
}

/**
 * 保存资源类型（新增或修改）
 */
function saveType(){
	var url = "";
	if(isNewType){
		url = basePath + "/resource_manage_restype_add.json";//新增url
	}else{
		url = basePath + "/resource_manage_restype_modify.json";//修改url
	}
	
	if($("#form_savetype").form("validate")){
		$.ajax({
			url:url,
			type:"post",
			data:$("#form_savetype").serializeObject(),
			dataType:"json",
			success:function(data){
				if(data.resultCode==1){
					$("#dg_restype").datagrid("reload");
					$("#dlg_savetype").dialog("close");
				}else{
					$.messager.alert("提示信息","保存资源类型失败！","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误！","error");
			}
		});
	}
}

/**
 * 保存资源类型表单的输入校验
 */
function resTypeValid(){
	$("#form_savetype [name='typeCode']").validatebox({
		required:true,
		missingMessage:"资源类型编号不能为空",
		invalidMessage:"类型编号已经存在",
		validType:"remoteValid['" + basePath + "/resource_manage_restype_valid.json', 'typeCode']"
	});
	
	if(isNewType){
		$("#form_savetype [name='typeCode']").validatebox("enableValidation");
	}else{
		$("#form_savetype [name='typeCode']").validatebox("disableValidation");
	}
	
	$("#form_savetype [name='typeDesc']").validatebox({
		required:true,
		missingMessage:"资源类型名称不能为空"
	});
}

/**
 * 删除资源类型
 */
function delType(){
	var ids = Common.getSelectedIds("#dg_restype", "typeCode", "typeCode");
	if(ids==null||ids.length==0){
		$.messager.alert("提示信息","请选择要删除的数据！","info");
		return;
	}
	
	$.messager.confirm("确认", "只能删除新创建还没有资源项的类型，资源类型下已经有资源项的类型将不能被删除，是否删除选中的资源类型？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/resource_manage_restype_remove.json",
				type:"post",
				data:ids,
				success:function(data){
					//更新表格中的数据
					if(data.resultCode=="1"){
						//更新表格中的数据
						$("#dg_restype").datagrid("reload");
					}else if(data.resultCode=="2"){
						$.messager.alert("提示信息","删除数据失败，不能删除有资源项的资源类型！","info");
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

//-------TODO 资源权限-----------------------------

/**
 * 显示新增资源权限对话框
 */
function showAddAuthDlg(){
	isNewAuth = true;//新增资源权限
	$("#form_saveauth").form("reset");
	
	$("#form_saveauth [name='opCode']").css("display","");
	//隐藏是否有效对话框
	$("#auth_isUsed").css("display","none");
	$("#opCode_auth").css("display","none");
	
	resAuthValid();
	$("#dlg_saveauth").show().dialog({
		title:"新增资源权限",
		onClose:function(){
			$("#form_saveauth").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#form_saveauth [name='opCode']").focus();
	},300);
}

/**
 * 显示修改资源类型对话框
 */
function showModifyAuthDlg(){
	isNewAuth = false;//修改资源权限
	isModifyType = false;
	$("#form_saveauth").form("reset");
	
	var row = $("#dg_resauth").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择需要修改的资源权限！","info");
		return;
	}
	
	//填写数据
	$("#form_saveauth").form("load",row);
	//初始化校验
	//设置权限编号不可编辑切背景为灰色
	$("#form_saveauth [name='opCode']").css("display","none");
	$("#auth_isUsed").css("display","");
	$("#opCode_auth").css("display","");
	$("#opCode_auth").text(row.opCode);
	//$("#selectBtn_auth").css("display","none");
	
	resAuthValid();
	//显示对话框
	$("#dlg_saveauth").show().dialog({
		title:"修改资源权限",
		onClose:function(){
			$("#form_saveauth").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#form_saveauth [name='opDesc']").focus();
	},300);
}

/**
 * 保存资源权限（新增或修改）
 */
function saveAuth(){
	var url = "";
	if(isNewAuth){
		url = basePath + "/resource_manage_restypeop_add.json";//新增url
	}else{
		url = basePath + "/resource_manage_restypeop_modify.json";//修改url
	}
	
	if($("#form_saveauth").form("validate")){
		$.ajax({
			url:url,
			type:"post",
			data:$("#form_saveauth").serializeObject(),
			dataAuth:"json",
			success:function(data){
				if(data.resultCode==1){
					$("#dg_resauth").datagrid("reload");
					$("#dlg_saveauth").dialog("close");
				}else{
					$.messager.alert("提示信息","保存资源权限失败！","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误！","error");
			}
		});
	}
}

/**
 * 保存资源权限表单的输入校验
 */
function resAuthValid(){
	$("#form_saveauth [name='opCode']").validatebox({
		required:true,
		missingMessage:"权限编号不能为空",
		invalidMessage:"权限编号已经存在",
		validType:"remoteValid['" + basePath + "/resource_manage_restypeop_valid.json', 'opCode']"
	});
	
	if(isNewAuth){
		$("#form_saveauth [name='opCode']").validatebox("enableValidation");
	}else{
		$("#form_saveauth [name='opCode']").validatebox("disableValidation");
	}
	
	$("#form_saveauth [name='opDesc']").validatebox({
		required:true,
		missingMessage:"权限名称不能为空"
	});
}

/**
 * 删除资源权限
 */
function delAuth(){
	var ids = Common.getSelectedIds("#dg_resauth", "opCode", "opCode");
	if(ids==null||ids.length==0){
		$.messager.alert("提示信息","请选择要删除的数据！","info");
		return;
	}
	$.messager.confirm("确认", "只能删除新创建还没有使用的资源权限，已经使用过的资源权限将不能被删除，是否删除选中的资源授权？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/resource_manage_restypeop_remove.json",
				type:"post",
				data:ids,
				success:function(data){
					//更新表格中的数据
					if(data.resultCode=="1"){
						//更新表格中的数据
						$("#dg_resauth").datagrid("reload");
					}else if(data.resultCode=="2"){
						$.messager.alert("提示信息","删除数据失败，不能删除已经使用过的资源权限！","info");
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

//-------TODO 资源---------------------------------------------
/**
 * 显示新增资源对话框
 */
function doAdd(){
	isNewRes = true;//新增资源
	$("#form_saveres").form("reset");
	
	var row = $("#tg_res").treegrid("getSelected");
	//设置父级资源编码
	if(row==null){
		$("#pResCode").text("");
		$("#form_saveres [name='pResCode']").val("");
		$("#selectBtn_res").css("display","");
	}else{
		$("#selectBtn_res").css("display","none");
		$("#pResCode").text(row.resCode);
		$("#form_saveres [name='pResName']").val(row.resName);
		$("#form_saveres [name='typeCode']").val(row.typeCode);
		$("#form_saveres [name='typeDesc']").val(row.typeDesc);
	}
	
	//隐藏资源编码文本
	$("#resCode").css("display","none");

	$("#pResCode").css("display","");
	$("#form_saveres [name='resCode']").css("display","");
	$("#res_isUsed").css("display","none");
	$("#removeBtn").css("display","");
	
	resValid();
	$("#dlg_saveres").show().dialog({
		title:"新增资源",
		onClose:function(){
			$("#form_saveres").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#form_saveres [name='resCode']").focus();
	},300);
}

/**
 * 显示修改资源对话框
 */
function doModify(){
	isNewRes = false;//修改资源
	$("#form_saveres").form("reset");
	
	var row = $("#tg_res").treegrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择需要修改的资源！","info");
		return;
	}
	
	$("#resCode").css("display","");
	$("#pResCode").css("display","none");
	$("#selectBtn_res").css("display","none");
	$("#form_saveres [name='resCode']").css("display","none");
	$("#resCode").text(row.resCode);
	//$("form_saveres [name='pResCode']").val(row.pResCode);
	
	$("#res_isUsed").css("display","");
	$("#removeBtn").css("display","none");
	//填写数据
	$("#form_saveres").form("load",row);
	//初始化校验
	resValid();
	
	//显示对话框
	$("#dlg_saveres").show().dialog({
		title:"修改资源",
		onClose:function(){
			$("#form_saveres").form("reset");
		}
	});
	
	setTimeout(function(){
		$("#form_saveres [name='resName']").focus();
	},300);
}

/**
 * 保存资源（新增或修改）
 */
function saveRes(){
	var url = "";
	var formData = $("#form_saveres").serializeObject();
	if(isNewRes){
		formData.pResCode = $("#pResCode").text();
		url = basePath + "/resource_manage_sysres_add.json";//新增url
	}else{
		url = basePath + "/resource_manage_sysres_modify.json";//修改url
	}
	if($("#form_saveres").form("validate")){
		$.ajax({
			url:url,
			type:"post",
			data:formData,
			dataType:"json",
			success:function(data){
				if(data.resultCode==1){
					//新增或修改成功则更新treeGrid
					if(isNewRes){
						if(formData.pResCode!=null && formData.pResCode!=""){
							formData.resCode = formData.pResCode+"."+formData.resCode;
						}
						$("#tg_res").treegrid("append",{
							parent:formData.pResCode,
							data:[formData]
						});
					}else{
						$("#tg_res").treegrid("update",{
							 id:formData.resCode,
							 row:formData
						 });
					}
					$("#dlg_saveres").dialog("close");
				}else{
					$.messager.alert("提示信息","保存资源失败！","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误！","error");
			}
		});
	}
}

/**
 * 保存资源表单的输入校验
 */
function resValid(){
	$("#form_saveres [name='resCode']").validatebox({
		required:true,
		missingMessage:"资源编码不能为空",
		invalidMessage:"资源编码已经存在",
		validType:"remoteValid['" + basePath + "/resource_manage_sysres_valid.json', 'resCode', " + 
		"{pResCode:'" + $("#pResCode").text() + "'}]"
	});
	
	if(isNewRes){
		$("#form_saveres [name='resCode']").validatebox("enableValidation");
	}else{
		$("#form_saveres [name='resCode']").validatebox("disableValidation");
	}
	
	$("#form_saveres [name='resName']").validatebox({
		required:true,
		missingMessage:"资源名称不能为空"
	});
	
	$("#form_saveres [name='typeDesc']").validatebox({
		required:true,
		missingMessage:"资源类型不能为空"
	});
}

/**
 * 删除资源
 */
function doDelete(){
	var ids = Common.getSelectedIds("#tg_res", "resCode", "resCode");
	var row = $("#tg_res").treegrid("getSelected");
	if(ids==null||ids.length==0){
		$.messager.alert("提示信息","请选择要删除的数据！","info");
		return;
	}
	$.messager.confirm("确认", "只能删除新创建还没有授权资源，已经授权的资源将不能被删除，是否删除选中的资源？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/resource_manage_sysres_remove.json",
				type:"post",
				data:ids,
				success:function(data){
					//更新表格中的数据
					if(data.resultCode=="1"){
						//更新表格中的数据
						$("#tg_res").treegrid("remove",row.resCode);
					}else if(data.resultCode=="2"){
						$.messager.alert("提示信息","删除数据失败，不能删除已授权的资源！","info");
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
 * 删除选择的上级资源，即将资源添加到根目录
 */
function removeParentRes(){
	$.messager.confirm("确认", "移除选择的上级资源后，资源将被添加到根目录，是否确认移除？", function(r){
		if(r){
			$("#pResCode").text("");
			$("#pResCode").css("display","none");
			$("#selectBtn_res").css("display","");
			$("#form_saveres [name='pResCode']").val("");
			$("#form_saveres [name='pResName']").val("");
		}
	});
}

/**
 * 打开批量导入对话框
 */
function doImport(){
	$("#form_import [name='typeCode']").validatebox({required:true,missingMessage:"请选择资源类型"});
	$("#form_import [name='excelFile']").validatebox({required:true,missingMessage:"请选择资源文件"});
	$("#dlg_import").show().dialog({
		onClose:function(){
			//$("#form_import").form("reset");
		}
	});
}

/**
 * 开始导入
 */
function startImport(){
	if($("#form_import").form("validate")){
		load();
		$("#dlg_import").dialog("close");
		$("#form_import").form("submit",{
			method: "POST",
			url: basePath + "/resource_manage_sysres_importexcel.json",
			success: function(data){
				disLoad();
				data = JSON.parse(data);
				if(data.resultCode=="1"){
					$("#tg_res").treegrid('reload');
				} else{
					$.messager.alert("错误信息", "在导入资源信息的过程中发生错误，请检查文件格式后重新尝试或联系系统管理人员", "error");
				}
				$("#form_import").form('reset');
			},
			error:function(){
				$.messager.alert("错误", "服务器内部错误！", "error");
			}
		});
	}
}

/**
 * 弹出加载层
 */
 function load() {  
     $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");  
     $("<div class=\"datagrid-mask-msg\"></div>").html("正在导入，请勿进行其它操作！").appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });  
 }  
   
 /**
  * 取消加载层
  */
 function disLoad() {  
     $(".datagrid-mask").remove();  
     $(".datagrid-mask-msg").remove();  
 }
 
//-------TODO 公共方法-----------------------------
/**
 * 有无、是否等格式化显示
 * @param value
 * @param row
 * @param index
 * @returns {String}
 */
function isOrNotFormatter(value, row, index){
	if(value==1){
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} else if(value==0){
		return  "—";
	}
}

/**
 * 根据domId点击取消关闭对话框
 * @param domId 对话框的ID
 */
function doCancel(domId){
	$(domId).dialog("close");
}

/**
 * 选择资源类型
 */
function doSelectType(){
	var row = $("#dg_select").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择资源类型","info");
		return;
	}
	$("[name='typeCode']").val(row.typeCode);
	$("[name='typeDesc']").val(row.typeDesc);
	doCancel("#dlg_select");
}

/**
 * 选择资源类型
 */
function cancelSelect(){
	$("[name='typeCode']").val("");
	$("[name='typeDesc']").val("");
	doCancel("#dlg_select");
}

/**
 * 排序号根据编号自动填写
 */
function sortNoAutoFill(domId1,domId2){
	var value = $(domId1+" [name='"+domId2+"']").val();
	$(domId1+" [name='sortNo']").val(value);
}
