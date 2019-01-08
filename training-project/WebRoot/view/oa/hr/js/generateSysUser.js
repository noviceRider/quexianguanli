//form表单弹窗属性
//var options = {
//    width: 800,
//    height: 500,
//    title: '分配系统帐号',
//    buttons: '#sc_form'
//};

//当前操作员工信息
var empInfoTop=null;

//角色ID列表
var roleIds=[];

//新增或修改用户信息
var isNew;

/**
 * 初始化form表单
 */
function initPage(empId) {
	//初始化角色ID列表
	rolesIds=[];
	
    var infoType = '1002';//员工电子资料
    //通过业务主键查询员工信息
    $.post(basePath + "/dataaccess.json", {
        empId: empId,
        infoType: infoType,
        accessId: '1316'
    }, function (data) {
        $("#detailPhoto").attr("src", basePath + "/gmodule_resmanage_filedown.json?id=" + data.resId + "");
    });

    // 加载角色列表
    $.post(basePath + "/dataaccess.json", {
        accessId: "9301"
    }, function (data) {
        var roles = data.rows;
        if (roles != null) {
            var $td = $("#sysUserRoles");

            for (var i in roles) {
                var role = roles[i];
                $td.append('<label  style="width: 25%; display: inline-block;"><input onchange="selectRole(this)" type="checkbox" name="roleIds" value="' + role.roleId + '" />' + role.roleName + '</label>');
            }
        } else {
            $("#roles").html("<span color='red'>角色信息加载失败</span>");
        }
    });

    $.post(basePath + "/dataaccess.json", {
        empId: empId,
        accessId: '1318'
    }, function (data) {
    	
        data.deptNameStr = data.deptId;
        empInfoTop=data;
        //加载工作岗位
        $.post(basePath + "/dataaccess.json", {
            deptId: data.deptId,
            accessId: '1113'
        }, function (result) {
            var postNames = [];

            $.each(result.rows, function () {
                postNames.push(this.postName);
            });

            data.postName = postNames.join(',');

            //将员工信息显示到dialog中;
            Common.loadDataForDOM(data, "#sysUser", "span", "name");
            
            //用户信息
            if(data.userId!=null && data.userId!="" && data.userId!=undefined){
            	//显示用户ID 不可修改用户ID
            	$("#userIdSpan").show();
            	$("#userIdInput").hide();
            	$("#isUpdatePwdCheckbox").show();
            	isNew=false;
            	$("#userIdSpan").text(data.userId);
                if(data.modDefaultPwd==1){
                	$("#modDefaultPwd").prop("checked",true);
                }else{
                	$("#modDefaultPwd").prop("checked",false);
                }
                
                if(data.modPwdSomedays==1){
                	$("#modPwdSomedays").prop("checked",true);
                }else{
                	$("#modPwdSomedays").prop("checked",false);
                }
                
                //勾选原有角色
                if(data.roleIdList!=undefined){
                	var roleIdList=data.roleIdList.split(",");
                    for(var i=0;i<roleIdList.length;i++){
                    	$("input[type='checkbox'][value='"+roleIdList[i]+"']").prop("checked",true);
                    	roleIds.push(roleIdList[i]);
                    }
                }
                
                $("#tip").text("已存在关联用户，修改关联用户");
            }else{
            	//控制控件隐藏于显示  直接输入用户ID
            	$("#userIdSpan").hide();
            	$("#userIdInput").show();
            	$("#isUpdatePwdCheckbox").hide();
            	//userId验证
            	$("#userId").textbox({
            		required:true,
            		missingMessage:"用户编号不能为空",
            		invalidMessage:"用户编号已经存在",
            		validType:"remoteValid['" + basePath + "/businesslogic.json', 'userId', {logicId: '09.01.03'}]"
            	});
            	
            	isNew=true;
            	
            	$("#tip").text("不存在关联用户，新增关联用户");
            }
        });
    });
    
  //密码验证
    $("#password").textbox({
    	required:true,
		missingMessage:"密码不能为空",
		invalidMessage:"只能输入6-20个字母、数字、下划线  ",
		validType:(/^(\w){6,20}$/).test($("#password").textbox("getValue"))
    });
}

/**
 * 完成帐号分配，结束流程
 */
function submit() {
    $.messager.confirm("确认", '是否确认修改员工所属系统用户？', function (r) {
        if (r) {
            var postData = {};
            
          //用户关联角色
            if ($.isArray(roleIds)) {
                postData.roleIds = roleIds.join(',');
            }
           
            //密码策略参数
            if($("#modDefaultPwd").prop("checked")==true){
            	postData.modDefaultPwd=1;
            }else{
            	postData.modDefaultPwd=0;
            }
            
            if($("#modPwdSomedays").prop("checked")==true){
            	postData.modPwdSomedays=1;
            }else{
            	postData.modPwdSomedays=0;
            }
            
            if(empInfoTop.userId!=null && empInfoTop.userId!="" && empInfoTop.userId!=undefined){
            	postData.userId=empInfoTop.userId;
            }else{
            	postData.userId=$("#userId").textbox("getValue");
            }
            
            postData.password= $("#password").textbox("getValue");
            postData.isNew=isNew;
            postData.empId=empInfoTop.empId;
            postData.logicId='04.03.07';
            
            $.ajax({
                type: "post",
                url: basePath + "/businesslogic.json",
                data: postData,
                success: function (data) {
                    if (data.resultCode == 1) {
                        //操作成功
                    	cancelSysUser();
                    	$("#resTable").datagrid("reload");
                        $.messager.alert("提示信息", "处理完成！", "info");
                    } else {
                        $.messager.alert("错误信息", "处理失败！", "error");
                    }
                }
            });
        }
        ;
    });
}

/**
 *取消修改员工关联用户信息 
 */
function cancelSysUser(){
	$("#sysUser").dialog("close");
}

/**
 * 选择用户关联角色
 * @param c 点击的checkbox document对象
 */
function selectRole(c){
	
	
	if($(c).prop("checked")==true){
		roleIds.push($(c).val());
	}else{
		for(var i=0;i<roleIds.length;i++){
			if($(c).val()==roleIds[i]){
				roleIds.splice(i, 1);
			}
		}
	}
}

/**
 * 是否修改密码
 * @param c 点击的复选框document
 */
function isUpdatePwd(c){
	$("#password").textbox("setValue","");
	if($(c).prop("checked")){
		$("#password").textbox("enable");
		
		//密码验证
	    $("#password").textbox({
	    	required:true,
			missingMessage:"密码不能为空",
			invalidMessage:"只能输入6-20个字母、数字、下划线  ",
			validType:"password"
	    });
	}else{
		$("#password").textbox("disable");
		$("#password").textbox({
	    	required:false,
			missingMessage:"密码不能为空",
	    });
	}
}

/**
 * 信息验证函数
 */
$.extend($.fn.textbox.defaults.rules, {
    //密码验证
	password:{
		validator:function(value){
			console.log(value);
			var validateCodes=false;
			if(/^(\w){6,20}$/.test(value)){
				validateCodes=true;
			}else{
				validateCodes=false;
			}
			return validateCodes;
		}
	},
});