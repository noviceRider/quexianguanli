var saveUrl; //新增或修改保存时请求的url
var isNew = true; //是否为新增，true:新增，false：修改
var infoType;
var nodeId ;//选中节点的id
/**
 * 功能:加载新增修改页面
 * 参数：无
 */
$(function() {
	//加载新增修改页面
	$("#dictType").load("resource_add_modify.html", null, function() {
		//进行解析
		$.parser.parse(this);
	});
	// 加载所属资源大类页面
	$("#detaile").load("selectinfotype.html", null, function() {
		// 进行解析
		$.parser.parse(this);
	});
});  

/**
 * 选择所属资源大类按钮   l
 */
function selectInfoType() {
	if ($("#dictTable").datagrid("getSelected") == null) {
		$.messager.alert("错误信息", "请选择具体所属数据类型信息", "error");
		return;
	}
	//重置dialog数据
	$('#dg').datagrid('loadData', { total: 0, rows: [] }); 
	// 获取选中行数据
	var row = $('#dictTable').datagrid('getSelected');
	// 将选择的项目Id显示在选择项目文本框中（隐藏状态）
	$("#searchresForm_dictCode").attr("value", row.dictCode);
	infoType=$("#searchresForm_dictCode").val();
	// 将选择的项目名称显示在选择项目文本框中
	$("#searchresForm_dictDesc").textbox("setValue", row.dictDesc);
	$(".tree-tile").css("font-size",'13px');
	// 关闭选择所属项目对话框
	$("#detaile").dialog('close');
	$("#infotype_Div").dialog("close");
	//资源描述关键字
	var resDesc = $("#resDesc_keyword").textbox("getValue");
	//显示tree
	$("#tt").tree({
		url: basePath + "/projectres_findmenu.json",
		method: "post",
		animate: true,
		loadFilter: function(data1, parent) {
			var data = data1.rows;
			for(var i in data){
				data[i].text=data[i].text+"("+data[i].id+")";
			}
			return data;
		},
		onBeforeLoad: function(node, param) {
			param.infoType = infoType;
		},
		onSelect: function(node) {
			if($("#tt").tree("isLeaf", node.target)) {
				nodeId = node.id;
				//resize表格，避免出现滚动条
				$("#dg").datagrid('resize');
				var p = Common.createDatagridOptionsParams(basePath, "/gmodule_resmanage_findpage.json", 135, {typeId: nodeId,infoType: infoType,typeRoute:node.typeRoute,keyWord: resDesc});
				p.pageNumber = 1;
				$("#dg").datagrid(p);
			}
		},
		onClick: function(node) {
			if(!$("#tt").tree("isLeaf", node.target)) {
				$("#dg").datagrid('resize');
				var p = Common.createDatagridOptionsParams(basePath, "/gmodule_resmanage_findpage.json", 135, {typeId: node.id,infoType: infoType,typeRoute:node.typeRoute});
				p.pageNumber = 1;
				$("#dg").datagrid(p);
				
				$("#tt").tree("toggle", node.target);
			}
		}
	});

}

/**
 * 功能：打开新增对话框        l
 * 参数：无
 */
function doAddProjectRes() {
	//判断是否选中项目，选取节点是否为空，节点是否为子节点
	if($("#searchresForm_dictCode").val() == '' || $("#tt").tree("getSelected") == null || !$("#tt").tree("isLeaf", $("#tt").tree("getSelected").target)) {
		$.messager.alert("错误信息", "请选中具体的项目和资源类型", "error");
	} else {
		$("#res_add_modify").dialog({
			modal: true,
			title: "资源管理",
			onClose: function() {
				//清空数据
				$("#res_add_modify_fm").form("reset");
			}
		});
		//验证
		validateProjectRes();
		//设置默认的项目id，分类序号
		infoType = $("#searchresForm_dictCode").val();
		$("#infoType").textbox('setValue', infoType);
		var typeId = $("#tt").tree("getSelected");
		$("#typeId").textbox("setValue", typeId.id);
		isNew = true; //新增
		saveUrl = basePath + "/gmodule_resmanage_add.json"; //新增请求的url
		//项目名称编辑框获取焦点
		setTimeout(function(){
			$("#resDesc").textbox("textbox").focus();
		}, 300);
	}
}

/**
 * 查询资源管理信息    l
 */
function queryResManage() {
	//判断是否选中项目，选取节点是否为空，节点是否为子节点
	if($("#searchresForm_dictCode").val() == '' || $("#searchresForm_dictCode").val() == null) {
		$.messager.alert("错误信息", "请选中具体的项目和资源类型", "error");
	} else {
		
		var p = Common.createDatagridOptionsParams(basePath, "/gmodule_resmanage_findpage.json", 135, {keyWord: $("#resDesc_keyword").textbox("getValue"),infoType: $("#searchresForm_dictCode").val(),typeRoute:$("#tt").tree("getSelected").typeRoute});
		p.pageNumber = 1;
		$("#dg").datagrid(p);
	}
}

/**
 * 保存操作         l
 */
function doSave() {
	//新增保存
	if(isNew&& $("#res_add_modify_fm").form("validate")) {
		$("#res_add_modify_fm").form("submit", {
			method: "post",
			url: basePath + "/gmodule_resmanage_add.json",
			success: function(data) {
				var data1 = JSON.parse(data);
				if(data1.resultCode == "1") {
					$("#dg").datagrid("reload");
					$('#res_add_modify').dialog('close');
				} else if(data.resultCode == "0") {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				} else {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				}
			}
		});
	}
	//修改保存
	else if(!isNew && $("#res_add_modify_fm").form("validate")) {
		$("#res_add_modify_fm").form("submit", {
			method: "post",
			url: basePath + "/gmodule_resmanage_modify.json",
			success: function(data) {
				var data1 = JSON.parse(data);
				if(data1.resultCode == "1") {
					$("#dg").datagrid("reload");
					$('#res_add_modify').dialog('close');
				} else if(data.resultCode == "0") {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				} else {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				}
			}
		});
	}
}

/**
 * 引用次数     l
 */
function countFormatter(value, row, index) {
	//查看引用次数方法
	var returnHtml = "<a href='#' onClick='showRef(\"" + row.resId + "\")'  style='color: blue;float:center;' title='查看引用详情' >"+value+"</a> " ;
	return returnHtml;
}

/**
 * 设置下载链接     l
 */
function detailFormatter(value, row, index) {
	//查看引用次数方法
	var returnHtml = "" ;
	//下载方法
	returnHtml += "<a href='"+basePath+"/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;float:left;width:48%;' >下载</a> " ;
	if (row.isPic == "1") {
		//资源是图片则添加预览链接
		return returnHtml += "<a href='#'  style='border-left:1px solid blue;color: blue;;float:right;width:48%;' onclick=lookPic(" + row.resId + ")>预览</a>";
	} else {
		return returnHtml;
	}
	
}

/**
 * 预览    l
 */
function lookPic(id){
	var aaa=[];
	var url={url:basePath+'/gmodule_resmanage_filedown.json?id=' + id};
	aaa.push(url);
	$("#aaa").picturePreview(aaa,"showPics");
}

/**
 * 打开修改对话框       l
 * 参数：无
 */
function doModify() {
	isNew = false; //修改
	//得到要修改的节点
	var rows = $("#dg").datagrid("getSelections");
	if(rows == null || rows.length == 0) {
		$.messager.alert("提示信息", "请选择要修改的数据！", "info");
		return;
	} else {
		//取值
		$("#resId").textbox('setValue', rows[0].resId);
		$("#resDesc").textbox("setValue", rows[0].resDesc);
		//$("#is").attr("checked", rows[0].isPic == 1 ? true : false);
	}
	//设置修改请求路径URL
	saveUrl = basePath + "/frame_projectres_modify.json";
	//显示对话框
	$("#res_add_modify").dialog({
		modal: true,
		title: "项目资源管理",
		onClose: function() {
			//清空数据
			$("#res_add_modify_fm").form("reset");
		}
	});
	//验证
	validateProjectRes();
	//项目名称编辑框获取焦点
	setTimeout(function(){
		$("#resDesc").textbox("textbox").focus();
	}, 300);
}

/**
 * 功能:取消按钮点击事件，重置输入表单，关闭对话框  l
 * 参数：无
 */
function doCancel() {
	//关闭对话框
	$("#res_add_modify").dialog("close");
	//清空数据
	$("#res_add_modify_fm").form("reset");
}

/**
 * 退出按钮操作     l
 */
function outChiose() {
	//找到父页面dom节点关闭
	$("#detaile").dialog('close');
}

/**
 * 功能：删除选中项目资源      l
 * 参数：无
 */
function doDelete() {
	var rows = $("#dg").datagrid("getSelections");
	if(rows == null || rows.length == 0) {
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if(r) {
			var id = $("#dg").datagrid("getSelected").resId;
			$.ajax({
				url: basePath + "/gmodule_resmanage_remove.json",
				type: "post",
				data: {
					id: id
				},
				success: function(data) {
					//更新表格中的数据
					if(data.resultCode == "1") {
						//更新表格中的数据
						$("#dg").datagrid("reload");
						//$.messager.alert("提示信息","删除数据成功！");
						doCancel();
					} else {
						$.messager.alert("提示信息", "删除数据失败！", "info");
					}
				},
				error: function() {
					$.messager.alert("错误信息", "服务器内部错误!", "error");
				}
			});
		};
	});
}

/**
 * 功能：双击行事件
 * 参数：
 * 	rowIndex:该行的下标          l
 * 	rowData:该行的数据
 */
function onDblClickRow(rowIndex, rowData) {
	onClickRow(rowIndex, rowData);
	doModify();
}

/**
 * 功能：单击行事件，当选择一行时，复选框也只能选择这行       l
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onClickRow(rowIndex, rowData) {
	//设置成不全选
	$("#dg").datagrid("uncheckAll");
	//选择当前行
	$("#dg").datagrid("checkRow", rowIndex);
}

/**
 * 验证资源描述，不为空也不重复   l
 */
function validateProjectRes() {
	var data = $("#res_add_modify_fm").serializeObject();
	if(isNew) {
		$("#resDesc").textbox({
			required: true,
			missingMessage: "资源描述不能为空",
			invalidMessage: "资源描述已经存在",
			validType: "remoteValid['" + basePath + "/gmodule_resmanage_validatedesc.json','resDesc']"
		});
	} else {
		$("#resDesc").textbox({
			required: true,
			missingMessage: "资源描述不能为空",
			invalidMessage: "资源描述已经存在",
			validType: "remoteValid['" + basePath + "/gmodule_resmanage_validatedesc.json','resDesc',{resId:'" + data.resId + "'}]"
		});
	}
}

//格式化文件大小     l
function fileSizeFormatter(value) {
	if(null == value || value == '') {
		return "0 Bytes";
	}
	var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
	var index = 0;
	var srcsize = parseFloat(value);
	index = Math.floor(Math.log(srcsize) / Math.log(1024));
	var size = srcsize / Math.pow(1024, index);
	size = size.toFixed(2); //保留的小数位数
	return size + unitArr[index];
}

//格式化文件上传时间
function uploadTimeFormatter(value) {
	if(null == value || value == '') {
		return "";
	}
	return new Date(value).pattern("yyyy-MM-dd HH:mm");
}

/**
 * 格式化数据网格中的日期时间显示
 * 以yyyy-MM-dd hh:mm:ss格式
 * @param value
 * @param row
 * @param index
 * @returns
 */
function timeformatter(value, row, index) {
	if(Date.parse(value)) {
		return new Date(Date.parse(value)).pattern("yyyy-MM-dd");
	}
}

//=========================
//=========================
/**
 * 弹出所属资源大类数据
 * 选择项目后，查询出该项目下的任务    l
 */
function selectPro(){
	showPro(function(data){
		//给项目输入框设置值
		$("#searchresForm_dictDesc").textbox("setValue",data.dictDesc);
		$("#searchresForm_dictCode").val(data.dictCode);	
		//加载该项目下的任务数据
		//loadDatagrid();
	});
}

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
		title:"选择所属资源大类",
		modal:true,
		buttons : '#select_btns',
		resizable : true,
	});
		
} 

/**
 * 日期显示格式        l
 */
function dateformatter(value,row,index){
	if(Date.parse(value)){
		return new Date(Date.parse(value)).pattern("yyyy-MM-dd");
	}
}

/**
*选择数据退出框           l
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

/**
 * 查询所属资源大类        l
 */
function queryInfoType(){
	$("#dictTable").datagrid("reload",{typeCode:'INFO_TYPE',keyWord:$("#keyWord").val()});
}
//====================================查看资料引用===============================//
/**
 * 查看资料引用
 * @param resId
 */
function showRef(resId){
	$("#refTable").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 315, {accessId:"3205",resId:resId}));
	//打开窗口
	$("#showResDiv").show().dialog({
		title:"查看引用",
		modal:true,
		width:'500',
		height:'398',
		buttons : '#show_res_btns',
		resizable : true,
	});
}