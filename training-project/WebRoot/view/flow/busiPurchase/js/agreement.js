/**
 * 
 *典当流程任务节点JS
 */

//form表单弹窗属性
var options={
	width:'90%',
	height:'97%',
	title:'商品收货',
	buttons:'#resubmit_form'
};

//是否是新增会员
var memberIsNew=0;

//当前登录用户信息
var user;

//当前员工
var empInfo;

//当前操作的业务
var oprateItem;

/**
 * 初始化
 * @param row 典当的商品数据
 */
function initPage(){
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
			oprateItem=purchaseInfo;
			
			//收货协议信息回显
			$("#agreementPurchaseForm").form("load",purchaseInfo);
			
			//租售信息回显
			if(purchaseInfo.isRentable==1){
				$("#isRentable").prop("checked",true);
			}else{
				$("#isRentable").prop("checked",false);
			}
			
			if(purchaseInfo.isSalable==1){
				
				$("#isSalable").prop("checked",true);
			}else{
				
				$("#isSalable").prop("checked",false);
			}
			
			//放款方式下拉
			loanWaySelect();
			
			
			//协议编号不可修改
			$("#agreementCodeInput").attr("readonly",true);
			$("#agreementCodeInput").css("border","none");
			
			//会员信息
			var memberInfo=data.memberInfo;
			
			$("#memberInfo_form").form("load",memberInfo);
			
			
			
			//商品信息
			var goodsInfo=data.goodsInfo;
			
			//页面商品数据回显
			$("#goodsIdPP").text(goodsInfo.goodsId);
			$("#goodsNamePP").text(goodsInfo.goodsName);
			$("#officialPricePP").text(goodsInfo.officialPrice);
			$("#valuationPricePP").text(goodsInfo.valuationPrice);
			$("#pawnPricePP").text(goodsInfo.pawnPrice);
			$("#firstPricePP").text(goodsInfo.firstPrice);
		}
	});
	
	//隐藏控件
	$("#reInput").show();
	$("#tip").show();
	
	//会员信息不可编辑
	$("#memberInfo_form input").attr("readonly",true);
	
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
//	
	//贷款时长失去焦点触发，自动填充还款日期输入栏
	$("input",$("#loanTerm").next("span")).blur(function(){
		if($("#loanTerm").textbox("getValue")!=null && $("#loanTerm").textbox("getValue")!=""){
			var days=$("#loanTerm").textbox("getValue");
			
			$("#repaymentDate").textbox("setValue",transferCouponValueTime(new Date(),parseInt(days)));
		}
	   
	});
	
	
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
	
	$("#purchaseAmount").textbox({
		required: true,
		missingMessage:"该项不能为空",
		invalidMessage:"请填写数字",
		validType:"float"
	});
	
	$("#payType").combobox({
		required: true,
		missingMessage:"该项不能为空",
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
			console.log(params);
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
			
			//付款方式
			$("#payType").combobox("select",oprateItem.payType);
		}
	});
}


/**
 * 重新提交审核
 * 
 */
function reSubmit(){
	$.messager.confirm("确认信息","是否确认重新提交审核？",function(r){
		if(r){
			//得到商品信息表单数据
			var memberformData = $("#memberInfo_form").serializeObject();
			var purchaseFormData=$("#agreementPurchaseForm").serializeObject();
			
			//可租、可售
			if($("#isRentable").prop("checked")){
				purchaseFormData.isRentable=1;
			}else{
				purchaseFormData.isRentable=0;
			}
			
			if($("#isSalable").prop("checked")){
				purchaseFormData.isSalable=1;
			}else{
				purchaseFormData.isSalable=0;
			}
			
			//合并
			var formData = $.extend({}, memberformData, purchaseFormData);
			
			formData.purchaseId=oprateItem.purchaseId;
			
			//商品信息
			formData.goodsId=$("#goodsIdPP").text();
			formData.goodsName=$("#goodsNamePP").text();
			
			//登录人员信息
			formData.createBy=user.userId;
			formData.modifyBy=user.userId;
			
			//操作记录表信息
			formData.empId=empInfo.empId;
			formData.busiId=oprateItem.agreementCode;
			
			//启动流程相关变量
			formData.taskId = _taskData.id;
			
			//调用业务逻辑  1.验证协议编号、当票号等是否已经存在  2.新增会员信息价及典当信息 3.开启流程
			formData.memberIsNew=memberIsNew;
			
			
			formData.purchaseStat="01";
			formData.busiType="02";
			formData.logicId="03.04.02";
			formData.operation="重新提交收货协议";
			formData.deliveryEmpId=empInfo.empId;
			
			if(r){
				$.ajax({
					url:basePath + "/businesslogic.json",
					type:"post",
					data:formData,
					async:false,
					success:function(data){
						
						if(data.resultCode==1){
							//成功
							refresh();
							$.messager.alert("提示信息","办理成功","info");
							$("#productsTable").datagrid("reload");
						}else{
							$.messager.alert("错误信息","办理失败,请重试或联系管理员","error");
						}
					}
				});
			};
		}
	});
}


/**
 * 点击打开客户资料选择弹框
 */
function doOpenSelectMemberDlg(){
	$('#memberDialog').dialog({closed: false});
	$("#memberSelect_dg").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 230, {accessId:"64104"}));
}

/**
 * 根据名称查询客户
 */
function doQueryMember(){
	$("#memberSelect_dg").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 230, {accessId:"64104",keyword:$("#memberNameQuery").textbox("getValue")}));
}

/**
 * 选择客户资料
 */
function doSelectMember(){
	//获取选中行
	var row = $("#memberSelect_dg").datagrid("getSelected");
	
	//将选中行数据填入客户资料面板
	$("#memberInfo_form").form("load",row);
	
	//设置文本框为不可编辑
	$("#memberInfo_form input").attr("readonly",true);
	$("#reInput").show();
	
	//新增会员标识为不新增
	memberIsNew=0;
	
	//退出弹框
	$('#memberDialog').dialog({closed: true});
}

/**
 * 关闭客户资料框
 */
function doCloseMemberDialog(){
	$('#memberDialog').dialog({closed: true});
}
 