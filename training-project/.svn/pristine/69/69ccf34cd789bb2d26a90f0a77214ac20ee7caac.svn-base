var saveLogicId = "09.01.02";//新增或修改保存时请求的url
var isNew = true;//是否为新增，true:新增，false：修改

/**
 * 功能:初始化
 * 参数：无
 */
$(function(){
	//加载用户列表
	$("#dg").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId:"9101"}));
	
	//加载部门信息
	loadCombotree("deptId", "1004");
	
	//加载角色信息
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:"post",
		data:{accessId:"9301"},
		dataType:"json",
		success:function(data){
			var roles = data.rows;
			if(roles!=null){
				var td = $("#roles");
				var rows = roles.length/4;
				var $table = $("<table id='tb_roles' style='width:100%'></table>").appendTo(td);
				for(var i=0;i<rows;i++){
					$("<tr><td style='width:25%'></td><td style='width:25%'></td><td style='width:25%'></td><td style='width:25%'></td></tr>").appendTo($table);
				}
				
				for(var i in roles){
					var $tds = $("#tb_roles td");
					var checkbox = $("<input type='checkbox' name='roleIds'/>")
					.val(roles[i].roleId)
					.attr("id",roles[i].roleId)
					.appendTo($tds[i]);
					
					var lable = $("<label></label>")
					.attr("for",roles[i].roleId)
					.text(roles[i].roleName)
					.appendTo($tds[i]);
				}
			}else{
				$("#roles").html("<span color='red'>角色信息加载失败</span>");
			}
		},
		error:function(){
			$("#roles").html("<span color='red'>角色信息加载失败</span>");
		}
	});
});

/**
 * 功能：条件查询
 * 参数：无
 */
function doUserSearch(){
	var params = $("#form_search").serializeObject();
	params.accessId = "9101";
	$("#dg").datagrid("load", params);
}

/**
 * 功能：打开新增对话框
 * 参数：无
 */
function doAdd(){
	isNew = true;//新增
	saveLogicId = "09.01.02";//新增请求的业务逻辑ID
	userValid();//初始化校验
	$("[name='userId']").attr("readonly",false);
	$("[name='userId']").css("background","");
	$("#row_isLock").css("display","none");
	$("#form_save").form("reset");
	
	$("#dlg_save").show().dialog({
		iconCls:"icon-save",
		title:"新增用户信息",
		width:680,
		height:"auto",
		modal:true,
		buttons:"#btn_dlg",
		onClose:function(){
			$("#form_save").form("reset");
		}
	});
	
	setTimeout(function(){
		$("[name='userId']").focus();
	}, 300);
}

/**
 * 打开修改对话框
 * 参数：无
 */
function doModify(){
	isNew = false;//修改
	var rows = $("#dg").datagrid("getChecked");
	if(rows==null || rows.length==0){
		$.messager.alert("提示信息","请输入要修改的用户","info");
		return;
	}else if(rows.length>1){
		$.messager.alert("提示信息","一次只能修改一个用户","info");
		return;
	}
	var row = rows[0];
	
	//加载所属角色
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{userId:row.userId,accessId:"9103"},
		async:false,
		success:function(data){
			var roles = data.rows;
			var roleIds = [];
			for(var i in roles){
				roleIds.push(roles[i].roleId);
			}
			row.roleIds = roleIds;
		}
	});
	row.password = "%%password%%";
	$("#form_save").form("load",row);
	
	$("[name='userId']").attr("readonly","readonly");
	$("[name='userId']").css("background","lightgray");
	$("#row_isLock").css("display","");
	
	//设置修改请求的业务逻辑ID
	saveLogicId = "09.01.01";
	
	userValid();
	//显示对话框
	$("#dlg_save").show().dialog({
		iconCls:"icon-save",
		title:"修改用户信息",
		width:680,
		height:"auto",
		modal:true,
		buttons:"#btn_dlg",
		onClose:function(){
			$("#form_save").form("reset");
		}
	});
	
	setTimeout(function(){
		$("[name='userName']").focus();
	}, 300);
}

/**
 * 添加作业单位
 */
function doAddUnit(){
	//给数据网格加载数据
	$("#workunit_dg").datagrid({
		method:"post",
		url:basePath+"/apron_punish_workunit_list.json",
		onDblClickRow:function(index,row){
			selectWorkUnit();
		}
	});
	$('#choose_workunit_dlg').dialog('open');
}

/**
*选择选中的岗位的数据
*/
function selectWorkUnit(){
		//获取选择的数据
		var row=$("#workunit_dg").datagrid("getSelected");
		if(row==null){
			$.messager.alert("提示信息","请选择数据");
		}else{
			//关闭对话框
			$("#choose_workunit_dlg").dialog("close");
			$("#workunit_choose").hide();
			$("#am_unit").textbox('setValue',row.unitName);
			unitName = row.unitName;
			unitCode = row.unitCode;
		}
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
* 取消选择作业部门数据退出框
*/
function cancelSelectWorkUnit(){
	//关闭对话框
	$("#choose_workunit_dlg").dialog("close");
	$("#workunit_choose").hide();
}

/**
 * 功能：保存修改或添加
 * 参数：无
 */
function doSave(){
	var formData = $("#form_save").serializeObject();
	var roleIds = formData.roleIds;
	if(roleIds!=null){
		if(typeof roleIds=="string"){
			
		}else if(roleIds){
			formData.roleIds = roleIds.join(",");
		}
	}
	formData.logicId = saveLogicId;
	if($("#form_save").form("validate")){
		$.ajax({
			url:basePath + "/businesslogic.json",
			type:"post",
			dataType:"json",
			data:formData,
			success:function(data){
				if(data.resultCode == 1){
					$("#dg").datagrid("reload");
					doCancel();
				}else{
					$.messager.alert("提示信息","保存失败","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误","error");
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
 * 功能：格式化genderId列的显示效果
 * 参数：
 * 	value：某行该列的值
 * 	row：该行的数据
 * 	index：该行的下标genderFormatter
 */
function genderFormatter(value, row, index){
	if(value=="O"){
		return  "保密";
	}else if(value=="M"){
		return  "男";
	}else if(value=="F"){
		return  "女";
	}
}

/**
 * 功能：删除选中的用户
 * 参数：无
 */
function doDelete(){
	var ids = Common.getSelectedIds("#dg", "userId", "userId");
	if(ids==null||ids.length==0){
		$.messager.alert("提示信息","请选择要删除的数据！","info");
		return;
	}
	var userIds = [];
	for(var i in ids){
		userIds.push(ids[i].value);
	}
	
	$.messager.confirm("确认", "是否将选择的用户信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:{userIds:userIds.join(","),logicId:"09.01.04"},
				success:function(data){
					//更新表格中的数据
					if(data.resultCode == 1){
						//更新表格中的数据
						$("#dg").datagrid("reload");
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
	//onClickRow(rowIndex,rowData);
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

/**
 * 功能：输入校验，新增时输入的用户编号是否存在
 * 参数：无
 */
function userValid(){
	$("[name='userId']").validatebox({
		required:true,
		missingMessage:"用户编号不能为空",
		invalidMessage:"用户编号已经存在",
		validType:"remoteValid['" + basePath + "/businesslogic.json', 'userId', {logicId: '09.01.03'}]"
	});
	
	if(isNew){
		$("[name='userId']").validatebox("enableValidation");
	}else{
		$("[name='userId']").validatebox("disableValidation");
	}
	
	$("[name='userName']").validatebox({required:true,missingMessage:"用户名不能为空"});
	$("[name='password']").validatebox({required:true,missingMessage:"登录密码不能为空"});
	$("[name='genderId']").validatebox({required:true,missingMessage:"性别不能为空"});
	
	$("[name='email']").validatebox({invalidMessage:"电子邮件格式错误",validType:"email"});
	$("[name='mobile']").validatebox({invalidMessage:"移动电话格式错误",validType:"number"});
	$("[name='officeTel']").validatebox({invalidMessage:"工作电话格式错误",validType:"number"});
	
}

//扩展easyui validatebox校验规则
$.extend($.fn.validatebox.defaults.rules, {
    number: {
        validator: function (value) {
            return /^[0-9]*$/i.test(value);
        },
        message: '格式不正确'
    }
});
