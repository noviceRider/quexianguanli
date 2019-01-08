//form表单弹窗属性
var options={
	width:'90%',
	height:'100%',
	title:'典当协议修改',
	buttons:'#agreement_form'
};

//是否是新增会员
var memberIsNew=0;

//当前登录用户信息
var user;

var apawn;

/**
 * 初始化
 * @param row 典当的商品数据
 */
function initPage(row){
	//在流程信息中取出典当业务ID
	var pawnId = row.pawnId;
	apawn=row;
	auditPawnId=pawnId;
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.02.03",pawnId:pawnId},
		success:function(data){
			
			//典当页面商品数据回显
			var goodsInfo=data.goodsInfo;
			$("#goodsIdPP").text(goodsInfo.goodsId);
			$("#goodsNamePP").text(goodsInfo.goodsName);
			$("#officialPricePP").text(goodsInfo.officialPrice);
			$("#valuationPricePP").text(goodsInfo.valuationPrice);
			$("#pawnPricePP").text(goodsInfo.pawnPrice);
			$("#firstPricePP").text(goodsInfo.firstPrice);
			
			//典当协议信息回显
			$("#pawnForm").form("load",data.pawnInfo);
			
			$("#payType").combobox("setValue",data.pawnInfo.payType);
			$("#pawnId").attr("readonly",true);
			$("#pawnId").css("border","none");
			
			
			//会员信息回显
			$("#memberInfo_form").form("load",data.memberInfo);
			
			//控件
			$("#reInput").show();
			$("#tip").show();
			//会员信息不可编辑
			$("#memberInfo_form input").attr("readonly",true);
		}
	});
	
	//表单验证
	formValidate();
	
	//电话和证件号输入框失去焦点事件,调用方法验证该值是否已经存在于数据库
	$("input",$("#mobile").next("span")).blur(function(){
		if($("#mobile").textbox("getValue")!=null && $("#mobile").textbox("getValue")!=""){
			 memberValid(1); 
		}  
	});
	
	$("input",$("#certNo").next("span")).blur(function(){
		if($("#certNo").textbox("getValue")!=null && $("#certNo").textbox("getValue")!=""){
			 memberValid(2); 
		}
	   
	});
	
	//贷款时长失去焦点触发，自动填充还款日期输入栏
	$("input",$("#loanTerm").next("span")).blur(function(){
		if($("#loanTerm").textbox("getValue")!=null && $("#loanTerm").textbox("getValue")!=""){
			var days=$("#loanTerm").textbox("getValue");
			
			$("#repaymentDate").textbox("setValue",transferCouponValueTime(new Date(),parseInt(days)));
		}
	   
	});
	
	//放款方式下拉
	loanWaySelect();
	
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
	
	//操作记录
	$("#agreementshowhistoryIdentifyTable").datagrid({
		url:basePath+"/dataaccess.json",
		method:"post",
		fitColumns:true,
		queryParams:{accessId:"63206",busiId:pawnId},
		columns:[[
			         {field:'busiLogId',title:'记录编号',width:'15%',sortable:true,alias:'busi_log_id',halign:'center',align:'left'},
			         {field:'busiId',title:'业务编号',hidden:true},
			         {field:'empId',title:'操作人',width:"20%",sortable:false,halign:'center',align:'left'},
			         {field:'operation',title:'操作类型',width:'20%',sortable:false,alias:'',halign:'center',align:'center'},
			         {field:'operateTime',title:'操作时间',width:'35%',sortable:false,alias:'',halign:'center',align:'center'},
			     ]]
	});
};

/**
 * 表单验证
 */
function formValidate(){
	$("#memberId").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#memberName").textbox({
		required: true,
		missingMessage:"该项不能为空",
		//invalidMessage:"该名称已存在，请重新填写",
		//validType:"catNameRemoteValid['" + basePath + "/businesslogic.json', 'bannerName', {logicId: '06.07.01.04'}]"
	});
	
	$("#mobile").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#certNo").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#bankName").textbox({
		required: true,
		missingMessage:"该项不能为空",
	});
	
	$("#accountName").textbox({
		required: true,
		missingMessage:"该项不能为空",
	});
	
	$("#account").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#pawnId").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#pawnTicket").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#payType").combobox({
		required: true,
		missingMessage:"该项不能为空",
	});
	
	$("#loanAmount").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"float"
	});
	
	
	$("#loanInterest").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"float"
	});
	
	$("#loanTerm").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"number"
	});
	
	$("#repaymentDate").textbox({
		required: true,
		missingMessage:"该项不能为空"
	});
}

$.extend($.fn.textbox.defaults.rules, {
	/**
	 * 数字验证
	 */
    number: {
        validator: function (value) {
            return /^[0-9]*$/.test(value);
        },
        message: '格式不正确'
    },

	/**
	 *会员重名验证 
	 */
    memberNameRemoteValid: {
		validator: function(value, param){
			
			var bannerId=$("#bannerId").textbox("getValue");
			
			var params = {};
			params[param[1]] = value;
			if($(param[2]) != null) {
				params = $.extend(params, param[2]);
			}
			
			params.bannerId=bannerId;
			params.isNew=isNew;
			var data = $.ajax({  
				url: param[0],  
				type: 'post',  
				data: params,
				async:false,  
                cache:false,
				dataType: 'json'
			}).responseJSON;	
			
			if(data.resultCode == 1)
				//通过验证
				return true;
			else 
				//未通过验证
				return false;
		},
		message: '请输入合法的内容'
    },
    
    /**
	 * 小数验证
	 */
    float: {
        validator: function (value) {
            return /^[0-9]+(.[0-9]{1,3})?$/.test(value);
        },
        message: '格式不正确'
    },
});

/**
 * 手机号码和身份证号码验证
 * 若存在则其余数据自动填充
 * @param type 验证类型 1.电话 2.身份证号
 * 
 */
function memberValid(type){
	
	//获取手机号码和身份证用户输入值
	var mobile=$("#mobile").textbox("getValue");
	var certNo=$("#certNo").textbox("getValue");
	
	//获取验证结果
	var getValidResultParams={};
	getValidResultParams.mobile=mobile;
	getValidResultParams.certNo=certNo;
	getValidResultParams.validType=type;
	getValidResultParams.logicId="06.03.02.01";
	
	$.ajax({
		url:basePath+"/businesslogic.json",
		method:"post",
		data:getValidResultParams,
		success:function(data){
			if(data.row!=null){
				memberIsNew=0;
				
				//会员信息不可编辑
				$("#memberInfo_form input").attr("readonly",true);
				
				//数据自动填充
				$("#memberInfo_form").form("reset");
				$("#memberInfo_form").form("load",data.row);
					
				//重新填写按钮显示
				$("#reInput").show();
				$("#tip").show();
				
			}
		}
	});
}

/**
 * 重新填写会员信息
 */
function reInput(){
	memberIsNew=1;
	
	//重置表单
	$("#memberInfo_form").form("reset");
	
	$("#reInput").hide();
	$("#tip").hide();
	
	//会员信息可编辑
	$("#memberInfo_form input").attr("readonly",false);
}

/**
 * 放款方式下拉列表
 */
function loanWaySelect(){
	//构造商品来源下拉
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:{typeCode:"PC_PAWN_PAY_TYPE",accessId:3301},
		method:"post",
		success:function(data){
			var comboData=[{dictDesc:"请选择放款方式",dictCode:""}];
			
			for(var i=0;i<data.rows.length;i++){
				comboData.push(data.rows[i]);
			}
			
			$("#payType").combobox({
				data:comboData,
				textField:"dictDesc",
				valueField:"dictCode"
			});
		}
	});
}

/** 
 * 还款日期 
 * startDate:起始日期 
 * valueTime:有效天数 
 */  
function transferCouponValueTime(startDate,valueTime){  
 var date = new Date(startDate);
 
 var newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+valueTime);  
 var year1 = date.getFullYear();  
 var month1 = date.getMonth()+1;  
 var day1 = date.getDate();  
 var year2 = newDate.getFullYear();  
 var month2 = newDate.getMonth()+1;  
 var day2 = newDate.getDate();
 //year1+"-"+month1+"-"+day1+"-"+
 return year2+"-"+month2+"-"+day2;  
   
}

/**
 * 启动流程
 */
function agreement(){
	//得到商品信息表单数据
	var memberformData = $("#memberInfo_form").serializeObject();
	var pawnFormData=$("#pawnForm").serializeObject();
	
	//合并
	var formData = $.extend({}, memberformData, pawnFormData);
	formData.pawnStat="01";
	
	//商品信息
	formData.goodsId=$("#goodsIdPP").text();
	formData.goodsName=$("#goodsNamePP").text();
	
	//登录人员信息
	formData.createBy=user.userId;
	formData.modifyBy=user.userId;
	
	//操作记录表信息
	formData.empId=user.userId;
	formData.busiType="01";
	formData.busiId=formData.pawnId;
	formData.operation="重新提交典当协议";
	
	//启动流程相关变量
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:{accessId:"8207",procInstId:apawn.procInstId},
		async:false,
		method:"post",
		success:function(data){
			
			taskId=data.taskId;
		}
	});
	
	formData.taskId=taskId;
	
	//调用业务逻辑  1.验证协议编号、当票号等是否已经存在  2.新增会员信息价及典当信息 3.开启流程
	formData.memberIsNew=memberIsNew;
	formData.logicId="03.03.06";
	$.messager.confirm("确认", "是否确认办理，进入后续处理？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:formData,
				async:false,
				success:function(data){
					
					if(data.resultCode==1){
						//成功
						$("#agreementformParse").dialog("close");
						$("#productsTable").datagrid("reload");
						$.messager.alert("提示信息","办理完成","info");
						
					}else if(data.resultCode==-1){
						$.messager.alert("提示信息","当票编号重复，请重新填写","info");
					}else{
						$.messager.alert("错误信息","流程开启失败,请重试或联系管理员","error");
					}
				},
				error:function(){
					$.messager.alert("错误信息","流程开启失败,请联系管理员","error");
				}
			});
		};
	});
}
 