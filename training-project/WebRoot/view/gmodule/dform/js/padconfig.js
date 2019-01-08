var url;//请求url
var isNew;//新增、修改标志

/**
 * 初始化页面，加载数据
 */
$(function(){

	//数据网格加载数据
	$("#padconfig_dg").datagrid(Common.createDatagridOptionsExt(basePath, "/gmodule_dform_padconfig_findpage.json",135));

	//给数据网格设置属性事件
	$("#padconfig_dg").datagrid({
		//行的单击事件
			onClickRow:function(index,row){
				//取消所有选择行
				$("#padconfig_dg").datagrid("uncheckAll");
				//选中当前行
				$("#padconfig_dg").datagrid("checkRow",index);
			},
			onDblClickRow:function(index,row){
				//取消所有选中行
				$("#padconfig_dg").datagrid("uncheckAll");
				//选中当前行
				$("#padconfig_dg").datagrid("checkRow",index);
				
				//修改选中数据
				modifyPadconfig();
			}
	});
	
	//加载新增、修改页面
	$("#dialog_add_modify").load("padconfig_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//访问数据页面
	$("#dialog_dataaccess").load("padconfig_dataaccess.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//访问数据页面
	$("#dialog_businesslogic").load("padconfig_businesslogic.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//加载ui配置页面
	$("#dialog_uiconfig").load("padconfig_uiconfig.html", null, function(){
		$.parser.parse(this);
	});
	
	//对应表名页面
	$("#dialog_table").load("padconfig_table.html", null, function(){
		$.parser.parse(this);
	});
	
});

/**
 * 查询
 */
function queryPadconfig(){
	$("#padconfig_dg").datagrid("reload",{keyWord:$("#keyWord").textbox("getValue")});
}

/**
 * 新增
 */
function addPadconfig(){
	//设置新增标识
	isNew = true;
	//设置新增url
	url=basePath+"/gmodule_dform_padconfig_addPadconfig.json";
	
	//加载菜单编号
	configIdFormatter();
	
	//隐藏
	$("#configIdTr").hide();
	
	// 打开新增对话框
	$("#padconfig_add_modify_div").dialog({
		modal : true,
		title : "新增PAD表单配置",
		onClose : function() {
			// 清空数据
			$("#padconfig_add_modify_form").form("reset");
		},
	}).dialog("center");

	//验证
	validateConfig();
	
	//获取焦点
	$("#formNameId").textbox().next("span").find("input").focus();
}

/**
 * 修改
 */
function modifyPadconfig(){
	//设置修改标识
	isNew = false;
	//得到要修改的节点
	var rows = $("#padconfig_dg").datagrid("getSelections");
	
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	//设置修改url
	url=basePath+"/gmodule_dform_padconfig_modifyPadconfig.json";
	
	//加载菜单编号
	configIdFormatter();
	
	//显示
	$("#configIdTr").show();
	
	//禁用表名输入框
	$("#configIdId").textbox("disable");
	// 数据回显
	$("#padconfig_add_modify_form").form("load",rows[0]);
//	$("#apiTypeId").combobox("select",rows[0].apiType);
	
	// 打开新增对话框
	$("#padconfig_add_modify_div").dialog({
		modal : true,
		title : "修改PAD表单配置",
		onClose : function() {
			// 清空数据
			$("#padconfig_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//验证
	validateConfig();
	
	//获取焦点
	$("#formNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改保存
 */
function doSave(){
	// 序列化表单
	var config = $("#padconfig_add_modify_form").serializeObject();
	config.configId = $("#configIdId").textbox("getValue");
	console.log(config);
	// 保存提交数据
	if($("#padconfig_add_modify_form").form("validate")){
		$.ajax({
			url: url,
			type: "post",
			data: config,  
			dataType:"json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$("#padconfig_dg").datagrid("reload");
					//关闭对话框
					doCancel();
				} else if (data.resultCode == "0") {
					$.messager.alert("提示信息", "操作失败了，请联系管理员1", "error");
				} else {
					$.messager.alert("提示信息", "操作失败，请联系管理员2", "error");
				}
			},
			error : function() {
				$.messager.alert("错误", "服务器内部错误!", "error");
			}
		});
	}
}

/**
 * 新增、修改取消
 */
function doCancel(){
	//关闭对话框
	$("#padconfig_add_modify_div").dialog("close");
	
	//清空数据
	$("#padconfig_add_modify_form").form("reset");
}

/**
 * 删除
 */
function removePadconfig(){
	// 得到要删除的行节点
	var batchConfigId = Common.getSelectedIds("#padconfig_dg", "configId", "batchConfigId");
	if (batchConfigId == null || batchConfigId.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			$.ajax({
				url : basePath + "/gmodule_dform_padconfig_removePadconfig.json",
				type : "post",
				data : batchConfigId,
				success : function(data) {
					// 更新表格中的数据
					if (data.resultCode == "1") {
						// 更新页面数据
						$("#padconfig_dg").datagrid("reload");
						$.messager.alert("提示信息", "删除数据成功！");
					} else {
						$.messager.alert("提示信息", "删除数据失败！", "info");
					}
				},
				error : function() {
					$.messager.alert("错误信息", "服务器内部错误!", "error");
				}
			});
		}
		;
	});
}

/**
 * 验证表单名称
 */
function validateConfig() {
	if(isNew){// 新增验证
		$("#formNameId").textbox({
			required:true,
			missingMessage:"表单名称不能为空",
			invalidMessage:"表单名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_padconfig_validateFormName.json','formName']"
		});
	}else{// 修改验证
		$("#formNameId").textbox({
			required:true,
			missingMessage:"表单名称不能为空",
			invalidMessage:"表单名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_padconfig_validateFormName.json','formName',{configId:'"+$("#configIdId").textbox("getValue")+"'}]"
		});
	}
}

/**
 * 格式化是否有效数据列
 */
function isUsedFormatter(value,row,index){
	if (value == 1) {// 有效
		return "<img src='../../../css/themes/icons/ok.png'/>";
	} else if (value == 0) {// 无效
		return "—";
	}
}

/**
 * 格式化菜单名称(编号)
 */
function menuFormatter(value,row,index){
	return row.menuName+"("+row.menuId+")";
}

/**
 * 格式化数据访问描述(名称)
 */
function accessFormatter(value,row,index){
	if(row.apiType == 0){
		if (row.accessDesc == null || row.accessDesc == "" ) {
			return "";
		}else{
			return row.accessDesc+"("+row.accessName+")";
		}
	}else if(row.apiType == 1){
		return row.accessName;
	}
	
}

/**
 * 格式化菜单编号下拉选项
 */
function configIdFormatter() {
	//加载菜单编号
	$("#menuIdId").combotree({
		url:basePath+"/frame_manage_menu_findmenudatatree.json",
		method:'post',
		animate: true,
		loadFilter: function(data) {
			return data.rows;
		},
		onBeforeSelect: function(node) {  
            // 判断是否是叶子节点  
            var isLeaf = $(this).tree('isLeaf', node.target);  
            if (!isLeaf) {  
            	$.messager.alert("提示信息", "请选择叶子节点", "info"); 
                // 返回false表示取消本次选择操作  
                return false;  
            }else{
            	categoryCode = node.id;
            }  
        }  
	});
}

/**
 * 选择访问数据编号
 */
function addAPIName() {
	var apiType = $("#apiTypeId").combobox("getValue");
	console.log(apiType);
	if (apiType == "" || apiType == null) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择API类型！", "info");
	} else if(apiType == 0) {
		//给数据网格加载数据
		$("#padconfig_dataaccess_dg").datagrid({
			url: basePath + "/apron_punish_dataaccess_findpage.json",
			queryParams:{keyWord:$("#dataTypeKeyWord").textbox("getValue")},
				//行的单击事件
				onClickRow:function(index,row){
					//取消所有选择行
					$("#padconfig_dataaccess_dg").datagrid("uncheckAll");
					//选中当前行
					$("#padconfig_dataaccess_dg").datagrid("checkRow",index);
				},
				onDblClickRow:function(index,row){
					//取消所有选中行
					$("#padconfig_dataaccess_dg").datagrid("uncheckAll");
					//选中当前行
					$("#padconfig_dataaccess_dg").datagrid("checkRow",index);
					
					//选中设置数据
					selectDataAccess();
				}
		});
		
		//打开窗口
		$("#padconfig_dataaccess_div").dialog({
			title:"选择数据访问",
			modal:true,
			onClose : function() {
				// 清空数据
				$("#dataaccessForm").form("reset");
			},
		}).dialog("open").dialog("center");
	} else if(apiType == 1) {
		//给数据网格加载数据
		$("#padconfig_businesslogic_dg").datagrid({
			url: basePath + "/gmodule_dataaccess_businesslogic_findpage.json",
			queryParams:{keyWord:$("#logicKeyWord").textbox("getValue")},
				//行的单击事件
				onClickRow:function(index,row){
					//取消所有选择行
					$("#padconfig_businesslogic_dg").datagrid("uncheckAll");
					//选中当前行
					$("#padconfig_businesslogic_dg").datagrid("checkRow",index);
				},
				onDblClickRow:function(index,row){
					//取消所有选中行
					$("#padconfig_businesslogic_dg").datagrid("uncheckAll");
					//选中当前行
					$("#padconfig_businesslogic_dg").datagrid("checkRow",index);
					
					//选中设置数据
					selectLogic();
				}
		});
		
		//打开窗口
		$("#padconfig_businesslogic_div").dialog({
			title:"选择业务逻辑",
			modal:true,
			onClose : function() {
				// 清空数据
				$("#businesslogicForm").form("reset");
			},
		}).dialog("open").dialog("center");
	}
}

/**
 * 数据类型选择按钮
 */
function selectDataAccess() {
	//得到要选择的节点
	var rows = $("#padconfig_dataaccess_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择具体的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	//设置访问数据编号输入框
	$("#accessNameId").textbox("setValue",rows[0].accessName);
	$("#accessCodeId").val(rows[0].accessCode);
	
	//关闭页面
	cancelselectDataAccess();
}

/**
 *业务逻辑选择按钮
 */
function selectLogic() {
	//得到要选择的节点
	var rows = $("#padconfig_businesslogic_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择具体的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	//设置访问数据编号输入框
	$("#accessNameId").textbox("setValue",rows[0].logicName);
	$("#accessCodeId").val(rows[0].logicCode);
	
	//关闭页面
	cancelSelectLogic();
}

/**
 * 数据类型选择取消按钮
 */
function cancelselectDataAccess() {
	//关闭对话框
	$("#padconfig_dataaccess_div").dialog("close");
	
	//清空数据
	$("#dataTypeKeyWord").textbox("setValue","");
}

/**
 * 业务逻辑选择取消按钮
 */
function cancelSelectLogic() {
	//关闭对话框
	$("#padconfig_businesslogic_div").dialog("close");
	
	//清空数据
	$("#logicKeyWord").textbox("setValue","");
}

/**
 * 给是否有效设置图标
 */
function setIsUsed(value,row,index){
	if(row.isUsed=="1"){
		return "<img src='../../../css/themes/icons/ok.png'/>";
	}else{
		return "—";
	}
}

/**
 * 格式化详情链接操作
 * @param value
 * @param row
 * @param index
 */
function detailFormmater(value, row, index){
	return "<a href='#1' onclick='detail("+index+")' style='color: blue;' >详情</a>  ";
}

/**
 * 选择数据类型查询按钮
 */
function searchDictType(){
	//给数据网格加载数据
	$("#padconfig_dataaccess_dg").datagrid("reload",{
		keyWord:$("#dataTypeKeyWord").textbox("getValue")
	});
}

/**
 * 选择业务逻辑查询按钮
 */
function queryBusinesslogic(){
	//给数据网格加载数据
	$("#padconfig_businesslogic_dg").datagrid("reload",{
		keyWord:$("#logicKeyWord").textbox("getValue")
	});
}

/**
 * 打开UI配置弹窗
 */
function configUI(){
	
	$("#padconfig_uiconfig_div").dialog({
		modal : true,
		title : "PAD表单UI配置"
	}).dialog("center");
	
	initWidget();
	
	if($("#uiConfigId").textbox("getValue") != null && $("#uiConfigId").textbox("getValue") != ''){
		//回显视图
		echoPreview();
	}
}

/**
 * 选择对应表名
 */
function addTable() {
	//给数据网格加载数据
	$("#padconfig_table_dg").datagrid({
		url: basePath + "/gmodule_dynamictables_metamanage_findpage.json",
		queryParams:{keyWord:$("#dataTypeKeyWord").textbox("getValue")},
			//行的单击事件
			onClickRow:function(index,row){
				//取消所有选择行
				$("#padconfig_table_dg").datagrid("uncheckAll");
				//选中当前行
				$("#padconfig_table_dg").datagrid("checkRow",index);
			},
			onDblClickRow:function(index,row){
				//取消所有选中行
				$("#padconfig_table_dg").datagrid("uncheckAll");
				//选中当前行
				$("#padconfig_table_dg").datagrid("checkRow",index);
				
				//选中设置数据
				selectTableName();
			}
	});
	
	//打开窗口
	$("#padconfig_table_div").dialog({
		title:"选择表数据",
		modal:true,
		onClose : function() {
			// 清空数据
			$("#table_form").form("reset");
		},
	}).dialog("open").dialog("center");
}

/**
 * 对应表名查询按钮
 */
function searchTableName() {
	//给数据网格加载数据
	$("#padconfig_table_dg").datagrid("reload",{
		keyWord:$("#tableNameKeyWord").textbox("getValue")
	});
}

/**
 * 对应表名选择按钮
 */
function selectTableName() {
	//得到要选择的节点
	var rows = $("#padconfig_table_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择具体的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	$("#tableNameId").textbox("setValue",rows[0].tableName);
	
	//关闭页面
	cancelselectTableName();
}

/**
 * 对应表名选择取消按钮
 */
function cancelselectTableName() {
	//关闭对话框
	$("#padconfig_table_div").dialog("close");
	
	//清空数据
	$("#tableNameKeyWord").textbox("setValue","");
}
