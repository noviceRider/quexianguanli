//form表单弹窗属性
var options={
	width:'800',
	height:'600',
	title:'租赁信息审核',
	buttons:'#sc_form'
};

//是否是新增会员
var memberIsNew=1;

//当前登录用户信息
var user;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的典当业务ID
var auditPawnId;

//赎回截止
var expiredTime;

//典当业务信息
var auditPawn;

//任务ID
var taskId;

/**
 * 初始化
 * @param row 典当的商品数据
 */
function initPage(row){
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
	
	//从任务信息中取出业务主键作为典当业务id，查询信息
	var rentId = _taskData.businessKey;
	auditPawnId=rentId;
	auditPawn=row;
	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.04.01",rentId:rentId},
		success:function(data){
			var memberInfo=data.memberInfo;
			//租赁信息
			var rentInfo=data.rentInfo;
			disableForm('rentData','disabled');
			rentInfo.memberId=memberInfo.memberId;
			rentInfo.memberName=memberInfo.memberName;
			rentInfo.mobile=memberInfo.mobile;
			rentInfo.certNo=memberInfo.certNo;
			rentInfo.rentPrice=data.goodsInfo.rentPrice;
			$("#rentData").form("load",rentInfo);
			
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
			//基本信息回显
			$("#goodsIdP").text(goodsInfo.goodsId);
			$("#shopCodeP").text(goodsInfo.shopCode);
			$("#inputUserP").text(goodsInfo.inputUser);
			$("#catCodeP").text(goodsInfo.goodsCatRoute);
			$("#goodsNameP").text(goodsInfo.goodsName);
			$("#firstPriceP").text(goodsInfo.firstPrice);
			$("#goodsDescP").text(goodsInfo.goodsDesc);
			$("#goodsBrandP").text(goodsInfo.goodsBrand);
			$("#articleNumberP").text(goodsInfo.articleNumber);
			$("#inputDateP").text(goodsInfo.inputDate);
			
			//查询并回显商品属性
			var getGoodsAttrParams={};
			getGoodsAttrParams.accessId="62504";
			getGoodsAttrParams.goodsId=goodsInfo.goodsId;
			
			$.ajax({
				url:basePath+"/dataaccess.json",
				data:getGoodsAttrParams,
				method:"post",
				success:function(data){
					//显示商品属性信息
					var goodsAttr={};
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].attrName=='产地'){
							goodsAttr.modePlace = data.rows[i].attrValue;
						}else if(data.rows[i].attrName=='年代'){
							goodsAttr.nianDai = data.rows[i].attrValue;
						}else if(data.rows[i].attrName=='适用人群'){
							goodsAttr.fitPeople = data.rows[i].attrValue;
						}else if(data.rows[i].attrName=='颜色'){
							goodsAttr.color = data.rows[i].attrValue;
						}else if(data.rows[i].attrName=='材质'){
							goodsAttr.caiZi = data.rows[i].attrValue;
						}else if(data.rows[i].attrName=='重量'){
							goodsAttr.weight = data.rows[i].attrValue;
						}
					}
					Common.loadDataForDOM(goodsAttr,'#goodsAttrDiv','p','name');
				}
			});
			
			//查询商品鉴定图片
			var getImageParams={};
			getImageParams.accessId="62505";
			getImageParams.goodsId=goodsInfo.goodsId;
			getImageParams.infoType="1004";
			
			//设置商品分类参数  （判断商品属于几级分类）
			if(goodsInfo.detailCatCode!=null && goodsInfo.detailCatCode!="" && goodsInfo.detailCatCode!=undefined){
				getImageParams.catCode=goodsInfo.detailCatCode;
			}else{
				if(goodsInfo.subCatCode!=null && goodsInfo.subCatCode!="" && goodsInfo.subCatCode!=undefined){
					getImageParams.catCode=goodsInfo.subCatCode;
				}else{
					if(goodsInfo.catCode!=null && goodsInfo.catCode!="" && goodsInfo.catCode!=undefined){
						getImageParams.catCode=goodsInfo.catCode;
					}
				}
			}
			
			//回显商品图片
			$.ajax({
				url:basePath+"/dataaccess.json",
				data:getImageParams,
				method:"post",
				success:function(data){
					
					var ImageStr="";
					var picDesc="";
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].evalPicDef!=null && data.rows[i].evalPicDef!='' && data.rows[i].evalPicDef!=undefined){
							var evalPicDef=JSON.parse(data.rows[i].evalPicDef);
							
							for(var j=0;j<evalPicDef.length;j++){
								if(data.rows[i].resDesc.indexOf(evalPicDef[j].picType)!=-1){
									picDesc=evalPicDef[j].picType;
								}
							}
						}

						ImageStr+="<div style='height:151px;width:20%;display:inline-block;margin-right:15px'><span style='display:block;text-align:center;height:30px;width:100%;'>"+picDesc+"</span><img style='height:130px;width:100%;margin-right:15px' src='http://localhost:8080/pcms/gmodule_resmanage_filedown.json?id="+data.rows[i].resId+"'></div>";
					}
					
					$("#goodsImages").html(ImageStr);
				}
			});
		}
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
		auditParams.operation="审核通过";
		auditParams.pawnStat="03";
	}else{
		auditParams.operation="审核不通过";
		auditParams.pawnStat="02";
	}
	
	auditParams.busiType="01";
	auditParams.busiId=auditPawnId;
	auditParams.empId=user.userId;
	auditParams.auditEmpId=user.userId;
	
	//流程批注
	auditParams.comment=$("#comment").textbox("getValue");

	$.ajax({
		url:basePath+"/dataaccess.json",
		data:{accessId:"8207",procInstId:auditPawn.procInstId},
		async:false,
		method:"post",
		success:function(data){
			
			taskId=data.taskId;
		}
	});
	
	auditParams.taskId=taskId;
	//调用业务逻辑完成审核
	$.ajax({
		url:basePath+"/businesslogic.json",
		data:auditParams,
		method:"post",
		async:false,
		success:function(data){
			if(data.resultCode==1){
				$("#auditformParse").dialog("close");
				$("#productsTable").datagrid("reload");
				$.messager.alert("提示信息","办理成功","info");
			}else{
				$.messager.alert("错误信息","办理失败，请重试或联系管理员","error");
			}
		}
	});
	
}
/**
 * 审核处理
 * @param flag 判断标识（0不通过，1通过）
 */
function charge(flag){
	var message;
	var comment = $("#comment").textbox("getValue");
	if(flag=='1'){
		message = "是否确定通过审核？";
	}else{
		message = "是否确定不通过审核，未通过审核将退回上一处理环节？";
	}
	$.messager.confirm("确认", message, function(r){
		if(r){
			$.ajax({
				type: "post",
				url: basePath+"/businesslogic.json",
				data: {flag:flag,taskId:_taskData.id,procInstId:_taskData.procInstId,logicId:'03.05.02',comment:comment},
				success: function(data) {
					if(data.resultCode==1){
						//操作成功
						$.messager.alert("提示信息","处理完成！","info");
						refresh();
					}else{
						$.messager.alert("错误信息", "处理失败！", "error");
					}
				}
			});
		};
	});
}

function disableForm(formId,isDisabled) {    
    
    var attr="disable";    
    if(!isDisabled){    
       attr="enable";    
    }    
    $("form[id='"+formId+"'] :text").attr("disabled",isDisabled);    
    $("form[id='"+formId+"'] textarea").attr("disabled",isDisabled);    
    $("form[id='"+formId+"'] select").attr("disabled",isDisabled);    
    $("form[id='"+formId+"'] :radio").attr("disabled",isDisabled);    
    $("form[id='"+formId+"'] :checkbox").attr("disabled",isDisabled);    
        
    //禁用jquery easyui中的下拉选（使用input生成的combox）    
    
    $("#" + formId + " input[class='combobox-f combo-f']").each(function () {    
        if (this.id) {alert("input"+this.id);    
            $("#" + this.id).combobox(attr);    
        }    
    });    
        
    //禁用jquery easyui中的下拉选（使用select生成的combox）    
    $("#" + formId + " select[class='combobox-f combo-f']").each(function () {    
        if (this.id) {    
        alert(this.id);    
            $("#" + this.id).combobox(attr);    
        }    
    });    
        
    //禁用jquery easyui中的日期组件dataBox    
    $("#" + formId + " input[class='datebox-f combo-f']").each(function () {    
        if (this.id) {    
        alert(this.id)    
            $("#" + this.id).datebox(attr);    
        }    
    });    
}    
 