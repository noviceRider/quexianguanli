/**
 * 
 *典当流程任务节点JS
 */

//form表单弹窗属性
var options={
	width:'60%',
	height:'80%',
	title:'放款',
	buttons:'#gath_form'
};


//当前登录用户信息
var user;

//当前用户
var empInfo;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的典当业务ID
var gathPawnId;

//放款方式
var pawnPayWay;

//放款金额
var currLoanAmount;

//放款操作的典当业务
var gathPawn;

//当前放款典当业务关联的商品
var gathPawnGoods;

//当前放款典当业务相关会员信息
var gathPawnMember;

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
	
	//全局变量赋值
	gathPawnId=pawnId;
	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.02.03",pawnId:pawnId},
		success:function(data){
			//典当业务信息
			var pawnInfo=data.pawnInfo;
			
			//全局变量赋值
			gathPawn=data.pawnInfo;
			pawnPayWay=pawnInfo.payType;
			currLoanAmount=pawnInfo.loanAmount;
			gathPawnMember=data.memberInfo;
			
			//如果付款方式为转账，则上传凭证图片
			if(pawnInfo.payType=="02"){
				$("#zhuanzhangDiv").show();
				
				//点击原始图片进行文件选择
				$("#showTransferImg").click(function(){
					$("#zhuanzhang").click();
				});
				
			}else{
				$("#zhuanzhangDiv").hide();
			}
			
			//典当协议信息回显
			$("#gathpawnForm").form("load",pawnInfo);
			$("#loanAmount").val(pawnInfo.loanAmount+"元");
			$("#loanInterest").val(pawnInfo.loanInterest+"%/天");
			$("#payType").val(payTypeFormatter(pawnInfo.payType));
			$("#loanTerm").val(pawnInfo.loanTerm+"天");
			
			//去除input边框
			$("#gathpawnForm input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#gathpawnForm input").attr("readonly",true);
			
			
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
 *放款操作 
 */
function gath(){
	//构造参数
	var auditParams=new FormData(document.getElementById("gathpawnForm"));
	
	if(($("#zhuanzhang").val()==null || $("#zhuanzhang").val()=="") && pawnPayWay=="02"){
		$.messager.alert("提示信息","请上传转账凭证(图片)！！","info");
	}else{
		$.messager.confirm("确认信息","是否确认放款？ \n 放款方式:"+payTypeFormatter(gathPawn.payType)+" \n 放款金额:"+gathPawn.loanAmount,function(r){
			if(r){
				auditParams.append("logicId","03.03.07");
				
				auditParams.append("pawnStat","04");
				auditParams.append("gathPawnId",gathPawnId);
				auditParams.append("loanEmpId",empInfo.empId);
				auditParams.append("payWay",pawnPayWay);
				
				//操作记录
				auditParams.append("busiType","01");
				auditParams.append("busiId",gathPawnId);
				auditParams.append("empId",empInfo.empId);
				auditParams.append("auditEmpId",empInfo.empId);
				auditParams.append("operation","典当业务放款");
				auditParams.append("gath",1);
				auditParams.append("taskId",_taskData.id);
				
				//会员余额变更记录参数
				if(pawnPayWay=="04"){
					auditParams.append("changeType","02");
					auditParams.append("balance",gathPawnMember.balance);
					auditParams.append("changeAmount",currLoanAmount);
					auditParams.append("changeDesc","时间:"+new Date().Format("yyyy-MM-dd hh:mm:ss")+",商品:"+gathPawnGoods.goodsName+"(商品编号:"+gathPawnGoods.goodsId+")"+",变动金额:"+currLoanAmount);
					auditParams.append("changeTitle","典当放款");
					auditParams.append("balanceLogStat","01");
					auditParams.append("memberId",gathPawnMember.memberId);
					auditParams.append("newBalance",gathPawnMember.balance+gathPawn.loanAmount);
				}else if(pawnPayWay=="02"){
					//转账凭证图片资源信息
					auditParams.append("infoType","1010");
					auditParams.append("typeId","1168");
					auditParams.append("resDesc","典当业务放款转账凭证图片(业务序号:"+gathPawnId+")");
				}
				
				//资金流水
				auditParams.append("busiTableName","01");
				auditParams.append("busiName","典当业务");
				auditParams.append("busiDesc","商品典当");
				auditParams.append("payType",pawnPayWay);
				auditParams.append("amount",currLoanAmount);
				
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