var infoTypeList;// 所属信息类型
var type;// 分类数据
var typeId;
var dictDesc;

/**
 * 功能：加载数据网格    l
 */
$(function() {
	// 加载数据网格
	loadDatagrid();
	// 加载项目信息页面
	$("#detaile").load("selectinfotype.html", null, function() {
		// 进行解析
		$.parser.parse(this);
	});
});

/**
 * 功能：查询所有所属信息类型数据信息      
 */
function selectAllInfoType() {
	$.ajax({
		url : basePath + "/gmodule_datadict_findall.json",
		type : "post",
		data:{typeCode:'INFO_TYPE'},
		dataType : "json",
		success : function(data) {
			infoTypeList = data.rows;
		},
		error : function() {
			// 失败则弹出信息
			$.messager.alert('错误', '服务器内部错误!', 'error');
		}
	});
	return infoTypeList;
}

/**
 * 功能：查询所有资源分类数据信息     l
 */
function selectType() {
	// 加载treegrid数据
	$.ajax({
		url : basePath + '/gmodule_resourcetype_findtypeall.json',
		type : 'post',
		async : false,
		dataType : 'json',
		success : function(data) {
			type = data.rows;
		},
		error : function() {
			// 失败则弹出信息
			$.messager.alert('错误', '服务器内部错误!', 'error');
		}
	});
	return type;
}

/**
 * 格式化所属信息类型数据列    l
 * 
 * @param value
 * @param row
 * @param index
 */
function dictDescFormatter(value, row, index) {
	for ( var i in infoTypeList) {
		if (infoTypeList[i].dictCode == value) {
			return infoTypeList[i].dictDesc;
		}
	}
}

/**
 * 功能：格式化有效否数据列     l
 * 
 * @param value
 * @param row
 * @param index
 */
function isUsedFormatter(value, row, index) {
	if (value == 1) {// 有效
		return "<img src='../../../css/themes/icons/ok.png'/>";
	} else  {// 无效
		return "—";
	}
}

/**
 * 功能：格式化是否默认分类显示      l
 * 
 * @param value
 * @param row
 * @param index
 */
function isDefaultFormatter(value, row, index) {
	if (value == 1) {// 默认分类
		return "是";
	} else if (value == 0) {// 无效
		return "否";
	}
}
/**
 * 是否显示无效分类
 */
function showNoUsed() {
	loadRoot();
}

/**
 * 刷新数据
 */
function doRefresh() {
	loadRoot();
}

/**
 * 加载根节点数据
 */
function loadRoot(){
	// 获取对应项目Id，显示在选择项目文本框中（隐藏状态）
	var dictCode = $("#searchresForm_dictCode").val();
	// 获取所有资源分类数据
	var data = selectType();
	// 声明一个空数组来接受筛选出来的数据
	var showdata = [];
	for ( var i in data) {
		// 如果其中一条项目的Id与选中数据的所属项目Id相同
		if (data[i].infoType == dictCode) {
			// 添加到数组中
			showdata.push(data[i]);
		}
	}
	// 获取"选择显示无效分类"框状态
	var isUsed = ($("#showNoUsedType").is(':checked'));
	if (!isUsed) {
		// 声明一个空数组来接受筛选出来的数据
		var isUsedData = [];
		for ( var i in showdata) {
			// 如果其中一条项目的Id与选中数据的所属项目Id相同
			if (showdata[i].isUsed == '1') {
				// 添加到数组中
				isUsedData.push(showdata[i]);
			}
		}
		showdata = isUsedData;
	}
	// 加载网格数据
	loadDatagrid();
	// 载入数据
	$("#typeTreeGrid").treegrid('loadData', showdata);
}
/**
 * 加载数据网格内容         l
 */
function loadDatagrid() {

	// 设置treegrid初始属性及方法
	$("#typeTreeGrid").treegrid(
			{
				idField : 'typeId',
				treeField : 'typeName',
				animate : true,
				striped : true,
				method : 'post',
				singleSelect : true,
				onBeforeLoad : selectAllInfoType,
				onBeforeExpand : onBeforeExpand,
				// 单击树形网格
				onClickCell : function(field, row) {
					// 如果点击分类名称单元格
					if (field == "typeName") {
						// 获取下级目录
						var children = $("#typeTreeGrid").treegrid(
								"getChildren", row.typeId);
						// 如果下级目录个数大于0
						if (row.childNum > 0 || children.length > 0) {
							// 切换节点的展开/折叠状态
							$(this).treegrid("toggle", row.typeId);
						}
					}
				},
				// 双击属性网格
				onDblClickCell : function(field, row) {
					// 如果点击的不是分类名称单元格
					if (field != "typeName") {
						// 打开修改对话框
						modifyType();
					}
				},
				// 右键点击的属性网格
				onContextMenu : function(e, row) {
					// 阻止元素发生默认的右键单击行为
					e.preventDefault();
					// 选择节点
					$(this).treegrid('select', row.typeId);
					// 在鼠标点击位置打开鼠标右键编辑对话框（新增下级、修改）
					$('#mm').menu('show', {
						left : e.pageX,
						top : e.pageY
					});
				}
			});
}

/**
 * 功能：节点展开之前的事件       l
 * 
 * @param row
 */
function onBeforeExpand(row) {
	// 判断是否需要加载子节点
	if (row.children == undefined || row.children == []) {
		// 获取本行数据id
		var typeId = row.typeId;
		// 获取本行子节点数据数组
		var childNodes = reloadChildrenType(row);
		// 追加一些子节点到一个父节点
		$('#typeTreeGrid').treegrid('append', {
			// 指定父节点的
			parent : typeId,
			// 指定子节点
			data : childNodes
		});
	}
}

/**
 * 功能：加载子节点数据          l
 * 
 * @param row
 * @returns
 */
function reloadChildrenType(row) {
	// 定义子节点数据
	var typeChildData = undefined;
	row.isUsed = $("#showNoUsedType").is(':checked') ? '1' : '0';
	$.ajax({
		type : 'post',
		async : false,
		data : row,
		url : basePath + '/gmodule_resourcetype_findtypedata.json',
		success : function(data) {
			// 成功则获取子节点数组
			typeChildData = data.rows;
		},
		error : function() {
			// 失败则弹出信息
			$.messager.alert('错误', '服务器内部错误!', 'error');
		}
	});
	// 返回子节点数组
	return typeChildData;
}

/**
 * 功能：打开新增第一级分类对话框        l
 */
function addRootType() {
	// 获取对应项目Id，显示在选择项目文本框中（隐藏状态）
	var dictCode = $("#searchresForm_dictCode").val();
	if (dictCode == '') {
		$.messager.alert("提示信息", "请选择资源大类！", "info");
	} else {
		// 验证分类名称非空
		$("#addRootTypeForm").find("[name='typeName']").textbox({
			required : true,
			missingMessage : "分类名称不能为空",
		});
		// 设置新增第一级分类对话框
		$("#addRootType")
				.dialog(
						{
							modal : true,
							// 设置对话框按钮
							buttons : [
									{// 设置保存按钮
										text : '保存',
										iconCls : 'icon-ok',
										// 数据处理
										handler : function() {
											var type = $("#addRootTypeForm")
													.serializeObject();
											type.infoType = $(
													"#searchresForm_dictCode")
													.val();
											type.isUsed = '1';
											//是否默认分类
											type.isDefault=$("#addRootTypeForm").find("[name='isDefault']").is(":checked") ? '1' : '0';
											//是否清除游离
											type.clearNotRel=$("#addRootTypeForm").find("[name='clearNotRel']").is(":checked") ? '1' : '0';
											// 定义分类名称的验证
											var isNameValid = false;
											// 获取输入的分类名称
											var value = $("#addRootTypeForm")
													.find("[name='typeName']")
													.val();
											if (value == null || value == "") {// 输入的分类名称若为空
												isNameValid = false;
											} else {// 输入的分类名称若不为空
												isNameValid = true;
											}
											// 输入的分类名称若不为空，时保存添加第一级分类
											if (isNameValid) {
												$
														.ajax({
															url : basePath
																	+ "/gmodule_resourcetype_add.json",
															method : "post",
															data : type,
															dataType : "json",
															success : function(
																	data) {
																var nodes = $(
																		"#typeTreeGrid")
																		.treegrid(
																				"getRoots");
																var node = nodes[nodes.length - 1];
																// alert(JSON.stringify(node));
																if (data.resultCode == 1) {// 如果添加成功
																	// $.messager.alert("提示信息","添加第一级级分类成功！","info");
																	// 关闭窗口
																	closeWindow("addRootType");
																	// 将新增数据插入到所有第一级目录后
																	if(node!=undefined){
																		$("#typeTreeGrid").treegrid("insert",{after : node.typeId,data : data.rows});	
																	}else{
																		loadRoot();
																	}
																	
																	// 刷新页面
																	// doRefresh();
																} else {// 如果添加失败
																	// 弹出提示信息
																	$.messager
																			.alert(
																					"提示信息",
																					"添加分类失败！",
																					"info");
																}
															},
															error : function() {
																$.messager
																		.alert(
																				'错误',
																				'服务器内部错误!',
																				'error');
															}
														});
											}
										}
									}, {// 设置取消按钮
										text : '关闭',
										iconCls : 'icon-cancel',
										handler : function() {
											// 关闭窗口
											closeWindow("addRootType");
										}
									} ],
							onClose : function() {
								$("#addRootTypeForm").form("reset");
							}
						});
		// 打开对话框,设置按钮在右边
		$(".dialog-button").css("text-align", "right");
		$("#addRootType").dialog('open');
		// 在指定的毫秒数后调用函数或计算表达式
		setTimeout(function() {
			// 获取新增第一级对话框“分类名称”焦点
			$("#addRootTypeForm_typeName").textbox("textbox").focus();
		}, 300);
	}
}

/**
 * 功能：打开新增下级分类对话框      l
 */
function addNextType() {
	// 获取选中的数据
	var typeIds = Common.getSelectedIds("#typeTreeGrid", "typeId", "typeIds");
	if (typeIds.length != 1) {// 如果没有选中项弹出提示信息
		$.messager.alert("提示信息", "请选择上级分类！", "info");
	} else {
		// 得到父级id
		var pTypeId = typeIds[0].value;
		// 在新增下一级对话框显示上级分类id
		$("#addNextTypeForm_pTypeId").html(pTypeId);
		// 验证分类名称非空
		$("#addNextTypeForm").find("[name='typeName']").textbox({
			required : true,
			missingMessage : "分类名称不能为空",
		});
		// 设置新增下一级对话框
		$("#addNextType")
				.dialog(
						{
							modal : true,
							// 设置对话框按钮
							buttons : [
									{// 设置保存按钮
										text : '保存',
										iconCls : 'icon-ok',
										// 数据处理
										handler : function() {
											var type = $("#addNextTypeForm")
													.serializeObject();
											type.pTypeId = pTypeId;
											type.infoType = $(
													"#searchresForm_dictCode")
													.val();
											type.isUsed = '1';
											type.isDefault=$("#addNextTypeForm").find("[name='isDefault']").is(":checked") ? '1' : '0';
											//是否清除游离
											type.clearNotRel=$("#addNextTypeForm").find("[name='clearNotRel']").is(":checked") ? '1' : '0';
											// 定义分类名称的验证
											var isNameValid = false;
											// 获取输入的分类名称
											var value = $("#addNextTypeForm")
													.find("[name='typeName']")
													.val();
											if (value == null || value == "") {// 输入的分类名称为空时
												isNameValid = false;
											} else {// 输入的分类名称不为空时
												isNameValid = true;
											}
											// 输入的分类名称不为空时，保存添加下级分类
											if (isNameValid) {
												$
														.ajax({
															url : basePath
																	+ "/gmodule_resourcetype_add.json",
															type : "post",
															data : type,
															dataType : "json",
															success : function(
																	data) {
																if (data.resultCode == 1) {// 如果添加成功
																	// $.messager.alert("提示信息","添加下级菜单成功！","info");
																	closeWindow("addNextType");
																	var node = $("#typeTreeGrid").treegrid("getSelected");
																	$("#typeTreeGrid").treegrid("append",{
																						parent : node.typeId,
																						data : [data.rows]
																					});
																} else {// 如果添加失败
																	// 弹出提示信息
																	$.messager
																			.alert(
																					"提示信息",
																					"添加分类失败！",
																					"info");
																}
															},
															error : function() {
																$.messager
																		.alert(
																				'错误',
																				'服务器内部错误!',
																				'error');
															}
														});
											}
										}
									}, {// 设置取消按钮
										text : '关闭',
										iconCls : 'icon-cancel',
										handler : function() {
											// 关闭窗口
											closeWindow("addNextType");
										}
									} ],
							onClose : function() {
								$("#addNextTypeForm").form("reset");
							}
						});
		// 打开对话框
		$(".dialog-button").css("text-align", "right");
		$("#addNextType").dialog('open');
		// 在指定的毫秒数后调用函数或计算表达式
		setTimeout(function() {
			// 获取新增下一级对话框“分类名称”焦点
			$("#addNextTypeForm_typeName").textbox("textbox").focus();
		}, 300);
	}
}

/**
 * 功能：打开修改对话框    l
 */
function modifyType() {
	// 判断是否选择
	var typeIds = Common.getSelectedIds("#typeTreeGrid", "typeId", "typeIds");
	if (typeIds.length != 1) {
		$.messager.alert("提示信息", "请选择您要修改的数据！", "info");
	} else {
		var typeId = typeIds[0].value;
		// 数据回显
		$.ajax({
			url : basePath + "/gmodule_resourcetype_findbyid.json",
			type : "post",
			data : {
				typeId : typeId
			},
			dataType : "json",
			success : function(data) {
				// 获取选中的数据
				var type = data.type;
				// 获取所有的项目
				var infoTypes = selectAllInfoType();
				// 遍历所有项目
				for ( var i in infoTypes) {
					// 如果其中一条项目的Id与选中数据的所属项目Id相同
					if (infoTypes[i].dictCode == type.infoType) {
						// 项目名称
						dictDesc = infoTypes[i].dictDesc;
					}
				}
				// 将数据显示在修改框中
				$("#modifyTypeForm #typeId").html(type.typeId);
				$("#modifyTypeForm_typeName")
						.textbox("setValue", type.typeName);
				$("#modifyTypeForm #pTypeId").attr("value", type.pTypeId);
				$("#modifyTypeForm_dictDesc").textbox("setValue",dictDesc);
				$("#modifyTypeForm #sortNo").textbox("setValue", type.sortNo);
				$("#modifyTypeForm #isUsed").attr("checked", type.isUsed == '1' ? true : false);
				$("#modifyTypeForm #modifyIsDefault").attr("checked", type.isDefault == '1' ? true : false);
				$("#modifyTypeForm #modifyclearNotRel").attr("checked", type.clearNotRel == '1' ? true : false);
			}
		});
		// 验证分类名称非空
		$("#modifyTypeForm").find("[name='typeName']").textbox({
			required : true,
			missingMessage : "分类名称不能为空",
		});
		// 设置修改对话框
		$("#modifyType")
				.dialog(
						{
							modal : true,
							// 设置对话框按钮
							buttons : [
									{// 设置保存按钮
										text : '保存',
										iconCls : 'icon-ok',
										handler : function() {
											var type = $("#modifyTypeForm")
													.serializeObject();
											type.typeId = typeId;
											type.infoType  = $(
													"#searchresForm_dictCode")
													.val();
											type.isUsed = $("#modifyTypeForm")
													.find("[name='isUsed']")
													.is(":checked") ? '1' : '0';
											type.isDefault=$("#modifyTypeForm").find("[name='isDefault']").is(":checked") ? '1' : '0';
											type.clearNotRel=$("#modifyTypeForm").find("[name='clearNotRel']").is(":checked") ? '1' : '0';
											
											// 保存修改
											$("#modifyTypeForm").form(
													"validate");
											// 定义分类名称的验证
											var isNameValid = false;
											// 获取文本框中的分类名称
											var value = $("#modifyTypeForm")
													.find("[name='typeName']")
													.val();
											if (value == null || value == "") {// 如果输入的分类名称为空
												isNameValid = false;
											} else {// 如果输入的分类名称不为空
												isNameValid = true;
											}
											// 输入的分类名称不为空时，保存数据
											if (isNameValid) {
												$
														.ajax({
															url : basePath
																	+ "/gmodule_resourcetype_modify.json",
															type : "post",
															data : type,
															dataType : "json",
															success : function(
																	data) {
																if (data.resultCode == 1) {// 如果修改成功
																	// $.messager.alert("提示信息","菜单修改成功！","info");
																	closeWindow("modifyType");
																	// loadDatagrid();
																	$(
																			"#typeTreeGrid")
																			.treegrid(
																					"update",
																					{
																						id : type.typeId,
																						row : type
																					});
																} else {// 如果修改失败
																	// 弹出提示信息
																	$.messager
																			.alert(
																					"提示信息",
																					"分类修改失败！",
																					"info");
																}
															},
															error : function() {
																$.messager
																		.alert(
																				'错误',
																				'服务器内部错误!',
																				'error');
															}
														});
											}
										}
									}, {// 设置取消按钮
										text : '关闭',
										iconCls : 'icon-cancel',
										handler : function() {
											// 关闭窗口
											closeWindow("modifyType");
										}
									} ],
							onClose : function() {
								$("#modifyTypeForm").form("reset");
							}
						});

		// 打开对话框
		$(".dialog-button").css("text-align", "right");
		$("#modifyType").dialog('open');
		// 在指定的毫秒数后调用函数或计算表达式
		setTimeout(function() {
			// 获取修改对话框“分类名称”焦点
			$("#modifyTypeForm_typeName").textbox("textbox").focus();
		}, 300);
	}
}

/**
 * 选择所属项目对话框确认按钮     l
 */
function selectInfoType() {
	if ($("#dictTable").datagrid("getSelected") == null) {
		$.messager.alert("错误信息", "请选择具体资源大类", "error");
		return;
	}
	// 获取选中行数据
	var row = $('#dictTable').datagrid('getSelected');
	// 将选择的项目Id显示在选择项目文本框中（隐藏状态）
	$("#searchresForm_dictCode").attr("value", row.dictCode);
	// 获取所有资源分类数据
	var data = selectType();
	// 声明一个空数组来接受筛选出来的数据
	var showdata = [];
	for ( var i in data) {
		// 如果其中一条项目的Id与选中数据的所属项目Id相同
		if (data[i].infoType == row.dictCode) {
			// 添加到数组中
			showdata.push(data[i]);
		}
	}
	// 获取"选择显示无效分类"框状态
	var isUsed = ($("#showNoUsedType").is(':checked'));
	if (!isUsed) {
		// 声明一个空数组来接受筛选出来的数据
		var isUsedData = [];
		for ( var i in showdata) {
			// 如果其中一条项目的Id与选中数据的所属项目Id相同
			if (showdata[i].isUsed == '1') {
				// 添加到数组中
				isUsedData.push(showdata[i]);
			}
		}
		showdata = isUsedData;
	}
	// 将选择的项目名称显示在选择项目文本框中
	$("#searchresForm_dictDesc").textbox("setValue", row.dictDesc);
	$(".tree-tile").css("font-size",'13px');
	// 关闭选择所属项目对话框
	$("#detaile").dialog('close');
	$("#infotype_Div").dialog("close");
	// 加载数据网格
	loadDatagrid();
//	// 载入数据
	$("#typeTreeGrid").treegrid('loadData', showdata);
}

/**
 * 选择所属项目对话框取消按钮        l
 */
function doCancel() {
	$("#infotype_Div").dialog("close");
}

/**
 * 功能：根据DOM文档的ID关闭窗口      l
 * 
 * @param ID
 */
function closeWindow(ID) {
	// 关闭对话框
	$("#" + ID + "").dialog('close');
	// 清空表单数据
	$("#" + ID + "Form").form('reset');
}

/**
 * 退出按钮操作          l
 */
function outChiose() {
	// 找到父页面dom节点关闭
	$("#detaile").dialog('close');
}

//===================================================
//===================================================
/**
 * 弹出项目信息数据
 * 选择项目后，查询出该项目下的任务    l
 */
function selectPro(){
	showPro(function(data){
		//给项目输入框设置值
		$("#searchresForm_dictDesc").textbox("setValue",data.dictDesc);
		$("#searchresForm_dictCode").val(data.dictCode);	
		//加载该项目下的任务数据
		loadDatagrid();
	});
}
//   l
function showPro(callbackfun){ 
	
	//将回调函数赋给全局变量
	callback=callbackfun;
	//获取加载的参数
	var params={typeCode:'INFO_TYPE',keyWord:$("#keyWord").val()};
	//给数据网格加载数据
	$("#dictTable").datagrid({
		method:"post",
		url:basePath+"/gmodule_datadict_findpage.json",
		queryParams:params,
		onDblClickRow:function(index,row){
			selectInfoType();
		}
	});
	//打开窗口
	$("#infotype_Div").show().dialog({
		title:"选择资源大类",
		modal:true,
		buttons : '#select_btns',
		resizable : true,
	});
		
} 
/**
 * 查询所属信息类型
 */
function queryInfoType(){
	$("#dictTable").datagrid("reload",{typeCode:'INFO_TYPE',keyWord:$("#keyWord").val()});
}


/**
*选择数据退出框    l
*/
function cancelselectInfoType(){
	//关闭对话框
	$("#infotype_Div").dialog("close");
}

/**
*设置是否有效初始值       l
*/
function setUsed(value,row,index){
	if(value==1){
		return "<img src='../../../css/themes/icons/ok.png'/>";
	}else{
		return "—";
	}
}
