/**
 * 
 */

//form表单弹窗属性
var options={
	width:'60%',
	height:'80%',
	title:'商品出售',
	buttons:"#sale_form"
};


//当前登录用户信息
var user;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的收货业务
var auditBusi;

//业务关联的商品信息
var goodsInfo;

//当前员工
var empInfo;

/**
 * 初始化
 * @param row 典当的商品数据
 */
function initPage(){
	//获取当前登录用户信息并赋值给全局变量user
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			//得到用户
			user = data.user;
		}
	});
	
	//获取当前用户员工信息
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		data: {logicId:"04.06.02"},
		async:false,
		success:function(data){
			//得到用户
			empInfo = data.empInfo;
		}
	});
	
	
	//从任务信息中取出业务主键作为业务id，查询信息
	var agreementCode = _taskData.businessKey;
	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.05.02",agreementCode:agreementCode},
		success:function(data){
			
			//典当业务信息
			var consignSaleInfo=data.consignSaleInfo;
			
			//全局变量赋值
			auditBusi=consignSaleInfo;
			
			
			
			
			
			//收货协议信息回显
			$("#consignSaleAuditForm").form("load",consignSaleInfo);
//			consignSaleInfo.bottomPrice=consignSaleInfo.bottomPrice+"元";
//			consignSaleInfo.serviceCharge=consignSaleInfo.serviceCharge+"%";
			$("#bottomPrice").val(priceFormatter(consignSaleInfo.bottomPrice)+"元");
			$("#serviceCharge").val(consignSaleInfo.serviceCharge+"%");
			
			//去除input边框
			$("#consignSaleAuditForm input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#consignSaleAuditForm input").attr("readonly",true);
			
			
			//会员信息
			var memberInfo=data.memberInfo;
			
			$("#consignSaleRevokeMemberInfo_form").form("load",memberInfo);
			//去除input边框
			$("#consignSaleRevokeMemberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#consignSaleRevokeMemberInfo_form input").attr("readonly",true);
			
			
			//商品信息
			goodsInfo=data.goodsInfo;
			
			//页面商品数据回显
			$("#consignSaleRevokegoodsIdPP").text(goodsInfo.goodsId);
			$("#consignSaleRevokegoodsNamePP").text(goodsInfo.goodsName);
			$("#consignSaleRevokeofficialPricePP").text(priceFormatter(goodsInfo.officialPrice));
			$("#consignSaleRevokevaluationPricePP").text(priceFormatter(goodsInfo.valuationPrice));
			$("#consignSalesellingPricePP").text(priceFormatter(goodsInfo.pawnPrice));
			$("#consignSaleRevokefirstPricePP").text(priceFormatter(goodsInfo.firstPrice));
			$("#consignSalePurchaseAmountPP").text(priceFormatter(auditBusi.purchaseAmount));
		}
	});
	
	//操作记录
	$("#consignSaleRevokeShowhistoryLogTable").datagrid({
		url:basePath+"/dataaccess.json",
		method:"post",
		fitColumns:true,
		rownumbers:true,
		queryParams:{accessId:"63206",busiId:auditBusi.agreementCode,busiType:"04"},
		columns:[[
			         {field:'busiLogId',hidden:true,title:'记录编号',width:'15%',sortable:true,alias:'busi_log_id',halign:'center',align:'left'},
			         {field:'busiId',title:'业务编号',hidden:true},
			         {field:'empId',title:'操作人',width:"25%",sortable:false,halign:'center',align:'left'},
			         {field:'operation',title:'操作类型',width:'25%',sortable:false,alias:'',halign:'center',align:'center'},
			         {field:'operateTime',title:'操作时间',width:'37%',sortable:false,alias:'',halign:'center',align:'center'},
			     ]]
	});
};

/**
 *放款方式格式化 
 */
function payTypeFormatter(value){
	var result="";
	
	//从数据字典获取数据
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:{typeCode:"PC_PAWN_PAY_TYPE",accessId:3301},
		method:"post",
		async:false,
		success:function(data){
			payTypeObj=data.rows;
		}
	});
	
	//返回格式化后的数据
	for(var i=0;i<payTypeObj.length;i++){
		if(payTypeObj[i].dictCode==value){
			result=payTypeObj[i].dictDesc;
			break;
		}
	}
	
	return result;
}

/**
 *审核操作 
 *@param revoke (1.撤回 0.续期)
 */
function revoke(revoke){
	//验证是否通过
	var validFlag=true;
	
	//构造参数
	var auditParams={};
	auditParams.logicId="03.06.04";
	
	auditParams.consignSaleId=auditBusi.consignSaleId;
	
	auditParams.revoke=revoke;
	if(revoke==1){
		//修改状态为撤回
		auditParams.consignSaleStat="05";
		auditParams.operation="将寄卖到期商品撤回";
	}else if(revoke==0){
		//修改状态为销售中
		auditParams.consignSaleStat="03";
		auditParams.operation="为寄卖到期商品续期";
		auditParams.expiredTime=$("#renewalTime").datetimebox("getValue");
	}
	
	//操作记录
	auditParams.busiType="04";
	auditParams.busiId=auditBusi.agreementCode;
	auditParams.empId=empInfo.empId;
	auditParams.createBy=user.userId;
	auditParams.modifyBy=user.suerId;
	
	//商品信息
	auditParams.goodsId=goodsInfo.goodsId;

	//流程实例ID
	auditParams.taskId=_taskData.id;
	
	if(revoke==0){
		//判断续期时间
		if((auditParams.expiredTime==null || auditParams.expiredTime=="")){
			$.messager.alert("提示信息","请填写续期时间!!","info");
			validFlag=false;
		}else if(new Date(auditParams.expiredTime)<new Date()){
			$.messager.alert("提示信息","续期时间不能小于当前时间!!","info");
			validFlag=false;
		}
	}
	
	if(validFlag==true){
		$.messager.confirm("确认信息","是否确认"+auditParams.operation,function(r){
			if(r){
				//调用业务逻辑完成审核
				$.ajax({
					url:basePath+"/businesslogic.json",
					data:auditParams,
					method:"post",
					async:false,
					success:function(data){
						if(data.resultCode==1){
							//刷新列表并关闭弹窗
							refresh();
							cancelRenewal();
							$.messager.alert("提示信息","办理完成","info");
						}else{
							$.messager.alert("错误信息","办理失败，请重试或联系管理员","error");
						}
					}
				});
			}
		});
	}
}


/**
 *续期 
 */
function renewal(){
	//清空
	$("#renewalTime").datetimebox("setValue","");
	
	$("#renewalDig").dialog({
		title:"寄卖续期",
		width:"220px",
		height:"auto",
	}).dialog("open");
}

function cancelRenewal(){
	$("#renewalDig").dialog("close");
	
}



/** 
 * 还款日期 
 * startDate:起始日期 
 * valueTime:有效天数 
 */  
function transferCouponValueTime(startDate,valueTime){  
 var date = new Date(startDate);
 
 var newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+valueTime,date.getHours(),date.getMinutes(),date.getSeconds());  
 var year1 = date.getFullYear();  
 var month1 = date.getMonth()+1;  
 var day1 = date.getDate();  
 var year2 = newDate.getFullYear();  
 var month2 = newDate.getMonth()+1;  
 var day2 = newDate.getDate();
 //year1+"-"+month1+"-"+day1+"-"+
 
 return year2+"-"+month2+"-"+day2+" "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds();  
   
}

/**
 *价格格式化
 */
function priceFormatter(value){
	if(value!=null){
		value=""+value;
		if(value.split(".")[1]=="" || value.split(".")[1]==null ||value.split(".")[1]==undefined){
			value=value+".00";
		}
	}
	return value;
}