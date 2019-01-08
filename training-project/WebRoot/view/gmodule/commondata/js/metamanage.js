var url;//请求url
var isNew;//新增、修改标志
var columnIsNew;//字段新增、修改标志
var enumIsNew;//枚举信息新增、修改标志
var arrColumn = [];//字段数组
var arrEnum = [];//枚举信息数组
var columnSortNo;//新增字段时顺序号基数

/**
 * 初始化页面，加载数据
 */
$(function(){
	/**
	 * 自定义验证方法，和validBox一起使用
	 */
	$.extend($.fn.textbox.defaults.rules, {
	    validArry: {
			validator: function(value,param){
				var vlidArr = param[0][0].split(",");
				// 默认通过验证
				var resultCode=1;
				if (param[1] == "") {// 新增验证
					for (var i = 0; i < vlidArr.length; i++) {
						if (vlidArr[i] == value) {
							resultCode = 0;
							return;
						}
					}
				}else{// 修改验证
					if (param[1] == value) {
						resultCode=1;
					}else {
						for (var i = 0; i < vlidArr.length; i++) {
							if (vlidArr[i] == value) {
								resultCode = 0;
								return;
							}
						}
					}
				}
				
				if(resultCode == 1)
					//通过验证
					return true;
				else 
					//未通过验证
					return false;
			},
			message: '请输入合法的内容'
	    },
	});
	
	//初始化新增修改页面combobox数据
	$("#tbtype").combobox({
	    url:basePath+'/gmodule_datadict_findall.json',
	    valueField:'dictCode',
	    textField:'dictDesc',
	    queryParams:{typeCode:'GMODULE_TABLE_TYPE'},
		loadFilter: function(data){	
			data.rows.unshift({
				dictCode : "",
				dictDesc : "全部"
			});
			return data.rows;
		}
	});
	
	//加载新增、修改页面
	$("#dialog_add_modify").load("metamanage_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//加载详情页面
	$("#dialog_detail").load("metamanage_detail.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//加载字段新增、修改页面
	$("#dialog_column_add_modifycolumn").load("metamanage_column_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
		$("#optionsSourceId").combobox({
			onSelect:function(record){
				if(record.dictCode=="0"){
					$("#dictTypeTr").css("display","block");
					$("#columnEnumTr").css("display","none");
				}else if(record.dictCode=="1"){
					$("#dictTypeTr").css("display","none");
					$("#columnEnumTr").css("display","block");
				}
			}
		});
		$("#columnInputTypeId").combobox({
			onSelect:function(record){
				if(record.dictCode=="4.001"){
					$("#optionsSourceId").css("background","#ccc");
					$("#optionsSourceId").combobox("disable");
					$("#columnEnumTr").css("display","none");
					$("#dictTypeTr").css("display","none");
				}else if(record.dictCode=="4.002"){
					$("#optionsSourceId").css("background","#000");
					$("#optionsSourceId").combobox("enable");
					$("#columnEnumTr").css("display","none");
					$("#dictTypeTr").css("display","block");
				}
			}
		});
	});

	//加载代码类型选择页面
	$("#dialog_metamanage_dicttype").load("metamanage_dicttype.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//加载字段详情页面
	$("#dialog_column_detail").load("metamanage_column_detail.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//加载新增、修改枚举信息页面
	$("#dialog_column_enum_add_modify").load("metamanage_column_enum_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//数据网格加载数据
	$("#metamanage_dg").datagrid( Common.createDatagridOptionsExt(basePath, "/gmodule_commondata_metamanage_findpage.json",135));
	
	//给数据网格设置属性
	$("#metamanage_dg").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有其他选中行
			$("#metamanage_dg").datagrid("uncheckAll");
			//选中当前行
			$("#metamanage_dg").datagrid("checkRow",index);
		},
		//行的单击事件
		onDblClickRow:function(index,row){
			//取消其他所有选中行
			$("#metamanage_dg").datagrid("uncheckAll");
			//选中当前行
			$("#metamanage_dg").datagrid("checkRow",index);
			modifyMetamanage();
		}
	});
});


//metaTable表数据维护------------------------------------------------------

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
 * 格式化详情数据列
 */
function detailFormatter(value,row,index){
	return "<a href='#1' onclick='detaiInfo(this)' style='color: blue;' >详情</a>";
}

/**
 * 主页查询数据
 */
function queryMetamanage(){
	$("#metamanage_dg").datagrid("reload",{keyWord:$("#keyWord").textbox("getValue"),tableType:$("#tbtype").combobox("getValue")});
}

/**
 * 主页新增按钮
 */
function addMetamanage(){
	//新增表数据时，设置新增字段顺序号基数
	columnSortNo=1;
	//新增标志
	isNew=true;
	//设置新增url
	url=basePath+"/gmodule_commondata_metamanage_add.json";
	
	//启用表名输入框
	$("#tableNameId").textbox("enable");
	//隐藏是否有效一行
	$("#isUsedRow").hide();
	// 清空字段数组
	arrColumn = [];
	// 更新字段表中数据
	loadColumn(arrColumn);
	// 加载分类选项
	tableTypeFormatter();
	
	// 打开新增对话框
	$("#metamanage_add_modify_div").dialog({
		modal : true,
		title : "新增元数据信息",
		height : 450,
		onClose : function() {
			// 清空数据
			$("#metamanage_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//在表描述失去焦点是，如果实体描述为空，就默认设置为表描述的值
	$("#tableDescId").next("span").children().first().blur(function(){  
		var tableDesc = $("#tableDescId").textbox("getValue");
	    var entityDesc = $("#entityDescId").textbox("getValue");
	    if (entityDesc == "") {
	    	  $("#entityDescId").textbox("setValue",tableDesc);
		}
	});
	
	// 验证
	validateMetamanage("Add");
	
	//获取焦点
	$("#tableNameId").textbox().next("span").find("input").focus();
}



/**
 * 主页修改按钮
 */

function modifyMetamanage(){
	//修改标志
	isNew=false;
	//设置修改url
	url=basePath+"/gmodule_commondata_metamanage_modify.json";
	
	//得到要修改的节点
	var rows = $("#metamanage_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	// 获取需要修改的这条数据
	$.ajax({
		url: basePath + "/gmodule_commondata_metamanage_findByTableName.json",
		type: 'post',
		data: rows[0],  
		dataType:"json",
		success: function(data) {
			var metamanage = data.row;
			// 数据回显
			$("#metamanage_add_modify_form").form("load",metamanage);
		}
	});
	
	//禁用表名输入框
	$("#tableNameId").textbox("disable");
	//显示是否有效一行
	$("#isUsedRow").show();
	// 清空字段数组
	arrColumn = [];
	// 加载分类选项
	tableTypeFormatter();
	
	// 获取需要修改的这条数据对应的字段信息
	$.ajax({
		url: basePath + "/gmodule_commondata_metamanage_findColumnByTableName.json",
		type: 'post',
		data: rows[0],  
		dataType:"json",
		success: function(data) {
			if (data.row == null || data.row.length == 0) {// 如果当前表没有对应的字段数据
				//修改表数据时，设置新增字段顺序号基数
				columnSortNo = 1;
			} else {// 如果当前表有对应的字段数据
				// 遍历得到的数组中的元素
				for(var i in data.row){
					// 添加到字段数组中
					arrColumn.push(data.row[i]);
					//修改表数据时，设置新增字段顺序号基数
					columnSortNo = parseInt(data.row[i].sortNo)+1;
				}
			}
			// 更新字段表中数据
			loadColumn(arrColumn);
		}
	});
	
	// 打开修改对话框
	$("#metamanage_add_modify_div").dialog({
		modal : true,
		title : "修改元数据信息",
		height : 450,
		onClose : function() {
			// 清空数据
			$("#metamanage_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//在表描述失去焦点是，如果实体描述为空，就默认设置为表描述的值
	$("#tableDescId").next("span").children().first().blur(function(){  
		var tableDesc = $("#tableDescId").textbox("getValue");
	    var entityDesc = $("#entityDescId").textbox("getValue");
	    if (entityDesc == "") {
	    	  $("#entityDescId").textbox("setValue",tableDesc);
		}
	});
	
	// 验证
	validateMetamanage("Modify",rows[0]);
	
	//获取焦点
	$("#tableDescId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改保存
 */
function doSave(){
	// 序列化表单
	var metTableBo = $("#metamanage_add_modify_form").serializeObject();
	// 获取表名
	metTableBo.tableName = $("#tableNameId").textbox("getValue");
	// 把字段数组数据放到提交的metTableBo数据中
	for(var i in arrColumn){
		metTableBo["metaColumnList["+i+"].tableName"]=metTableBo.tableName;
		metTableBo["metaColumnList["+i+"].columnName"]=arrColumn[i].columnName;
		metTableBo["metaColumnList["+i+"].columnDesc"]=arrColumn[i].columnDesc;
		metTableBo["metaColumnList["+i+"].attributeName"]=arrColumn[i].attributeName;
		metTableBo["metaColumnList["+i+"].attributeDesc"]=arrColumn[i].attributeDesc;
		metTableBo["metaColumnList["+i+"].columnType"]=arrColumn[i].columnType;
		metTableBo["metaColumnList["+i+"].columnLength"]=arrColumn[i].columnLength;
		metTableBo["metaColumnList["+i+"].columnInputType"]=arrColumn[i].columnInputType;
		metTableBo["metaColumnList["+i+"].dictType"]=arrColumn[i].dictType;
		metTableBo["metaColumnList["+i+"].optionsSource"]=arrColumn[i].optionsSource;
		metTableBo["metaColumnList["+i+"].columnEnum"]=arrColumn[i].columnEnum;
		metTableBo["metaColumnList["+i+"].columnValidateType"]=arrColumn[i].columnValidateType;
		metTableBo["metaColumnList["+i+"].columnValidateRegex"]=arrColumn[i].columnValidateRegex;
		metTableBo["metaColumnList["+i+"].valueRange"]=arrColumn[i].valueRange;
		metTableBo["metaColumnList["+i+"].isPrimaryKey"]=arrColumn[i].isPrimaryKey;
		metTableBo["metaColumnList["+i+"].notNull"]=arrColumn[i].notNull;
		metTableBo["metaColumnList["+i+"].isUsed"]=arrColumn[i].isUsed;
		metTableBo["metaColumnList["+i+"].sortNo"]=arrColumn[i].sortNo;
	}
	// 保存提交数据
	if($("#metamanage_add_modify_form").form("validate")){
		$.ajax({
			url: url,
			type: 'post',
			data: metTableBo,  
			dataType:"json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$('#metamanage_dg').datagrid('reload');
					//关闭对话框
					$("#metamanage_add_modify_div").dialog("close");
					//清空数据
					$("#metamanage_add_modify_form").form("reset");
				} else if (data.resultCode == "0") {
					$.messager.alert("提示信息", "操作失败了，请联系管理员1", "error");
				} else {
					$.messager.alert("提示信息", "操作失败，请联系管理员2", "error");
				}
			},
			error : function() {
				$.messager.alert('错误', '服务器内部错误!', 'error');
			}
		});
	}
}

/**
 * 新增、修改取消
 */
function doCancel(){
	//关闭对话框
	$("#metamanage_add_modify_div").dialog("close");
	
	//清空数据
	$("#metamanage_add_modify_form").form("reset");
}

/**
 * 主页删除按钮
 */
function removeMetamanage(){
	// 得到要删除的行节点
	var tableNames = Common.getSelectedIds("#metamanage_dg", "tableName", "batchTableName");
	if (tableNames == null || tableNames.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			$.ajax({
				url : basePath + "/gmodule_commondata_metamanage_remove.json",
				type : "post",
				data : tableNames,
				success : function(data) {
					// 更新表格中的数据
					if (data.resultCode == "1") {
						// 更新页面数据
						$('#metamanage_dg').datagrid('reload');
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
 * 格式化表分类下拉选项
 */
function tableTypeFormatter() {
	$.ajax({
		url : basePath + "/gmodule_datadict_findall.json",
		type : 'post',
		async:false,
		data : {
			"typeCode" : "GMODULE_TABLE_TYPE"
		},
		dataType : "json",
		success : function(data) {
			// 获取数据字典中的字段类型的数据
			var tableType = data.rows;
			// 把数据加载到下拉列表中，加载combox数据
			$("#tableTypeId").combobox("loadData", tableType);
		}
	});
}

/**
 * 点击主页详情
 */
function detaiInfo(dom){
	//详情查询条件
	var tableName =$(dom).parents("tr").find("[field='tableName']").text();
	// 打开详情页面

	$("#meta_detail").dialog({
		width : 680,
		title : "元数据详情",
		onOpen : function() {
			//加载对应数据
			$.ajax({
				type: 'post',
				url:  basePath + "/gmodule_commondata_metamanage_findByTableName.json",
				data: {'tableName': tableName},
				success: function(data){
					// 加载数据
					loadDetail("meta_detail",data.row);
				}
			});
			// 清空字段数组
			arrColumn=[];
			//加载对应字段数据表
			$.ajax({
				type: 'post',
				async:false,
				url:  basePath + "/gmodule_commondata_metamanage_findColumnByTableName.json",
				data: {'tableName': tableName},
				success: function(data){
					var column = data.row;
					for (var i = 0; i < column.length; i++) {
						arrColumn.push(column[i]);
					}
					// 加载字段数据
					//给字段数据网格设置属性
					$("#detail_column_dg").datagrid({
						//行的单击事件
						onClickRow:function(index,row){
							//取消所有其他选中行
							$("#detail_column_dg").datagrid("uncheckAll");
							//选中当前行
							$("#detail_column_dg").datagrid("checkRow",index);
						},
						//行的双击事件
						onDblClickRow:function(index,row){
							//取消其他所有选中行
							$("#detail_column_dg").datagrid("uncheckAll");
							//选中当前行
							$("#detail_column_dg").datagrid("checkRow",index);
							//查看详情
							columnDetailInfo();
						}
					});
					$("#detail_column_dg").datagrid("loadData",arrColumn);
				}
			});
		},
	}).dialog("center");
	
}

/**
 * 字段详情
 */
function columnDetailInfo(trIndex){
	// 打开字段详情页面
	$("#meta_column_detail").dialog({
		width : 680,
		modal : true,
		title : "字段数据详情",
		onOpen : function() {
			// 加载数据
			loadDetail("meta_column_detail",arrColumn[trIndex]);
		},
	}).dialog("center");
}

/**
 * 加载详情页面数据
 */
function loadDetail(dialogId,data){
	var $allSpan=$("#"+dialogId+" span");
	for ( var i=0;i<$allSpan.length;i++) {
		var name=$allSpan.eq(i).attr("name");
		for(var j in data){
			if(name==j){
				if (j=="isUsed") {
					$allSpan.eq(i).html(data[j]=="1"?"有效":"无效");
				}else if (j=="columnLength") {
					$allSpan.eq(i).html(data[j]=="0"?"0":data[j]);
				}else if (j=="tableDesc" || j=="entityDesc") {
					$allSpan.eq(i).html(data[j]==null?"—":data[j].replace(/\r\n/g,"<br/>"));
				}else if (j=="isPrimaryKey"){
					$allSpan.eq(i).html(data[j]=="1"?"是":"否");
				}else if (j=="notNull") {
					$allSpan.eq(i).html(data[j]=="1"?"是":"否");
				}else if (j=="optionsSource") {
					if (data[j]=="0") {
						$allSpan.eq(i).html("默认");
					}else if(data[j]=="1"){
						$allSpan.eq(i).html("数据字典");
					}else if(data[j]=="2"){
						$allSpan.eq(i).html("枚举信息");
					}
				}else if (j=="columnEnum") {
					$allSpan.eq(i).html(data[j]==null?"—":data[j].replace(/,/g,"<br/>"));
				}else{
					$allSpan.eq(i).html(data[j]==null?"—":data[j]);
				}
			}
		}
	}
}

/**
 * 选择代码类型
 */
function addDictTypeInfo() {
	showSelectDictType(function callbackfun(data){
		//给代码类型设置值
		$("#dictTypeDescId").textbox("setValue",data.typeDesc);
		$("#dictTypeId").val(data.typeCode);
	});
}

/**
 * 验证表名和实体名，不能为空也不能重复
 */
function validateMetamanage(formId,row) {
	if(formId == "Add"){// 新增验证
		$("#tableNameId").textbox({
			required:true,
			missingMessage:"表名不能为空",
			invalidMessage:"表名已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_commondata_metamanage_validatetablename.json','tableName']"
		});
//		$("#entityNameId").textbox({
//			required:true,
//			missingMessage:"实体名不能为空",
//			invalidMessage:"实体名已经存在",
//			validType:"remoteValid['"+basePath+"/gmodule_commondata_metamanage_validateentityname.json','entityName']"
//		});
		$("#tableTypeId").combobox({
			required:true,
			missingMessage:"类型不能为空",
		});
	}else if(formId == "Modify"){// 修改验证
//		$("#tableNameId").textbox({
//			required:true,
//			missingMessage:"表名不能为空",
//			invalidMessage:"表名已经存在",
//			validType:"remoteValid['"+basePath+"/gmodule_commondata_metamanage_validatetablename.json','tableName',{selfTableName:'"+row.tableName+"'}]"
//		});
//		$("#entityNameId").textbox({
//			required:true,
//			missingMessage:"实体名不能为空",
//			invalidMessage:"实体名已经存在",
//			validType:"remoteValid['"+basePath+"/gmodule_commondata_metamanage_validateentityname.json','entityName',{selfEntityName:'"+row.entityName+"'}]"
//		});
	}
}

//metaColumn字段数据维护------------------------------------------------------

/**
 * 格式化字段详情数据列
 */
function columnDetailFormatter(value,row,index){
	return "<a href='#1' onclick='columnDetailInfo("+index+")' style='color: blue;' >详情</a>";
}

/**
 * 格式化字段类型下拉选项
 */
function columnTypeFormatter() {
	$.ajax({
		url : basePath + "/gmodule_datadict_findall.json",
		type : 'post',
		async:false,
		data : {
			"typeCode" : "COLUMN_TYPE"
		},
		dataType : "json",
		success : function(data) {
			// 获取数据字典中的字段类型的数据
			var columnType = data.rows;
			// 把数据加载到下拉列表中，加载combox数据
			$("#columnTypeId").combobox("loadData", columnType);
		}
	});
}

/**
 * 格式化输入类型下拉选项
 */
function columnInputTypeFormatter() {
	$.ajax({
		url : basePath + "/gmodule_datadict_findall.json",
		type : 'post',
		async:false,
		data : {
			"typeCode" : "FORM_INPUT_TYPE"
		},
		dataType : "json",
		success : function(data) {
			// 获取数据字典中的输入类型的数据
			var columnInputType = data.rows;
			// 把数据加载到下拉列表中，加载combox数据
			$("#columnInputTypeId").combobox("loadData", columnInputType);
		}
	});
}

/**
 * 格式化验证类型下拉选项
 */
function columnValidateTypeFormatter() {
	$.ajax({
		url : basePath + "/gmodule_datadict_findall.json",
		type : 'post',
		async:false,
		data : {
			"typeCode" : "VALIDATE_TYPE"
		},
		dataType : "json",
		success : function(data) {
			// 获取数据字典中的输入类型的数据
			var columnValidateType = data.rows;
			// 把数据加载到下拉列表中，加载combox数据
			$("#columnValidateTypeId").combobox("loadData", columnValidateType);
		}
	});
}

// 加载字段数据表
function loadColumn(arrColumn) {
	//给字段数据网格设置属性
	$("#column_dg").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有其他选中行
			$("#column_dg").datagrid("uncheckAll");
			//选中当前行
			$("#column_dg").datagrid("checkRow",index);
		},
		//行的双击事件
		onDblClickRow:function(index,row){
			//取消其他所有选中行
			$("#column_dg").datagrid("uncheckAll");
			//选中当前行
			$("#column_dg").datagrid("checkRow",index);
			//修改
			modifyColumn();
		}
	});
	
	// 加载字段数据
	$("#column_dg").datagrid("loadData",arrColumn);
}


/**
 * 新增字段信息
 */
function addColumn() {
	//新增标志
	columnIsNew=true;
	//清空枚举信息数组
	arrEnum=[];
	//加载枚举数据
	loadEnum(arrEnum);
	//启用字段名输入框
	$("#columnNameId").textbox("enable");
	//隐藏是否有效一行
	$("#columnIsUsedRow").hide();
	// 加载字段类型下拉选项
	columnTypeFormatter();
	// 加载输入类型下拉选项
	columnInputTypeFormatter();
	// 加载验证类型下拉选项
	columnValidateTypeFormatter();
	// 打开新增对话框
	$("#meta_column_add_modify_div").dialog({
		modal : true,
		width : 760,
		title : "新增字段信息",
		onClose : function() {
			// 清空数据
			$("#meta_column_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//在表描述失去焦点是，如果实体描述为空，就默认设置为表描述的值
	$("#columnDescId").next("span").children().first().blur(function(){  
		var columnDesc = $("#columnDescId").textbox("getValue");
	    var attributeDesc = $("#attributeDescId").textbox("getValue");
	    if (attributeDesc == "") {
	    	  $("#attributeDescId").textbox("setValue",columnDesc);
		}
	});
	
	// 验证
	validateMetaColumn("AddColumn");
	
	//获取焦点
	$("#columnNameId").textbox().next("span").find("input").focus();
}

/**
 * 修改字段信息
 */
function modifyColumn() {
	//新增字段标志
	columnIsNew=false;
	
	//得到要修改的节点
	var rows = $("#column_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	//清空枚举信息数组
	arrEnum=[];
	
	// 加载字段类型下拉选项
	columnTypeFormatter();
	// 加载输入类型下拉选项
	columnInputTypeFormatter();
	// 加载验证类型下拉选项
	columnValidateTypeFormatter();
	
	var column = rows[0];
	// 设置枚举信息数组
	if (column.columnEnum != null) {
		var arr1 = column.columnEnum.split(",");
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				var arr2 = arr1[i].split("-");
				var columnEnum={};
				columnEnum.enumOption = arr2[0];
				columnEnum.enumValue = arr2[1];
				arrEnum.push(columnEnum);
			}
		}
	}
//	// 设置字段类型下拉选项
//	column.columnTypeDesc=column.columnType==""?"----请选择----":column.columnTypeDesc;
//	// 设置输入类型下拉选项
//	column.columnInputTypeDesc=column.columnInputType==""?"----请选择----":column.columnInputTypeDesc;
//	// 设置验证类型下拉选项
//	column.columnValidateTypeDesc=column.columnValidateType==""?"----请选择----":column.columnValidateTypeDesc;
	// 枚举信息选项框
	loadEnum(arrEnum);
	//禁用字段名输入框
	$("#columnNameId").textbox("disable");
	//隐藏是否有效一行
	$("#columnIsUsedRow").show();
	
	// 打开修改对话框
	$("#meta_column_add_modify_div").dialog({
		modal : true,
		title : "修改字段信息",
		onClose : function() {
			// 清空数据
			$("#meta_column_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//在表描述失去焦点是，如果实体描述为空，就默认设置为表描述的值
	$("#columnDescId").next("span").children().first().blur(function(){  
		var columnDesc = $("#columnDescId").textbox("getValue");
	    var attributeDesc = $("#attributeDescId").textbox("getValue");
	    if (attributeDesc == "") {
	    	  $("#attributeDescId").textbox("setValue",columnDesc);
		}
	});
	
	// 验证
	validateMetaColumn("ModifyColumn",rows[0]);
	// 数据回显
	$("#meta_column_add_modify_form").form("load",column);
	//根据选项来源显示和隐藏对应的数据
	var optionsSource = $("#optionsSourceId").combobox("getValue");
	if(optionsSource=="0"){
		$("#dictTypeTr").css("display","block");
		$("#columnEnumTr").css("display","none");
	}else if(optionsSource=="1"){
		$("#dictTypeTr").css("display","none");
		$("#columnEnumTr").css("display","block");
	}
	
	//获取焦点
	$("#columnDescId").textbox().next("span").find("input").focus();
}

/**
 * 保存新增、修改字段信息
 */
function columnSave() {
	if($("#meta_column_add_modify_form").form("validate")){
		// 得到要修改的原始数据
		var rows = $("#column_dg").datagrid("getSelected");
		// 得到要修改的行数据的索引
		var j = $("#column_dg").datagrid("getRowIndex",rows);
		
		// 序列化表单
		var metaColumnBo = $("#meta_column_add_modify_form").serializeObject();
		// 设置对应表名
		metaColumnBo.tableName = $("#tableNameId").textbox("getValue");
		// 设置对应字段名
		metaColumnBo.columnName = $("#columnNameId").textbox("getValue");
		// 设置对应字段类型
		metaColumnBo.columnType = $("#columnTypeId").combobox('getText')==""?"":$("#columnTypeId").combobox('getValue');
		// 设置对应字段类型描述
		metaColumnBo.columnTypeDesc = $("#columnTypeId").combobox('getText')==""?"":$("#columnTypeId").combobox('getText');
		// 设置对应输入类型
		metaColumnBo.columnInputType = $("#columnInputTypeId").combobox('getText')==""?"":$("#columnInputTypeId").combobox('getValue');
		// 设置对应输入类型描述
		metaColumnBo.columnInputTypeDesc = $("#columnInputTypeId").combobox('getText')==""?"":$("#columnInputTypeId").combobox('getText');
		// 设置对应验证类型
		metaColumnBo.columnValidateType = $("#columnValidateTypeId").combobox('getText')==""?"":$("#columnValidateTypeId").combobox('getValue');
		// 设置对应验证类型描述
		metaColumnBo.columnValidateTypeDesc = $("#columnValidateTypeId").combobox('getText')==""?"":$("#columnValidateTypeId").combobox('getText');
		// 设置对应枚举信息
		var columnEnum="";
		for (var i = 0; i < arrEnum.length; i++) {
			columnEnum = columnEnum+","+arrEnum[i].enumOption+"-"+arrEnum[i].enumValue;
		}
		metaColumnBo.columnEnum = columnEnum;
		// 设置字段长度
		var columnLengthId = $("#columnLengthId").numberbox("getValue");
		metaColumnBo.columnLength = columnLengthId == "" ? "0" : columnLengthId;
		if (columnIsNew) {// 如果是新增
			// 默认有效
			metaColumnBo.isUsed = "1";
			// 设置顺序号和格式
			if(columnSortNo < 10){
				metaColumnBo.sortNo="00"+columnSortNo;
			}else if(10 <= columnSortNo < 100){
				metaColumnBo.sortNo="0"+columnSortNo;
			}else if(100 <= columnSortNo){
				metaColumnBo.sortNo=columnSortNo;
			}
			columnSortNo=columnSortNo+1;
			// 向字段数组中添加元素
			arrColumn.push(metaColumnBo);
		} else {// 如果是修改
			// 替换字段数组中的指定元素
			arrColumn[j] = metaColumnBo;
		}
		
		// 更新字段表中数据
		loadColumn(arrColumn);;
		
		//关闭对话框
		$("#meta_column_add_modify_div").dialog("close");
		//清空数据
		$("#meta_column_add_modify_form").form("reset");
	}
}


/**
 * 取消新增、修改字段信息
 */
function columnCancel() {
	//关闭对话框
	$("#meta_column_add_modify_div").dialog("close");
	
	//清空数据
	$("#meta_column_add_modify_form").form("reset");
}

/**
 * 删除字段信息
 */
function removeColumn() {
	// 得到要删除的行节点
	var columnBos = $("#column_dg").datagrid("getSelections");
	
	if (columnBos == null || columnBos.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			// 遍历选中数据数组
			for(var i in columnBos){
				// 同时遍历字段数组
				for ( var j in arrColumn) {
					// 满足条件，移除数组中被选中的元素
					if (columnBos[i].tableName == arrColumn[j].tableName && columnBos[i].columnName == arrColumn[j].columnName) {
						arrColumn.splice(j, 1);
					}
				}
			}
			// 更新字段表中数据
			loadColumn(arrColumn);;
		};
	});
}

/**
 * 验证字段名和对象名，不能为空也不能重复
 */
function validateMetaColumn(formId,data) {
	// 需要验证的字段数组
	var arrColumnName=formartterColumn("columnName");
//	var arrattributeName=formartterColumn("attributeName");
	if(formId == "AddColumn"){// 新增验证
		$("#columnNameId").textbox({
			required:true,
			missingMessage:"字段名不能为空",
			invalidMessage:"字段名已经存在",
			validType:"validArry[['"+arrColumnName+"']]"
		});
//		$("#attributeNameId").textbox({
//			required:true,
//			missingMessage:"对象名不能为空",
//			invalidMessage:"对象名已经存在",
//			validType:"validArry[['"+arrattributeName+"']]"
//		});
		$("#columnTypeId").combobox({
			required:true,
			missingMessage:"字段类型不能为空",
		});
		$("#columnLengthId").textbox({
			required:true,
			missingMessage:"字段长度不能为空",
		});
	}else if(formId == "ModifyColumn"){// 修改验证
//		$("#columnNameId").textbox({
//			required:true,
//			missingMessage:"字段名不能为空",
//			invalidMessage:"字段名已经存在",
//			validType:"validArry[['"+arrColumnName+"'],'"+data.columnName+"']"
//		});
//		$("#attributeNameId").textbox({
//			required:true,
//			missingMessage:"对象名不能为空",
//			invalidMessage:"对象名已经存在",
//			validType:"validArry[['"+arrattributeName+"'],'"+data.attributeName+"']"
//		});
		$("#columnTypeId").combobox({
			required:true,
			missingMessage:"字段类型不能为空",
		});
		$("#columnLengthId").textbox({
			required:true,
			missingMessage:"字段长度不能为空",
		});
	}
}

/**
 * 格式化要验证的字段数组
 */
function formartterColumn(column) {
	// 声明需要验证的字段数组
	var validColumn = [];
	for (var i = 0; i < arrColumn.length; i++) {
		// 向数组中添加值
		validColumn.push(arrColumn[i][column]);
	}
	return validColumn;
}

//枚举信息维护----------------------------------------------
/**
 * 新增枚举信息
 */
function addEnum() {
	//设置新增标识
	enumIsNew=true;
	// 打开新增对话框
	$("#meta_column_enum_add_modify_div").dialog({
		modal : true,
		title : "新增枚举信息",
		onClose : function() {
			// 清空数据
			$("#meta_column_enum_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//验证
	validateEnum("AddEnum");
	
	//获取焦点
	$("#enumOptionId").textbox().next("span").find("input").focus();
}

/**
 * 修改枚举信息
 */
function modifyEnum() {
	//设置修改标识
	enumIsNew=false;
	// 得到要修改的行节点的id
	var optionId = $('#columnEnumId option:selected').attr('id');
	var data={};
	for (var i = 0; i < arrEnum.length; i++) {
		if (arrEnum[i].enumOption == optionId) {
			data = arrEnum[i];
		}
	}
	
	// 打开修改对话框
	$("#meta_column_enum_add_modify_div").dialog({
		modal : true,
		title : "修改枚举信息",
		onClose : function() {
			// 清空数据
			$("#meta_column_enum_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	// 数据回显
	$("#meta_column_enum_add_modify_form").form("load",data);
	//验证
	validateEnum("ModifyEnum",data);
	
	//获取焦点
	$("#enumOptionId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改枚举信息保存按钮
 */
function enumSave() {
	//获取Select选中的索引值
	var checkIndex = $("#columnEnumId").get(0).selectedIndex;
	//序列化表单数据
	var enumBo = $("#meta_column_enum_add_modify_form").serializeObject();
	//提交数据
	if($("#meta_column_enum_add_modify_form").form("validate")){
		if (enumIsNew) {//新增则直接添加到数组中
			arrEnum.push(enumBo);
		}else{//修改则替换掉对应的元素
			arrEnum[checkIndex]=enumBo;
		}
		//将枚举信息数组加载到选项框中
		loadEnum(arrEnum);
		
		//关闭对话框
		$("#meta_column_enum_add_modify_div").dialog("close");
		
		//清空数据
		$("#meta_column_enum_add_modify_form").form("reset");
	}
}

/**
 * 新增、修改取消枚举信息取消按钮
 */
function enumCancel() {
	//关闭对话框
	$("#meta_column_enum_add_modify_div").dialog("close");
	
	//清空数据
	$("#meta_column_enum_add_modify_form").form("reset");
}

/**
 * 删除枚举信息
 */
function removeEnum() {

	// 得到要删除的行节点的id
	var optionId = $('#columnEnumId option:selected').attr('id');
	
	if (optionId == null || optionId == undefined) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	
	// 移除数组中对应的元素
	for (var i = 0; i < arrEnum.length; i++) {
		if (arrEnum[i].enumOption == optionId) {
			arrEnum.splice(i,1);
		}
	}
	
	//刷新页面数据
	loadEnum(arrEnum);
	
	// 删除选项中指定的数据
	jQuery("#columnEnumId option[value='"+optionId+"']").remove();
}

/**
 * 加载枚举信息选项框
 */
function loadEnum(arrEnum) {
	
	//设置双击修改
	$('#columnEnumId').dblclick(function() {	
	    $(this).find("option:selected").each(function(){ 
	    	modifyEnum();
	    });
	});
	
	//清空选项
	$("#columnEnumId").empty();
	
	//将枚举数组添加到列表中
	for (var i = 0; i < arrEnum.length; i++) {
		$("#columnEnumId").append("<option id='"+arrEnum[i].enumOption+"' value='"+arrEnum[i].enumValue+"'>"+arrEnum[i].enumOption+"-"+arrEnum[i].enumValue+"</option>");
	}
}

/**
 * 验证枚举信息的选项和值，不能为空也不能重复
 */
function validateEnum(formId,data) {
	// 需要验证的字段数组
	var arrEnumOption=formartterEnum("enumOption");
	var arrEnumValue=formartterEnum("enumValue");
	if(formId == "AddEnum"){// 新增验证
		$("#enumOptionId").textbox({
			required:true,
			missingMessage:"选项不能为空",
			invalidMessage:"选项已经存在",
			validType:"validArry[['"+arrEnumOption+"']]"
		});
		$("#enumValueId").textbox({
			required:true,
			missingMessage:"值不能为空",
			invalidMessage:"值已经存在",
			validType:"validArry[['"+arrEnumValue+"']]"
		});
	}else if(formId == "ModifyEnum"){// 修改验证
		$("#enumOptionId").textbox({
			required:true,
			missingMessage:"选项不能为空",
			invalidMessage:"选项已经存在",
			validType:"validArry[['"+arrEnumOption+"'],'"+data.enumOption+"']"
		});
		$("#enumValueId").textbox({
			required:true,
			missingMessage:"值不能为空",
			invalidMessage:"值已经存在",
			validType:"validArry[['"+arrEnumValue+"'],'"+data.enumValue+"']"
		});
	}
}

/**
 * 格式化要验证的枚举字段数组
 */
function formartterEnum(column) {
	// 声明需要验证的字段数组
	var validColumn = [];
	for (var i = 0; i < arrEnum.length; i++) {
		// 向数组中添加值
		validColumn.push(arrEnum[i][column]);
	}
	return validColumn;
}

/**
 * 生成表
 */
function createTable() {
	
	//得到要创建表的数据
	var rows = $("#metamanage_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要生成的表！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	// 删除选中数据
	$.messager.confirm("确认", "生成表后，原有的表会被替换，数据将被清除，是否继续？", function(r) {
		if (r) {
			//在数据库生成表
			$.ajax({
				url: basePath + "/gmodule_commondata_metamanage_createTable.json",
				type: 'post',
				data: rows[0],  
				dataType:"json",
				success: function(data) {
					if (data.resultCode == "1") {
						$.messager.alert("提示信息", "生成表成功！");
					} else {
						$.messager.alert("提示信息", "生成表失败！", "info");
					}
				},
				error : function() {
					$.messager.alert("错误信息", "服务器内部错误!", "error");
				}
			});
		}
	});
}
/**
 * 打开导出弹窗
 */
function exportMetamanage(){
	console.log(0111);
	//查询分类信息
	$.ajax({
		url:basePath+'/gmodule_datadict_findall.json',
		type: 'post',
		data: {typeCode:'GMODULE_TABLE_TYPE'}, 
		dataType:"json",
		async:false,
		success: function(data) {
			console.log(data);
			row = data.rows;
			//新建页面
			var html="<div><table class=\"btb\" style=\"border-collapse:separate; border-spacing:0px 10px;\">";
			for(var i=0;i<row.length;i++){
				if(i%3==0){
					html+= "<tr>";
				}
				if(row[i].dictCode!=undefined){
					html+= "<td style='border:0px'><input type=\"checkbox\" name=\"post\" value=\""+row[i].dictCode+"\">"+row[i].dictDesc+"("+row[i].dictCode+")"+"</td>";
				}
				if((i+1)%3==0){
					html+= "</tr>";
				}
			}
			html+="</table></div>";
			//添加到页面中
			$("#posthtml").html(html);
		}
	});
	 $("#exportDg").dialog("open");
}

/**
 * 导出元数据
 */
function exportData(){
	var data = [];
	var $allChecked = $("#exportDg").find("input:checked");
	if($allChecked.length>0){
		for(var i=0;i<$allChecked.length;i++){
			data.push($allChecked[i].value);
		}
		var types = data.join(",");
		$("#ff").form("submit",{
			url:basePath+"/gmodule_commondata_metamanage_export.json?",
			onSubmit:function(params){
				params.types = types;
				$("#exportDg").dialog("close");
			}
		});
	}else{
		$.messager.alert('提示', '请选择分类导出!', 'error');
	}
}

/**
 * 导入元数据，打开导入对话框
 */
function importMetamanage(){
	//打开对话框
	$("#dlg_importExcel").show().dialog({
		title : "导入元数据信息",
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
			url : basePath + "/gmodule_commondata_metamanage_import.json",
			success : function(data) {
				Common.ajaxLoadEnd();
				data = JSON.parse(data);
				if (data.resultCode == "1") {
					doSearch();
					$.messager.alert("提示", "导入成功！", "info");
				} else {
					$.messager.alert("提示", "导入元数据信息失败！", "info");
				}
				$("#form_import").form("reset");
			},
		    onSubmit: function(param){
		    }
		});
	}
}
