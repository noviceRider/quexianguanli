var user;//当前登录用户
var isNew = false;//判断是增加还是修改
var url;//增加、修改的请求地址
var typeCode;//修改信息使用

$(function (){ 
	//操作分类
	$.ajax({
		url: basePath + "/gmodule_datadict_findall.json",
		type: 'post',
		data: {"typeCode":"DA_OP_TYPE"},  
	    dataType:"json",
	    async:false,
		success: function(data) {
			//加载combox数据
			$('#am_opType').combobox("loadData", data.rows);
		}
	});
	//初始化数据网格
	$("#typeTable").datagrid(createDatagrid(basePath, "/apron_punish_accesstype_findpage.json",document.body.clientHeight, 135, "",'typeDiv'));
	//给数据网格设置双击事件
	$("#typeTable").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消素有选择行
			$("#typeTable").datagrid("uncheckAll");
			//选中当前行
			$("#typeTable").datagrid("checkRow",index);
		},
		onDblClickRow:function(index,row){
			//取消素有选择行
			$("#typeTable").datagrid("uncheckAll");
			//选中当前行
			$("#typeTable").datagrid("checkRow",index);
			modifyType(row);
		}
	});
});

/**
 * 查询
 */
function searchType(){
	var params =  $("#form_search").serializeObject();
	$("#typeTable").datagrid('reload',params);
}

/**
 * 添加数据访问类型
 */
function addType(){
	isNew=true;
	$('#am_form').form('reset');
	$('#amType').dialog({title:'增加数据访问类型'}).dialog('open');
	url=basePath + "/apron_punish_accesstype_add.json";
	validate();
	//新增默认有效，隐藏显示是否有效
	$('#hide1').hide();
	$('#hide2').hide();
	$('#am_typeCode').textbox({'editable':true});
	setTimeout(function(){$("#am_typeCode").textbox().next('span').find('input').css('background','#fff');},200);
	//默认焦点时间
	setTimeout(function(){
		$('#am_typeCode').textbox().next("span").find('input').first().focus();
	},300);
}

/**
 * 数据访问类型的保存
 */
function doSave(){
	var valid = $("#am_form").form("validate");
	var obj = $("#am_form").serializeObject();
		if(valid){
			$.ajax({
				type:'post',
				url: url,
				data:obj,
				dataType:'json',
				async:false,
				success: function(data){
					if(data.resultCode=="1"){
						$("#typeTable").datagrid('reload');
						//关闭对话框																			
						$('#amType').dialog('close');
						//清空数据
						$("#am_form").form("reset");
					} else{
						$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
					}
				}
			});
		}
}

/**
 *  修改
 */
function modifyType(rowObj){
	$('#hide1').show();
	$('#hide2').show();
	var row = rowObj ==null ?$('#typeTable').datagrid('getSelected'):rowObj;
	if(row == null){
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		isNew = false ;
		typeCode = row.typeCode;
		//清空数据
		$("#am_form").form("reset");
		url=basePath + "/apron_punish_accesstype_modify.json";
		$('#amType').dialog({title:'修改数据访问类型'}).dialog('open');
		validate();
		$('#am_typeCode').textbox({
			required:true,
			missingMessage:'类型编码不能为空',
			validType:"codevalide",
			invalidMessage:'类型编码已经存在'
		});
		$('#am_typeCode').textbox({'editable':false});
		setTimeout(function(){$("#am_typeCode").textbox().next('span').find('input').css('background','#ccc');},200);
		//默认焦点时间
		setTimeout(function(){
			$('#am_accessName').textbox().next("span").find('input').first().focus();
		},300);
		$("#am_form").form("load",row);
	}
}

/**
 *  删除数据访问类型
 */
function removeType(){
	var rows = $('#typeTable').datagrid('getSelections');
	if(rows.length<1){
		$.messager.alert("提示信息", "请选择要删除的数据", "error");
	}else{
		$.messager.confirm("提示信息","你确定要删除这条数据吗？",function(r){
			if(r){
				for (var i = 0; i < rows.length; i++) {
					$.ajax({
						url:basePath+"/apron_punish_accesstype_delete.json",
						data:{typeCode:rows[i].typeCode},
						type:'post',
						dataType:'json',
						async:false,
						success:function(data){
							if(data.resultCode=="1"){
								$("#typeTable").datagrid('reload');
							} else if(data.resultCode=="0"){
								$.messager.alert("提示信息", "操作失败了，请联系管理员", "error");
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
 * 格式化时间格式
 * @param value
 * @returns
 */
function timeformatter(value){
	if(Date.parse(value)){
		return new Date(Date.parse(value)).pattern("yyyy-MM-dd HH:mm:ss");
	}else{
		return "";
	}
}

/**
 * 添加验证
 */
function validate(){
	$("#am_typeCode").textbox({
		required:true,
		missingMessage:"类型编号不能为空",
		validType:"codevalide",
		invalidMessage:'设备编码已经存在'
	});
	$("#am_opType").combobox({
		required:true,
		missingMessage:"请选择操作分类"
	});
	$("#am_accessUrl").textbox({
		required:true,
		missingMessage:"URL不能为空"
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
				url:basePath + "/apron_punish_accesstype_validate.json",
				type:'post',
				dataType:'json',
				async:false,
				data:{typeCode:value,modifyCode:(isNew==false?typeCode:'')},
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
		message : "类型编码已经存在"
	},
});

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