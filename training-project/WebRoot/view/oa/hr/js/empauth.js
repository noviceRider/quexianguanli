/**
 *权限设置页面JS方法 
 */

/**
 *记录当前选择的员工 
 */
var currEmp=null;

$(function(){
	//创建员工单选插件
	$("#selectEmp").empSingleSelect("empSingleSelect",{
		width:"160px",
		url:basePath+"/dataaccess.json",
		params:{
			accessId:"1301"
		},
		id:"empSingleSelect",
		name:"empObj",
		async:true,
		method:"post",
		//选择数据时判断员工现有数据权限并勾选对应项
		onSelect:function(emp){
			currEmp=emp;
			//获取选择的员工数据权限
			
			//构造参数
			var getAuthParam={};
			getAuthParam.empId=emp.empId;
			getAuthParam.accessId="1403";
			
			//调用数据访问
			$.ajax({
				url:basePath+"/dataaccess.json",
				data:getAuthParam,
				method:"post",
				async:false,
				success:function(data){
					//默认选择员工现有数据访问权限
					$("#selectAuthority").radioGroup("selectOneByValue",data.dataScope);
				}
			});
			
			//获取选择员工可选的用户列表和已选的用户列表
			queryRoleLists(emp.empId);
			
		}
	});
	
	//创建权限选择插件
	$("#selectAuthority").radioGroup("radioGroup",{
		width:"500px",
		url:basePath+"/dataaccess.json",
		method:"post",
		params:{
			accessId:"3301",
			typeCode:"DATA_SCOPEE"
		},
		async:true,
		name:"dataScope",
		valKey:"dictCode",
		textKey:"dictDesc",
		data:{},
		onSelect:function(obj){
			
		},
		height:"auto"
	});
});


/**
 * 查询用户列表
 * @param empId 员工ID号
 */
function queryRoleLists(empId){
	//获取当前选择的角色信息数组
	$("#canSelectUser").empty();
	$("#selectedUser").empty();
	
	//构造获取用户列表的参数
	var findUserListParams={};
	findUserListParams.empId=empId;
	findUserListParams.accessId="9309";
	$.ajax({
		type:"post",
		data:findUserListParams,
		url:basePath + "/dataaccess.json",
		success:function(data){
			transfer();		
			//将查询结果循环添加到可选成员选择框中
			for(var i in data.rows) {
				$("#canSelectUser").append("<option value="+data.rows[i].userId+">"+data.rows[i].userName+"</option>");
			}
		}
	});
	
	//获取员工已经关联的用户列表
	var getUserAndEmpRelParams={};
	getUserAndEmpRelParams.accessId="1405";
	getUserAndEmpRelParams.empId=empId;
	$.ajax({
		type:"post",
		data:getUserAndEmpRelParams,
		url:basePath + "/dataaccess.json",
		success:function(data){
			transfer();		
			//将查询结果循环添加到可选成员选择框中
			for(var i in data.rows) {
				$("#selectedUser").append("<option value="+data.rows[i].userId+">"+data.rows[i].userName+"</option>");
			}
		}
	});
}

/**
* 两个Select之间进行数据转移的函数
**/
transfer = function() {
	//获取左右选择框对象 
	var leftSel  = $("#canSelectUser");
	var rightSel  = $("#selectedUser");
	//可选用户上面双击就右移
	$('#canSelectUser').dblclick(function() {	
	    leftSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(rightSel); 
	    });
	});

	//已选用户上面双击就左移
	$('#selectedUser').dblclick(function() {
		rightSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(leftSel); 
	    });
	});
	
	//全部从左边移到右边
	$('#allToRight').click(function() {
		$('#canSelectUser option').each(function(){ 
			 $(this).remove().appendTo(rightSel); 
		});
	});
	
	//将选中的项从左边移到右边
	$('#toRight').click(function() {
	    leftSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(rightSel); 
	    }); 
	});

	//全部从右边移到左边
	$('#allToLeft').click(function() {
		$('#selectedUser option').each(function(){ 
			 $(this).remove().appendTo(leftSel); 
		});
	});
	
	//将选中的项从右边移到左边
	$('#toLeft').click(function() {
	    rightSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(leftSel); 
	    });
	});
};


/**
 *确认权限设置 
 */
function doSave(){
	//选择的员工
	var selectEmp= $("#selectEmp").empSingleSelect("getSelectedItem");
	
	//选择的权限
	var selectAuth=$("#selectAuthority").radioGroup("getSelectItem");
	
	//选择的用户ID
	var userIdList = $("#selectedUser option").map(function(){return $(this).val();}).get().join(",");
	
	//页面验证，初始化验证结果，默认验证成功
	var validResult=1;
	
	if(!$("#selectEmp").empSingleSelect("isEmpty")){
		$.messager.alert("提示信息","请选择员工","info");
		validResult=0;
	}else if(userIdList==null ||userIdList=="" || userIdList==undefined){
		$.messager.alert("提示信息","请选择员工关联用户","info");
		validResult=0;
	}else if(selectAuth==null || selectAuth==undefined || selectAuth==""){
		$.messager.alert("提示信息","请选择员工数据权限","info");
		validResult=0;
	}
	
	if(validResult==1){
		//向员工和用户关联表添加数据
		//构造参数
		var addUserAndEmpRelParam={};
		addUserAndEmpRelParam.logicId="04.06.01";
		addUserAndEmpRelParam.empId=selectEmp.empId;
		addUserAndEmpRelParam.userIdList=userIdList;
		addUserAndEmpRelParam.dataScope=selectAuth.dictCode;
		
		//调用数据访问添加员工和用户关联信息
		$.ajax({
			url:basePath+"/businesslogic.json",
			data:addUserAndEmpRelParam,
			method:"post",
			success:function(data){
				if(data.resultCode==1){
					$.messager.alert("提示信息","保存成功","info");
				}else{
					$.messager.alert("错误信息","保存过程中出错,请重试或联系管理员","error");
				}
			}
		});
	}
}

/**
 *可选用户条件查询
 *
 */
function queryCanSelectUser(){
	if(currEmp==null){
		$.messager.alert("提示信息","请先选择员工","info");
	}else{
		//构造数据访问参数
		var params={};
		params.accessId="9309";
		params.empId=currEmp.empId;
		params.keyWord=$("#canSelectUserKeyWords").textbox("getValue");
		$.ajax({
			url:basePath+"/dataaccess.json",
			data:params,
			method:"post",
			success:function(data){
				$("#canSelectUser").empty();
				transfer();	
				
				//选择的用户ID
				var userIdList = $("#selectedUser option").map(function(){return $(this).val();}).get().join(",");
				userIdList=userIdList.split(",");
				
				//将查询结果循环添加到可选成员选择框中
				for(var i in data.rows) {
					//标志用户是否已经存在于选择栏中，默认不存在
					var isSelected=false;
					
					for(var j in userIdList){
						if(data.rows[i].userId==userIdList[j]){
							isSelected=true;
							break;
						}
					}
				
					if(isSelected==false){
						$("#canSelectUser").append("<option value="+data.rows[i].userId+">"+data.rows[i].userName+"</option>");
					}
					
				}
			}
		});
	}
}