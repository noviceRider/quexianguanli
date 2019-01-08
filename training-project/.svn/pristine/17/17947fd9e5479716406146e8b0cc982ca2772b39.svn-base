/**
 * 
 *典当流程任务节点JS
 */

//form表单弹窗属性
var options={
	width:'60%',
	height:'80%',
	title:'典当协议审核',
	buttons:'#audit_form'
};

//是否是新增会员
var memberIsNew=1;

//当前登录用户信息
var user;

//当前用户对应员工
var empInfo;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的典当业务ID
var auditPawnId;

//赎回截止
var expiredTime;

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
	
	
	//从任务信息中取出业务主键作为典当业务id，查询信息
	var pawnId = _taskData.businessKey;
	auditPawnId=pawnId;
	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.02.03",pawnId:pawnId},
		success:function(data){
			//典当业务信息
			var pawnInfo=data.pawnInfo;
			console.log(data);
			pawnInfo.loanAmount=pawnInfo.loanAmount+"元";
			pawnInfo.loanInterest=pawnInfo.loanInterest+"%/天";
			pawnInfo.loanTerm=pawnInfo.loanTerm+"天";
			pawnInfo.payType=payTypeFormatter(pawnInfo.payType);
			
			//典当协议信息回显
			$("#pawnForm").form("load",pawnInfo);
			expiredTime=pawnInfo.repaymentDate;
			
			//去除input边框
			$("#pawnForm input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#pawnForm input").attr("readonly",true);
			
			
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
		queryParams:{accessId:"63206",busiId:pawnId,busiType:"01"},
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
function auditOprate(audit){
	//构造参数
	var auditParams={};
	auditParams.logicId="03.03.05";
	auditParams.audit=audit;
	
	auditParams.pawnId=auditPawnId;
	auditParams.expiredTime=expiredTime;
	
	if(audit==1){
		auditParams.operation="通过审核";
		auditParams.pawnStat="03";
	}else{
		auditParams.operation="不通过审核";
		auditParams.pawnStat="02";
	}
	
	$.messager.confirm("确认信息","是否"+auditParams.operation+"?",function(r){
		if(r){
			auditParams.busiType="01";
			auditParams.busiId=auditPawnId;
			auditParams.empId=empInfo.empId;
			auditParams.auditEmpId=empInfo.empId;
			
			//流程批注
			auditParams.comment=$("#comment").textbox("getValue");
			
			auditParams.taskId=_taskData.id;
			auditParams.auditor=user.userId;
			
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