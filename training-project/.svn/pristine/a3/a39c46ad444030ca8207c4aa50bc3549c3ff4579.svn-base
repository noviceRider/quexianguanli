/**
 * 
 *典当流程任务节点JS
 */

//form表单弹窗属性
var options={
	width:'60%',
	height:'80%',
	title:'收货协议审核',
	buttons:'#audit_form'
};


//当前登录用户信息
var user;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的收货业务
var auditBusi;

//当前用户对应员工
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
		data:{logicId:"06.03.03.02",agreementCode:agreementCode},
		success:function(data){
			
			//典当业务信息
			var purchaseInfo=data.purchaseInfo;
			
			//全局变量赋值
			auditBusi=purchaseInfo;
			
			//purchaseInfo.purchaseAmount=purchaseInfo.purchaseAmount+"元";
			//purchaseInfo.payType=payTypeFormatter(purchaseInfo.payType);
			//收货协议信息回显
			$("#auditPurchaseForm").form("load",purchaseInfo);
			$("#purchaseAmount").val(priceFormatter(purchaseInfo.purchaseAmount)+"元");
			$("#payType").val(payTypeFormatter(purchaseInfo.payType));
			
			//去除input边框
			$("#auditPurchaseForm input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#auditPurchaseForm input").attr("readonly",true);
			
			//租售信息回显
			if(purchaseInfo.isRentable==1){
				$("#isRentableP").text("可租");
			}else{
				$("#isRentableP").text("不可租");
			}
			
			if(purchaseInfo.isSalable==1){
				
				$("#isSalableP").text("可售");
			}else{
				
				$("#isSalableP").text("不可售");
			}
			
			//会员信息
			var memberInfo=data.memberInfo;
			
			$("#memberInfo_form").form("load",memberInfo);
			//去除input边框
			$("#memberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#memberInfo_form input").attr("readonly",true);
			
			
			//商品信息
			var goodsInfo=data.goodsInfo;
			
			//页面商品数据回显
			$("#goodsIdPP").text(goodsInfo.goodsId);
			$("#goodsNamePP").text(goodsInfo.goodsName);
			$("#officialPricePP").text(priceFormatter(goodsInfo.officialPrice));
			$("#valuationPricePP").text(priceFormatter(goodsInfo.valuationPrice));
			$("#pawnPricePP").text(priceFormatter(goodsInfo.pawnPrice));
			$("#firstPricePP").text(priceFormatter(goodsInfo.firstPrice));
		}
	});
	
	//操作记录
	$("#showhistoryIdentifyTable").datagrid({
		url:basePath+"/dataaccess.json",
		method:"post",
		fitColumns:true,
		rownumbers:true,
		queryParams:{accessId:"63206",busiId:auditBusi.agreementCode,busiType:"02"},
		columns:[[
			         {field:'busiLogId',hidden:true,title:'记录编号',width:'15%',sortable:true,alias:'busi_log_id',halign:'center',align:'left'},
			         {field:'busiId',title:'业务编号',hidden:true},
			         {field:'empName',title:'操作人',width:"30%",sortable:false,halign:'center',align:'left'},
			         {field:'operation',title:'操作类型',width:'20%',sortable:false,alias:'',halign:'center',align:'center'},
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
 *@param audit 审核结果(1.通过 0.不通过)
 */
function purchaseAuditOprate(audit){
	var tipText="";
	if(audit==1){
		tipText="通过审核";
	}else{
		tipText="不通过审核";
	}
	
	$.messager.confirm("确认信息","是否确认"+tipText,function(r){
		if(r){
			//构造参数
			var auditParams={};
			auditParams.logicId="03.04.01";
			auditParams.audit=audit;
			
			auditParams.purchaseId=auditBusi.purchaseId;
			
			if(audit==1){
				auditParams.operation="通过审核";
				auditParams.purchaseStat="03";
			}else{
				auditParams.operation="不通过审核";
				auditParams.purchaseStat="02";
			}
			
			auditParams.busiType="02";
			auditParams.busiId=auditBusi.agreementCode;
			auditParams.empId=empInfo.empId;
			auditParams.auditEmpId=empInfo.empId;
			auditParams.procInstId=auditBusi.procInstId;
			auditParams.auditor=user.userId;
			
			//流程批注
			auditParams.comment=$("#comment").textbox("getValue");
			
			auditParams.taskId=_taskData.id;
			
			
			//调用业务逻辑完成审核
			$.ajax({
				url:basePath+"/businesslogic.json",
				data:auditParams,
				method:"post",
				async:false,
				success:function(data){
					if(data.resultCode==1){
						refresh();
						$.messager.alert("提示信息","办理完成","info");
					}else{
						$.messager.alert("错误信息","办理失败，请重试或联系管理员","error");
					}
				}
			});
		}
	});
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