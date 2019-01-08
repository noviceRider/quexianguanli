var url;//请求url
var isNew;//新增、修改标志
var paramIsNew = false;//判断是增加还是修改
var backIsNew = false;//判断是增加还是修改
var arrParam=[];
var arrBack=[];
var arrParamC=[];
var arrBackC=[];
var logicCode;
/**
 * 初始化页面，加载数据
 */
$(function (){ 
	
	//加载api访问方式下拉列表
	$("#apiCalltypeQuery").combobox({
	    valueField:'id',
	    textField:'value',
	    data: [{
			id: '0',
			value: '鉴权访问'
		},{
			id: '1',
			value: '匿名访问'
		}]
	});
	
	//测试弹窗设置
	$('#AccessTest').dialog({
		resizable:false,
		onResize:function(width,height){
			$(this).find("#content_test").css("width",width-32);
			$("#paneltwo_test").panel("resize",{width:width-45});
			$("#panelone_test").panel("resize",{width:width-45});
			$("#inParamsId").textbox("resize",width-45);
		},
		onOpen:function(){
			$(this).dialog("restore");
		}
	});
	
	//数据网格加载数据
	$("#businesslogic_dg").datagrid( Common.createDatagridOptionsExt(basePath, "/gmodule_dataaccess_businesslogic_findpage.json",135));
	
	//给数据网格设置双击事件
	$("#businesslogic_dg").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消素有选择行
			$("#businesslogic_dg").datagrid("uncheckAll");
			//选中当前行
			$("#businesslogic_dg").datagrid("checkRow",index);
		},
		onDblClickRow:function(index,row){
			//取消素有选择行
			$("#businesslogic_dg").datagrid("uncheckAll");
			//选中当前行
			$("#businesslogic_dg").datagrid("checkRow",index);
			detail(index);
		}
	});
	
	//加载业务逻辑分类选择框
	loadCombotree("logicTypeKeyWord","1003");
	
	//选中查询
	$("#logicTypeKeyWord").combotree({
		onSelect:function(record){
			$("#logicTypeKeyWord").combotree("setValue",record.id);
			queryBusinesslogic();
		},
	});
	
	//加载新增、修改页面
	$("#dialog_add_modify").load("businesslogic_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
		
		//加载api访问方式下拉列表
		$("#apiCallTypeCombo").combobox({
		    valueField:'id',
		    textField:'value',
		    data: [{
				id: '0',
				value: '鉴权访问'
			},{
				id: '1',
				value: '匿名访问'
			}]
		});
		
		 $("#logicScriptId").on(
		            'keydown',
		            function(e) {
		                if (e.keyCode == 9) {
		                    e.preventDefault();
		                    var indent = '    ';
		                    var start = this.selectionStart;
		                    var end = this.selectionEnd;
		                    var selected = window.getSelection().toString();
		                    selected = indent + selected.replace(/\n/g, '\n' + indent);
		                    this.value = this.value.substring(0, start) + selected
		                            + this.value.substring(end);
		                    this.setSelectionRange(start + indent.length, start
		                            + selected.length);
		                }
		            });
	});

	//详情页面
	$("#dialog_detail").load("businesslogic_detail.html",null,function(){
		//进行解析
		$.parser.parse(this);
		//详情弹窗设置
		$('#businesslogic_detail_div').dialog({
			closed:true,
			modal : true,
			title : "业务逻辑管理详情",
			resizable:true,
			onResize:function(width,height){
				$(this).find("#content").css("width",width-32);
				$("#showJs").css("width",width-32);
				$("#panelTwo").panel("resize",{width:width-45});
				$("#panelOne").panel("resize",{width:width-45});
			},
			onOpen:onOpen
		});
	});

	//参数描述新增、修改页面
	$("#dialog_param_add_modify").load("dataaccess_param_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//返回值描述新增、修改页面
	$("#dialog_back_add_modify").load("dataaccess_back_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//复制参数页面
	$("#dialog_param_copy").load("param_copy.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//复制参数页面
	$("#dialog_back_copy").load("back_copy.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//导入页面
	$("#dialog_param_into").load("businesslogic_access.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
});

/**
 * 格式化是否有效数据列
 */
function isUsedFormatter(value,row,index) {
	if (value == 1) {// 有效
		return "<img src='../../../css/themes/icons/ok.png'/>";
	} else if (value == 0) {// 无效
		return "—";
	}
}

/**
 * 格式化是否预定义数据列
 */
function isPreDefinFormatter(value,row,index) {
	if (value == 1) {// 预定义
		return "预定义";
	} else if (value == 0) {// 自定义
		return "自定义";
	}
}

/**
 * 格式化业务逻辑分类下拉选项
 */
function logicTypeFormatter() {
	loadCombotree("logicTypeId","1003");
}

/**
 * 主页查询按钮
 */
function queryBusinesslogic() {
	//获取加载的参数
	var params = {keyWord:$("#keyWord").textbox("getValue"),logicType:$("#logicTypeKeyWord").combotree("getValue"),apiCallType:$("#apiCalltypeQuery").combobox("getValue")};
	$("#businesslogic_dg").datagrid("reload",params);
}

/**
 * 主页新增按钮
 */
function addBusinesslogic() {
	//设置新增标识
	isNew = true;
	
	//清空数组
	arrParam=[];
	arrBack=[];
	//更新参数描述数据表
	loadParam(arrParam);
	loadBack(arrBack);
	// 关闭panel
	$("#param_panel").panel({
		 collapsed:false
	});
	$("#back_panel").panel({
		collapsed:false
	});
	//设置新增url
	url=basePath+"/gmodule_dataaccess_businesslogic_addBusinesslogic.json";
	
	//启用表名输入框
	$("#logicCodeId").textbox("enable");
	
	// 加载业务逻辑分类下拉选项
	logicTypeFormatter();
	//清空span内容
	$("#logicScriptIdSpan").html("");
	$("#accessSql").val("");
	
	// 打开新增对话框
	$("#businesslogic_add_modify_div").dialog({
		modal : true,
		title : "新增业务逻辑",
		onClose : function() {
			// 清空数据
			$("#businesslogic_add_modify_form").form("reset");
			//清空span内容
			$("#logicScriptIdSpan").html("");
			$("#accessSql").val("");
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
	validateMetamanage();
	$("#apiCallTypeCombo").combobox("setValue",0);
	
	//获取焦点
	$("#logicCodeId").textbox().next("span").find("input").focus();
}

/**
 * 主页修改按钮
 */
function modifyBusinesslogic() {
	//设置修改标识
	isNew = false;
	// 关闭panel
	$("#param_panel").panel({
		 collapsed:false
	});
	$("#back_panel").panel({
		collapsed:false
	});
	//清空数组
	arrParam=[];
	arrBack=[];
	//得到要修改的节点
	var rows = $("#businesslogic_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	//设置修改url
	url=basePath+"/gmodule_dataaccess_businesslogic_modifyBusinesslogic.json";
	
	//设置参数描述数组
	setArrParam(rows[0]);
	setArrBack(rows[0]);
	// 更新参数描述表中数据
	loadParam(arrParam);
	loadBack(arrBack);
	
	
	// 加载业务逻辑分类下拉选项
	logicTypeFormatter();
	
	//禁用表名输入框
	$("#logicCodeId").textbox("disable");
	
	// 数据回显
	$("#businesslogic_add_modify_form").form("load",rows[0]);
	
	//回显脚本
	var pre="<pre class='prettyprint' style='font-size:16px;margin-left:20px'></pre>";
	$("#logicScriptIdSpan").html(pre);
	$("#logicScriptIdSpan").find("pre").text(rows[0].logicScript);
	$("#accessSql").val(rows[0].logicScript);
	prettyPrint();
	// 打开新增对话框
	$("#businesslogic_add_modify_div").dialog({
		modal : true,
		title : "修改业务逻辑",
		onClose : function() {
			// 清空数据
			$("#businesslogic_add_modify_form").form("reset");
			//清空span内容
			$("#logicScriptIdSpan").html("");
			$("#accessSql").val("");
		},
	}).dialog("center");
	
	// 验证
	validateMetamanage();

	//获取焦点
	$("#logicNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改保存
 */
function doSave(){
	// 序列化表单
	var logic = $("#businesslogic_add_modify_form").serializeObject();
	logic.logicCode = $("#logicCodeId").textbox("getValue");
	//业务逻辑脚本取值
	logic.logicScript=$("#accessSql").val();
	//有效
	logic.isUsed="1";
	// 设置参数描述，josn数组转字符串
	var inParams=JSON.stringify(arrParam);
	logic.inParams = inParams;
	// 设置返回值描述，josn数组转字符串
	var retInfo=JSON.stringify(arrBack);
	logic.retInfo = retInfo;
	// 保存提交数据
	if($("#businesslogic_add_modify_form").form("validate")){
		$.ajax({
			url: url,
			type: 'post',
			data: logic,  
			dataType:"json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$('#businesslogic_dg').datagrid('reload');
					//关闭对话框
					doCancel();
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
	$("#businesslogic_add_modify_div").dialog("close");
	
	//清空数据
	$("#businesslogic_add_modify_form").form("reset");
	
	//清空span内容
	$("#logicScriptIdSpan").html("");
}

/**
 * 主页删除按钮
 */
function removeBusinesslogic() {
	// 得到要删除的行节点
	var logicCodes = Common.getSelectedIds("#businesslogic_dg", "logicCode", "batchLogicCode");
	if (logicCodes == null || logicCodes.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			$.ajax({
				url : basePath + "/gmodule_dataaccess_businesslogic_removeBusinesslogic.json",
				type : "post",
				data : logicCodes,
				success : function(data) {
					// 更新表格中的数据
					if (data.resultCode == "1") {
						// 更新页面数据
						$('#businesslogic_dg').datagrid('reload');
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
 * 验证编号和名称不为空也不重复
 */
function validateMetamanage() {
	if(isNew){// 新增验证
		$("#logicCodeId").textbox({
			required:true,
			missingMessage:"业务逻辑编号不能为空",
			invalidMessage:"业务逻辑编号已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dataaccess_businesslogic_validateLogicCode.json','logicCode']"
		});
		$("#logicNameId").textbox({
			required:true,
			missingMessage:"业务逻辑名称不能为空",
			invalidMessage:"业务逻辑名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dataaccess_businesslogic_validateLogicName.json','logicName']"
		});
	}else{// 修改验证
//		$("#logicCodeId").textbox({
//			required:true,
//			missingMessage:"业务逻辑编号不能为空",
//			invalidMessage:"业务逻辑编号已经存在",
//			validType:"remoteValid['"+basePath+"/gmodule_dataaccess_businesslogic_validateLogicCode.json','logicCode',{logicCode:'"+$("#logicCodeId").textbox("getValue")+"'}]"
//		});
		$("#logicNameId").textbox({
			required:true,
			missingMessage:"业务逻辑名称不能为空",
			invalidMessage:"业务逻辑名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dataaccess_businesslogic_validateLogicName.json','logicName',{logicCode:'"+$("#logicCodeId").textbox("getValue")+"'}]"
		});
	}
}

/**
 * 格式化操作数据列
 * @param value
 * @param row
 * @param index
 */
function detailFormmater(value, row, index){
	return "<a href='#1' onclick='detail("+index+")' style='color: blue;' >详情</a> | <a href='#1' onclick='test("+index+")' style='color: blue;' >测试</a>";
}

/**
 * 详情
 */
function detail(index) {
	var row = $("#businesslogic_dg").datagrid('getRows')[index];
	//详情查询条件
	 logicCode = row.logicCode;
	 $('#businesslogic_detail_div').dialog("open").dialog("center");
}
function onOpen() {
	$(this).dialog("restore");
	//加载对应数据
	$.ajax({
		type: 'post',
		url:  basePath + "/gmodule_dataaccess_businesslogic_findById.json",
		data: {'logicCode': logicCode},
		success: function(data){
			//清空数组
			arrParam=[];
			arrBack=[];
			//设置参数描述数组
			setArrParam(data.rows);
			setArrBack(data.rows);
			// 更新参数和返回值描述表中数据
			$("#detail_param_dg").datagrid("loadData",arrParam);
			$("#detail_back_dg").datagrid("loadData",arrBack);
			// 加载数据
			var logicScript="<pre class='prettyprint' style='font-size:16px;margin-left:10px'></pre>";
			loadDetail("businesslogic_detail_div",data.rows);
			$("#logicScriptSpan").html(logicScript);
			$("#logicScriptSpan").find("pre").text(data.rows.logicScript);
			prettyPrint();
		}
	});
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
				}else if(j=="isPreDefin"){
					$allSpan.eq(i).html(data[j]=="1"?"预定义":"自定义");
				}else{
					$allSpan.eq(i).html(data[j]==null?"—":data[j]);
				}
			}
		}
	}
}

/**
 * 显示测试对话框
 */
function test(index){
	arrParam=[];
	arrBack=[];
	var row = $("#businesslogic_dg").datagrid('getRows')[index];
	row.isUsed = row.isUsed==1?"有效":"无效";
	Common.loadDataForDOM(row,"#AccessTest","span","name");
	//设置参数描述、返回值描述数组并加载到详情数据中
	setArrParam(row);
	$("#detail_param_table").datagrid("loadData",arrParam);
	setArrBack(row);
	$("#detail_back_table").datagrid("loadData",arrBack);
	$('#AccessTest').dialog('open');
	// 获取焦点
	$("#inParamsId").textbox().next('span').find('textarea').focus();
}

/**
*测试
*/
function doTest(){
	var paramsString=$("#inParamsId").textbox("getValue");
    var params=$.parseJSON(paramsString);
    if(params==null){
    	params={};
    }
    params.logicId=$("#te_accessCode").html();
    $.ajax({
    	type:'post',
    	url:basePath + "/businesslogic.json",
    	data:params,
    	success:function(data){
    		ajaxLoadEnd();
    	//格式化输出json字符串
         var dataString =JSON.stringify(data, null, "\t");
    	//$("#backInfo").textbox("setValue",dataString);
    	//
    	 var content = $.trim(dataString);
    	 var result = '';
    	 if (content!='') {
    	        try{
    	            current_json = jsonlint.parse(content);
    	            current_json_str = JSON.stringify(current_json);
    	            //current_json = JSON.parse(content);
    	            result = new JSONFormat(content,4).toString();
    	        }catch(e){
    	            result = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
    	            current_json_str = result;
    	        }

    	        $('#json-target').html(result);
    	    }else{
    	        $('#json-target').html('');
    	    }
    	//调整滚动条位置
    	 document.getElementById('AccessTest').scrollTop=$("#testTab").height();
    	},
    	beforeSend:function(){
    		ajaxLoading();
    	}
    });
}
/**
 * 打开遮罩
 */
function ajaxLoading(){   
    $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$("#AccessTest").height()}).appendTo("#AccessTest");   
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("#AccessTest").css({display:"block",left:($("#AccessTest").outerWidth(true) - 190) / 2,top:($("#AccessTest").height() - 45) / 2});   
 }  
/**
 * 请求结束关闭遮罩
 */
 function ajaxLoadEnd(){   
     $(".datagrid-mask").remove();   
     $(".datagrid-mask-msg").remove();               
} 
/**
*关闭测试窗口
*/
function closeDialog(){
	$('#AccessTest').dialog('close');
	//清空数据
	$("#inParamsId").textbox("setValue","");
	$("#json-target").html("");
}
/**
*关闭测试窗口
*/
function beforeOpen(){
	//清空数据
	$("#inParamsId").textbox("setValue","");
	$("#json-target").html("");
}
/**
 * 把脚本赋值到span
 */
function toSpan(){
	var logicScript=$("#logicScriptId").val();
	var pre="<pre class='prettyprint' style='font-size:16px;margin-left:20px'></pre>";
	$("#logicScriptIdSpan").html(pre);
	$("#logicScriptIdSpan").find("pre").text(logicScript);
	$("#accessSql").val(logicScript);
	$("#editJs").dialog("close");
	prettyPrint();
	$("#logicScriptId").val("");
}
/**
 * 打开脚本编辑
 */
function openEdit(){
	//清空
	$("#logicScriptId").val();
	$('#editJs').dialog('open');
	var spanText=$("#accessSql").val();
	$("#logicScriptId").val(spanText);
	$("#logicScriptId").focus();
}
//-------------------------------------------------------------------------------

/**
 * 新增参数
 */
function addParam(){
	paramIsNew = true;
	// 打开新增对话框
	$("#param_add_modify_div").dialog({
		modal : true,
		title : "新增参数",
		onClose : function() {
			// 清空数据
			$("#param_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	validateParam();
	
	// 获取焦点
	$("#paramNameId").textbox().next("span").find("input").focus();
}

/**
 * 修改参数
 */
function modifyParam(){
	paramIsNew = false;
	//得到要修改的节点
	var param = $("#param_table").datagrid("getSelected");
	if (param==null) {
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		// 数据回显
		$("#param_add_modify_form").form("load",param);
		// 打开新增对话框
		$("#param_add_modify_div").dialog({
			modal : true,
			title : "修改参数",
			onClose : function() {
				// 清空数据
				$("#param_add_modify_form").form("reset");
			},
		}).dialog("center");
	}
	
	validateParam();
	
	// 获取焦点
	$("#paramNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改参数保存
 */
function paramSave(){
	// 序列化表单
	var newParam = $("#param_add_modify_form").serializeObject();
	//获取Select选中的索引值
	var row = $("#param_table").datagrid("getSelected");
	var checkIndex = $("#param_table").datagrid("getRowIndex",row);
	//提交数据
	if($("#param_add_modify_form").form("validate")){
		if (paramIsNew) {//新增则直接添加到数组中
			arrParam.push(newParam);
		}else{//修改则替换掉对应的元素
			arrParam[checkIndex]=newParam;
		}
		// 更新参数描述表中数据
		loadParam(arrParam);
		//关闭页面
		paramCancel();
	}
}

/**
 * 新增、修改参数取消
 */
function paramCancel(){
	//关闭对话框
	$("#param_add_modify_div").dialog("close");
	
	//清空数据
	$("#param_add_modify_form").form("reset");
}

/**
 * 删除参数
 */
function removeParam(){
	// 得到要删除的行节点
	var params = $("#param_table").datagrid("getSelections");
	
	if (params == null || params.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	
	// 删除选中数据
	$.messager.confirm("确认", "是否删除选中数据，是否继续？", function(r) {
		if (r) {
			// 遍历选中数据数组
			for(var i in params){
				// 同时遍历字段数组
				for ( var j in arrParam) {
					// 满足条件，移除数组中被选中的元素
					if (params[i].paramName == arrParam[j].paramName) {
						arrParam.splice(j, 1);
					}
				}
			}
			// 更新参数描述表中数据
			loadParam(arrParam);
		};
	});
}

/**
 * 添加验证
 */
function validateParam(){
	$("#paramNameId").textbox({
		required:true,
		missingMessage:"参数名称不能为空",
	});
}

//加载参数数据表
function loadParam(arrParam) {
	//给字段数据网格设置属性
	$("#param_table").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有其他选中行
			$("#param_table").datagrid("uncheckAll");
			//选中当前行
			$("#param_table").datagrid("checkRow",index);
		},
		//行的双击事件
		onDblClickRow:function(index,row){
			//取消其他所有选中行
			$("#param_table").datagrid("uncheckAll");
			//选中当前行
			$("#param_table").datagrid("checkRow",index);
			//修改
			modifyParam();
		}
	});
	
	// 更新参数表中数据
	$("#param_table").datagrid("loadData",arrParam);
}

/**
 * 设置参数描述数组
 */
function setArrParam(data) {
	//设置参数描述数组
	if (data.inParams != null) {
		//josn字符串转数组
		var arr1 = JSON.parse(data.inParams);
		//天加到原有参数数组中
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrParam.push(arr1[i]);
			}
		}
	}
}

/**
 * 设置参数描述数组
 */
function setArrParamC(data) {
	//设置参数描述数组
	if (data.inParams != null) {
		var arr1 = JSON.parse(data.inParams);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrParamC.push(arr1[i]);
			}
		}
	}
}

/**
 * 格式化参数类型数据列
 */
function paramTypeFormartter(value,row,index){
	if(value=="1"){
		return "数字";
	}else if(value=="0"){
		return "字符";
	}
}

/**
 * 新增返回值
 */
function addBack(){
	backIsNew = true;
	// 打开新增对话框
	$("#back_add_modify_div").dialog({
		modal : true,
		title : "新增返回值",
		onClose : function() {
			// 清空数据
			$("#back_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	validateBack();
	
	// 获取焦点
	$("#backNameId").textbox().next("span").find("input").focus();
}

/**
 * 修改返回值
 */
function modifyBack(){
	backIsNew = false;
	//得到要修改的节点
	var back = $("#back_table").datagrid("getSelected");
	if (back==null) {
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		// 数据回显
		$("#back_add_modify_form").form("load",back);
		// 打开新增对话框
		$("#back_add_modify_div").dialog({
			modal : true,
			title : "修改返回值",
			onClose : function() {
				// 清空数据
				$("#back_add_modify_form").form("reset");
			},
		}).dialog("center");
	}
	
	validateBack();
	
	// 获取焦点
	$("#backNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改返回值保存
 */
function backSave(){
	// 序列化表单
	var newBack = $("#back_add_modify_form").serializeObject();
	//获取Select选中的索引值
	var row = $("#back_table").datagrid("getSelected");
	var checkIndex = $("#back_table").datagrid("getRowIndex",row);
	//提交数据
	if($("#back_add_modify_form").form("validate")){
		if (backIsNew) {//新增则直接添加到数组中
			arrBack.push(newBack);
		}else{//修改则替换掉对应的元素
			arrBack[checkIndex]=newBack;
		}
		// 更新返回值描述表中数据
		loadBack(arrBack);
		//关闭页面
		backCancel();
	}
}

/**
 * 新增、修改返回值取消
 */
function backCancel(){
	//关闭对话框
	$("#back_add_modify_div").dialog("close");
	
	//清空数据
	$("#back_add_modify_form").form("reset");
}

/**
 * 删除返回值
 */
function removeBack(){
	// 得到要删除的行节点
	var backs = $("#back_table").datagrid("getSelections");
	
	if (backs == null || backs.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	
	// 删除选中数据
	$.messager.confirm("确认", "是否删除选中数据，是否继续？", function(r) {
		if (r) {
			// 遍历选中数据数组
			for(var i in backs){
				// 同时遍历字段数组
				for ( var j in arrBack) {
					// 满足条件，移除数组中被选中的元素
					if (backs[i].backName == arrBack[j].backName) {
						arrBack.splice(j, 1);
					}
				}
			}
			// 更新返回值描述表中数据
			loadBack(arrBack);
		};
	});
}


/**
 * 添加验证
 */
function validateBack(){
	$("#backNameId").textbox({
		required:true,
		missingMessage:"返回值名称不能为空",
	});
}

//加载返回值数据表
function loadBack(arrBack) {
	//给字段数据网格设置属性
	$("#back_table").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有其他选中行
			$("#back_table").datagrid("uncheckAll");
			//选中当前行
			$("#back_table").datagrid("checkRow",index);
		},
		//行的双击事件
		onDblClickRow:function(index,row){
			//取消其他所有选中行
			$("#back_table").datagrid("uncheckAll");
			//选中当前行
			$("#back_table").datagrid("checkRow",index);
			//修改
			modifyBack();
		}
	});
	// 更新返回值表中数据
	$("#back_table").datagrid("loadData",arrBack);
}

/**
 * 设置返回值描述数组
 */
function setArrBack(data) {

	//设置返回值描述数组
	if (data.retInfo != null) {
		var arr1 = JSON.parse(data.retInfo);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrBack.push(arr1[i]);
			}
		}
	}
}

/**
 * 设置返回值描述数组
 */
function setArrBackC(data) {
	
	//设置返回值描述数组
	if (data.retInfo != null) {
		var arr1 = JSON.parse(data.retInfo);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrBackC.push(arr1[i]);
			}
		}
	}
}

/**
 * 格式化返回值类型数据列
 */
function backTypeFormartter(value,row,index){
	if(value=="1"){
		return "数字";
	}else if(value=="0"){
		return "字符";
	}
}

/**
 *  帮助
 */
function openHelp() {
	$("#helpInfo").dialog('open');
}

//-----------------------------------------------------------

/**
 * 过滤数组重复元素
 */
function uniqueParam(target) {    
    var result = [];    
    loop:   
    for (var i = 0, n = target.length; i < n; i++){    
      for (var x = i + 1; x < n; x++) {    
        if (target[x].paramDesc === target[i].paramDesc && target[x].paramName === target[i].paramName)  
          continue loop;     
      }    
      result.push(target[i]);    
    }    
    return result;    
  }  

/**
 * 过滤数组重复元素
 */
function uniqueBack(target) {    
    var result = [];    
    loop:   
    for (var i = 0, n = target.length; i < n; i++){    
      for (var x = i + 1; x < n; x++) {    
        if (target[x].backDesc === target[i].backDesc && target[x].backName === target[i].backName)  
          continue loop;     
      }    
      result.push(target[i]);    
    }    
    return result;    
  }  

/**
 * 参数复制
 */
function copyParam() {
	var tree = $("#logicTypeId").combotree('tree');
	var logicType = tree.tree('getSelected');
	if (logicType == null || logicType == "") {
		$.messager.alert("提示信息", "请选择业务逻辑分类！", "info");
		return;
	}
	$.ajax({
		url:basePath+"/gmodule_dataaccess_businesslogic_findByLogicType.json",
		type:"post",
		data:{"logicType":logicType.id},
		success:function(data){
			var logic = data.rows;
			for (var i = 0; i < logic.length; i++) {
				if (logic[i].inParams != null && logic[i].inParams != "") {
					setArrParamC(logic[i]);
				}
			}
			arrParamC = uniqueParam(arrParamC);
			$("#logic_param_dg").datagrid("loadData",arrParamC);
			
			// 打开新增对话框
			$("#logic_param_div").dialog({
				modal : true,
				title : "复制参数",
			}).dialog("center");
		}
	});
}

/**
 * 复制参数选择按钮
 */
function selectParam() {
	var params = $("#logic_param_dg").datagrid("getSelections");
	if (params.length == 0 || params == null) {
		$.messager.alert("提示信息", "请选择数据", "error");
		return;
	}
	for (var i = 0; i < params.length; i++) {
		arrParam.push(params[i]);
	}
	arrParam = uniqueParam(arrParam);
	$("#param_table").datagrid('loadData',arrParam);
	
	cancelSelectParam();
}

/**
 * 复制参数取消按钮
 */
function cancelSelectParam() {
	// 关闭对话框
	$("#logic_param_div").dialog("close");
}

//---------------------------------------------------------------------------

/**
 * 返回值复制
 */
function copyBack() {
	var tree = $("#logicTypeId").combotree('tree');
	var logicType = tree.tree('getSelected');
	if (logicType == null || logicType == "") {
		$.messager.alert("提示信息", "请选择业务逻辑分类！", "info");
		return;
	}
	$.ajax({
		url:basePath+"/gmodule_dataaccess_businesslogic_findByLogicType.json",
		type:"post",
		data:{'logicType':logicType.id},
		success:function(data){
			var logic = data.rows;
			for (var i = 0; i < logic.length; i++) {
				if (logic[i].retInfo != null && logic[i].retInfo != "") {
					setArrBackC(logic[i]);
				}
			}
			arrBackC = uniqueBack(arrBackC);
			$("#logic_back_dg").datagrid("loadData",arrBackC);
			
			// 打开新增对话框
			$("#logic_back_div").dialog({
				modal : true,
				title : "复制返回值",
			}).dialog("center");
		}
	});
}

/**
 * 复制返回值选择按钮
 */
function selectBack() {
	var backs = $("#logic_back_dg").datagrid("getSelections");
	if (backs.length == 0 || backs == null) {
		$.messager.alert("提示信息", "请选择数据", "error");
		return;
	}
	for (var i = 0; i < backs.length; i++) {
		arrBack.push(backs[i]);
	}
	arrBack = uniqueBack(arrBack);
	$("#back_table").datagrid('loadData',arrBack);
	
	cancelSelectBack();
}

/**
 * 复制返回值取消按钮
 */
function cancelSelectBack() {
	// 打开新增对话框
	$("#logic_back_div").dialog("close");
}

/**
 * 生成参数
 */
function createParam() {
	var param = {};
	for (var i = 0; i < arrParam.length; i++) {
		if (arrParam[i].paramType == "1") {
			if(arrParam[i].paramTestValue==""){
				param[''+arrParam[i].paramName+'']=0;
			}else{
				param[''+arrParam[i].paramName+'']=Number(arrParam[i].paramTestValue);
			}
		}else{
			param[''+arrParam[i].paramName+'']=arrParam[i].paramTestValue;
		}
	}
	var jsonStr=JSON.stringify(param);
	$("#inParamsId").textbox("setValue",jsonStr);
}

/**
 * 选择访问数据编号
 */
function into(pr) {
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
				selectDataAccess(pr);
			}
	});
	
	//打开窗口
	$("#padconfig_dataaccess_div").dialog({
		title:"选择数据类型",
		modal:true,
		onClose : function() {
			// 清空数据
			$("#dataaccess_form").form("reset");
		},
	}).dialog("open").dialog("center");
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
 * 数据类型选择按钮
 */
function selectDataAccess(pr) {
	//得到要选择的节点
	var rows = $("#padconfig_dataaccess_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择具体的数据！","info");
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
	}else{
		if(pr=="param"){
			//设置访问数据编号输入框
			var arr = JSON.parse(rows[0].parameterDesc);
			for (var i = 0; i < arr.length; i++) {
				arrParam.push(arr[i]);
			}
			uniqueParam(arrParam);
			loadParam(arrParam);
		}else if(pr=="back"){
			//设置访问数据编号输入框
			var arr = JSON.parse(rows[0].returnedDesc);
			for (var i = 0; i < arr.length; i++) {
				arrBack.push(arr[i]);
			}
			uniqueBack(arrBack);
			loadBack(arrBack);
		}
		//关闭页面
		cancelselectDataAccess();
	}
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
 * 跳转到修改
 * @param flag 测试，详情标识
 */
function changeToModify(flag){
	if(flag == "xq"){
		//关闭详情窗口
		$('#businesslogic_detail_div').dialog('close');
	}else if(flag == "test"){
		closeDialog();
	}
	modifyBusinesslogic();
}
/**
 * 导出
 */
function exportLogic(){
	//加载根节点信息
	$.ajax({
		url:basePath+"/gmodule_multilevel_findall.json",
		type:'post',
		data:{infoType:'1003',isUsed:1},
		async:false,
		success:function(data){
			row = data.rows;
			//新建页面
			var html="<div><table class=\"btb\" style=\"border-collapse:separate; border-spacing:0px 10px;\">";
			for(var i=0;i<row.length;i++){
				if(i%3==0){
					html+= "<tr>";
				}
				if(row[i].typeId!=undefined){
					html+= "<td style='border:0px'><input type=\"checkbox\" name=\"post\" value=\""+row[i].typeId+"\">"+row[i].typeName+"("+row[i].typeId+")"+"</td>";
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
 * 根据数据访问分类导出 分类，数据访问 数据
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
			url:basePath+"/gmodule_dataaccess_businesslogic_export.json?",
			onSubmit:function(params){
				params.types = types;
				params.infoType = '1003';
				$("#exportDg").dialog("close");
			}
		});
	}else{
		$.messager.alert('提示', '请选择分类导出!', 'error');
	}
}

/**
 * 导入业务逻辑，打开导入对话框
 */
function importLogic(){
	//打开对话框
	$("#dlg_importExcel").show().dialog({
		title : "导入业务逻辑信息",
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
			url : basePath + "/gmodule_dataaccess_businesslogic_import.json",
			success : function(data) {
				Common.ajaxLoadEnd();
				data = JSON.parse(data);
				if (data.resultCode == "1") {
					queryBusinesslogic();
					$.messager.alert("提示", "导入成功！", "info");
				} else {
					$.messager.alert("提示", "导入业务逻辑配置信息失败！", "info");
				}
				$("#form_import").form("reset");
			},
		    onSubmit: function(param){
		    }
		});
	}
}
