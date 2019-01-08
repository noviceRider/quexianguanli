/**
 * 
 *典当流程任务节点JS
 */

//form表单弹窗属性
var options={
	width:'60%',
	height:'80%',
	title:'放款',
	buttons:'#purchaseGath_form'
};


//当前登录用户信息
var user;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的典当业务ID
var gathPawnId;

//放款方式
var pawnPayWay;

//放款金额
var currLoanAmount;

//放款操作的业务
var operateItem;

//当前放款典当业务关联的商品
var gathPawnGoods;

//当前放款典当业务相关会员信息
var gathPawnMember;

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
	
	//从任务信息中取出业务主键作为典当业务id，查询信息
	var agreementCode = _taskData.businessKey;
	
	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.03.02",agreementCode:agreementCode},
		success:function(data){
			console.log(data);
			//典当业务信息
			var purchaseInfo=data.purchaseInfo;
			
			//全局变量赋值
			operateItem=data.purchaseInfo;
			pawnPayWay=purchaseInfo.payType;
			gathPawnMember=data.memberInfo;
			
			//如果付款方式为转账，则上传凭证图片
			if(purchaseInfo.payType=="02"){
				$("#zhuanzhangDiv").show();
				
				//点击原始图片进行文件选择
				$("#showTransferImg").click(function(){
					$("#zhuanzhang").click();
				});
				
			}else{
				$("#zhuanzhangDiv").hide();
			}
			
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
			
			//典当协议信息回显
			$("#gathPurchaseForm").form("load",purchaseInfo);
			
			
			$("#purchaseAmount").val(priceFormatter(purchaseInfo.purchaseAmount)+"元");
			$("#payType").val(payTypeFormatter(purchaseInfo.payType));
			
			
			//去除input边框
			$("#gathPurchaseForm input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#gathPurchaseForm input").attr("readonly",true);
			
			
			//会员信息
			var memberInfo=data.memberInfo;
			
			$("#memberInfo_form").form("load",memberInfo);
			//去除input边框
			$("#memberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#memberInfo_form input").attr("readonly",true);
			
			
			//商品信息
			var goodsInfo=data.goodsInfo;
			
			//全局变量赋值
			gathPawnGoods=data.goodsInfo;
			
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
		queryParams:{accessId:"63206",busiId:operateItem.agreementCode,busiType:"02"},
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
 *付款操作 
 */
function purchaseLoan(){
	//构造参数
	var auditParams=new FormData(document.getElementById("gathPurchaseForm"));
	
	if(($("#zhuanzhang").val()==null || $("#zhuanzhang").val()=="") && operateItem.payType=="02"){
		$.messager.alert("提示信息","请上传转账凭证(图片)！！","info");
	}else{
		$.messager.confirm("确认信息","是否确认付款? \n 付款方式:"+payTypeFormatter(operateItem.payType)+" \n 付款金额:"+operateItem.purchaseAmount,function(r){
			if(r){
				auditParams.append("logicId","03.04.03");
				
				auditParams.append("purchaseStat","04");
				auditParams.append("purchaseId",operateItem.purchaseId);
				auditParams.append("loanEmpId",empInfo.empId);
				auditParams.append("payWay",pawnPayWay);
				
				//操作记录参数
				auditParams.append("busiType","02");
				auditParams.append("busiId",operateItem.agreementCode);
				auditParams.append("empId",empInfo.empId);
				auditParams.append("payEmpId",empInfo.empId);
				auditParams.append("operation","放款");
				auditParams.append("taskId",_taskData.id);
				
				if(operateItem.payType=="02"){
					//转账凭证图片资源信息
					auditParams.append("infoType","1010");
					auditParams.append("typeId","1169");
					auditParams.append("resDesc","收货业务放款转账凭证图片(收货业务序号:"+operateItem.purchaseId+")");
				}else if(operateItem.payType=="04"){
					//会员余额变更记录参数
					auditParams.append("changeType","02");
					auditParams.append("balance",operateItem.balance);
					auditParams.append("changeAmount",operateItem.purchaseAmount);
					auditParams.append("changeDesc","时间:"+new Date().Format("yyyy-MM-dd hh:mm:ss")+",商品:"+gathPawnGoods.goodsName+"(商品编号:"+gathPawnGoods.goodsId+")"+",变动金额:"+operateItem.purchaseAmount);
					auditParams.append("changeTitle","收货流程放款");
					auditParams.append("balanceLogStat","01");
					auditParams.append("newBalance",gathPawnMember.balance+operateItem.loanAmount);
				}
				
				//资金流水
				auditParams.append("busiTableName","02");
				auditParams.append("busiName","收货业务");
				auditParams.append("busiDesc","商品收货付款");
				auditParams.append("payType",pawnPayWay);
				auditParams.append("amount",operateItem.purchaseAmount);
				
				//商品信息
				auditParams.append("goodsId",gathPawnGoods.goodsId);
				
				//会员ID
				auditParams.append("memberId",gathPawnMember.memberId);
				
				//公用参数
				auditParams.append("createBy",user.userId);
				auditParams.append("modifyBy",user.userId);
			
				//调用业务逻辑完成放款
				$.ajax({
					url:basePath+"/businesslogic_upload.json",
					data:auditParams,
					method:"post",
					async:false,
					processData : false,
					contentType : false,
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
}


/**
 *时间格式化 
 */
Date.prototype.Format = function (fmt) { //author: meizz 
	 var o = {
	     "M+": this.getMonth() + 1, //月份 
		 "d+": this.getDate(), //日 
		 "h+": this.getHours(), //小时 
		 "m+": this.getMinutes(), //分 
		 "s+": this.getSeconds(), //秒 
		 "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		 "S": this.getMilliseconds() //毫秒 
	 };
	 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	 for (var k in o)
		 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	 return fmt;
};
 
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

/**
 *文件框change事件 
 */
function ImgPreview(file){  
     if (file.files && file.files[0]){  
          var reader = new FileReader();  
          reader.onload = function(evt){  
        	  $('#showTransferImg').attr('src' , evt.target.result);
          };    
          reader.readAsDataURL(file.files[0]);  
     }else{  
    	 $('#showTransferImg').attr('src' , file.value);
     }  
}