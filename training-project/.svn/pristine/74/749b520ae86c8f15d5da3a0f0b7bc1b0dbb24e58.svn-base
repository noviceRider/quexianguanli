var isNew = false;//判断是增加还是修改
var paramIsNew = false;//判断是增加还是修改
var backIsNew = false;//判断是增加还是修改
var url;//增加、修改的请求地址
var typeCode;//选中的访问类型
var categoryCode;//选中的访问分类
var javaMethod;//新增时javaMethod
var accessUrl;//新增时accessUrl
var accessCode;
var arrParam=[];
var arrBack=[];

$(function (){
	//初始化数据网格
	$("#accessTable").datagrid(createDatagrid(basePath, "/apron_punish_dataaccess_findpage.json",document.body.clientHeight, 135, "",'typeDiv'));
	//给数据网格设置双击事件
	$("#accessTable").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消素有选择行
			$("#accessTable").datagrid("uncheckAll");
			//选中当前行
			$("#accessTable").datagrid("checkRow",index);
		},
		onDblClickRow:function(index,row){
			//取消素有选择行
			$("#accessTable").datagrid("uncheckAll");
			//选中当前行
			$("#accessTable").datagrid("checkRow",index);
			modifyAccess(row);
		}
	});
	
	//加载选择选择访问类型datagrid
	$("#type_dg").datagrid(createDatagrid(basePath, "/apron_punish_accesstype_findpage.json",550, 135, "",'chooseType'));
	//给数据网格设置双击事件
	$("#type_dg").datagrid({
		onDblClickRow: function(index, row) {
			chooseType(row);
		}
	});
	
	//加载访问分类
	$("#am_categoryCode").combotree({
		url:basePath+"/apron_punish_dataaccess_category_findallleaf.json",
		required:true,
		missingMessage:"访问分类不能为空",
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
});

/**
 * 查询
 */
function searchAccess(){
	var params =  $("#form_search").serializeObject();
	$("#accessTable").datagrid('reload',params);
}

/**
 * 添加数据访问
 */
function addAccess(){
	isNew=true;
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
	$('#am_form').form('reset');
	$('#amAccess').dialog({title:'增加数据访问'}).dialog('open');
	url=basePath + "/apron_punish_dataaccess_add.json";
	validate();
	//新增默认有效，隐藏显示是否有效
	$('#hide1').hide();
	$('#hide2').hide();
	$('#am_accessCode').textbox({'editable':true});
	setTimeout(function(){$("#am_accessCode").textbox().next('span').find('input').css('background','#fff');},200);
	//默认焦点时间
	setTimeout(function(){
		$('#am_accessCode').textbox().next("span").find('input').first().focus();
	},300);
}

/**
 *  修改
 */
function modifyAccess(rowObj){
	$('#hide1').show();
	$('#hide2').show();
	var row = rowObj ==null ?$('#accessTable').datagrid('getSelected'):rowObj;
	if(row == null){
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		isNew = false ;
		accessCode = row.accessCode;
		typeCode = "";
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
		//清空数据
		$("#am_form").form("reset");
		$('#am_accessCode').textbox({'editable':false});
		setTimeout(function(){$("#am_accessCode").textbox().next('span').find('input').css('background','#ccc');},200);
		url=basePath + "/apron_punish_dataaccess_modify.json";
		//设置参数描述数组
		setArrParam(row);
		setArrBack(row);
		// 更新参数描述表中数据
		loadParam(arrParam);
		loadBack(arrBack);
		
		$('#amAccess').dialog({title:'修改数据访问'}).dialog('open');
		validate();
		//默认焦点时间
		setTimeout(function(){
			$('#am_accessName').textbox().next("span").find('input').first().focus();
		},300);
		$("#am_form").form("load",row);
	}
}

/**
 * 打开选择访问类型dialog
 */
function openChoose(){
	$('#chooseType').dialog('open');
}

/**
 * 查询访问类型
 */
function doSearchType(){
	var param = {keyWord:$('#type_keyword').textbox('getValue')};
	$('#type_dg').datagrid('reload',param);
}

/**
 * 选中访问类型
 * @param row
 */
function chooseType(rowObj){
	var row = rowObj==null?$('#type_dg').datagrid('getSelected'):rowObj;
	if(row != null){
		$('#chooseType').dialog('close');
		typeCode = row.typeCode;
		javaMethod = row.javaMethod;
		accessUrl = row.accessUrl;
		$('#am_typeCode').textbox('setValue',row.typeName);
	}else{
		$.messager.alert("提示信息", "请选择访问类型", "info");
	}
}

/**
 * 数据访问类型的保存
 */
function doSave(){
	var valid = $("#am_form").form("validate");
	var obj = $("#am_form").serializeObject();
	obj.typeCode = typeCode;
	obj.modifyCode = accessCode;
	// 设置参数描述
	var parameterDesc="";
	for (var i = 0; i < arrParam.length; i++) {
		parameterDesc = parameterDesc+","+arrParam[i].paramName+"-"+arrParam[i].paramDesc+"-"+arrParam[i].paramType+"-"+arrParam[i].paramTestValue;
	}
	obj.parameterDesc = parameterDesc;
	// 设置返回值描述
	var returnedDesc="";
	for (var i = 0; i < arrBack.length; i++) {
		returnedDesc = returnedDesc+","+arrBack[i].backName+"-"+arrBack[i].backDesc+"-"+arrBack[i].backType+"-"+arrBack[i].backTestValue;
	}
	obj.returnedDesc = returnedDesc;
	
	var sql = obj.accessSQL==null?'':obj.accessSQL;
	var isSql = sql.trim().length<1?false:true;

	if(isNew){
		obj.javaMethod = javaMethod;
		obj.accessUrl = accessUrl;
	}
	if(valid){
		if(!isSql){
			$.messager.alert("提示信息", "sql不能为空", "info");
		}else{
			$.ajax({
				type:'post',
				url: url,
				data:obj,
				dataType:'json',
				async:false,
				success: function(data){
					if(data.resultCode=="1"){
						$("#accessTable").datagrid('reload');
						//关闭对话框																			
						$('#amAccess').dialog('close');
						//清空数据
						$("#am_form").form("reset");
					} else{
						$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
					}
				}
			});	
		}
	}
}

/**
 *  删除数据访问
 */
function removeAccess(){
	var rows = $('#accessTable').datagrid('getSelections');
	if(rows.length<1){
		$.messager.alert("提示信息", "请选择要删除的数据", "error");
	}else{
		$.messager.confirm("提示信息","你确定要删除选中数据吗？",function(r){
			if(r){
				for (var i = 0; i < rows.length; i++) {
					$.ajax({
						url:basePath+"/apron_punish_dataaccess_delete.json",
						data:{accessCode:rows[i].accessCode},
						type:'post',
						dataType:'json',
						async:false,
						success:function(data){
							if(data.resultCode=="1"){
								$("#accessTable").datagrid('reload');
							} else if(data.resultCode=="0"){
								$.messager.alert("提示信息", "第"+(i+1)+"条数据操作失败了，检查该记录是否在数据访问模块使用", "error");
							} else{
								$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
							}
						}
					});
				}
			}
		});
	}
}

/**
 * 添加验证
 */
function validate(){
	$("#am_accessCode").textbox({
		required:true,
		missingMessage:"访问编号不能为空",
		validType:"codevalide",
		invalidMessage:'编码已经存在'
	});
	$("#am_accessName").textbox({
		required:true,
		missingMessage:"访问名称不能为空"
	});
	$("#am_typeCode").textbox({
		required:true,
		missingMessage:"访问类型不能为空"
	});
	$("#am_accessDesc").textbox({
		required:true,
		missingMessage:"访问描述不能为空"
	});
	/*$("#phoneNum").textbox({
		invalidMessage:"请输入正确的电话号码",
		validType:'mobile'
	});*/
}

/**
 * 设置自定义的验证类型
 */
$.extend($.fn.validatebox.defaults.rules, {
	codevalide : {
		validator : function(value, param){
			var check=false;
			if(isNew){
				
			}
			$.ajax({
				url:basePath + "/apron_punish_dataaccess_validate.json",
				type:'post',
				dataType:'json',
				async:false,
				data:{accessCode:value,modifyCode:(isNew==false?accessCode:'')},
				success:function(data){
					if(data.resultCode==1){
						check=true;
					}else{
						check=false;
					}
				}
			});
			return check;
		},
		message : "访问编码已经存在"
	},
});

/**
 * 显示详情
 */
function detail(index){
	var row = $("#accessTable").datagrid('getRows')[index];
	row.isUsed = row.isUsed==1?"有效":"无效";
	Common.loadDataForDOM(row,"#AccessDetail","span","name");
	//设置参数描述、返回值描述数组并加载到详情数据中
	setArrParam(row);
	$("#detail_param_table").datagrid("loadData",arrParam);
	setArrBack(row);
	$("#detail_back_table").datagrid("loadData",arrBack);
	
	$('#AccessDetail').dialog('open');
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
 * 初始化datagrid
 * @param bPath
 * @param loadUrl
 * @param div
 * @param headHeight
 * @param params
 * @returns {___anonymous4375_4376}
 */
function createDatagrid(bPath, loadUrl,divHeight, headHeight, params ,divName){
	var hHeight = (typeof headHeight != "undefined") ? headHeight : 135;
	var rowCount = Math.floor((divHeight - hHeight)/25);
	var opts = {};
	opts['url'] = bPath + loadUrl;
	opts['pageList'] = [5, 10];
	opts['pageSize'] = rowCount;
	opts['pageList'].push(rowCount);
	opts['queryParams'] = params;
	//当数据查询完成时，判断数据是否超过一页，如果少于一页，则不显示分页，否则显示分页
 	if(divName!=""){
 		opts['onLoadSuccess'] = function(data){
 	 		$("#"+divName+" .datagrid-body").css("overflow", "hidden");
 			if(data.total<=opts.pageSize){
 				$("#"+divName+" .datagrid-pager").hide();
 			}else{
 				$("#"+divName+" .datagrid-pager").show();
 			}
 		};
 	}
	return opts;
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
		console.log(param);
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
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，是否继续？", function(r) {
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
	//清空数组
	arrParam=[];
	//设置参数描述数组
	if (data.parameterDesc != null) {
		var arr1 = data.parameterDesc.split(",");
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				var arr2 = arr1[i].split("-");
				var param={};
				param.paramName = arr2[0];
				param.paramDesc = arr2[1];
				param.paramType = arr2[2];
				param.paramTestValue = arr2[3];
				arrParam.push(param);
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
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，是否继续？", function(r) {
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
	//清空数组
	arrBack=[];
	//设置返回值描述数组
	if (data.returnedDesc != null) {
		var arr1 = data.returnedDesc.split(",");
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				var arr2 = arr1[i].split("-");
				var back={};
				back.backName = arr2[0];
				back.backDesc = arr2[1];
				back.backType = arr2[2];
				back.backTestValue = arr2[3];
				arrBack.push(back);
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
