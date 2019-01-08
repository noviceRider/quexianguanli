//form表单弹窗属性
var options={
	width:'800',
	height:'600',
	title:'收款',
	buttons:'#gath_form'
};


//当前登录用户信息
var user;

//当前登录用户员工信息
var empInfo;

//当前审核的租赁业务ID
var gathRentId;

//收款金额
var currLoanAmount;

//当前放款典当业务关联的商品
var gathPawnGoods;

//当前放款典当业务相关会员信息
var memberInfo;

var rentInfoTop;
/**
 * 初始化
 * @param row 典当的商品数据
 */
function initPage(row){
	//加载退款方式数据
	$("#payTypeCombo").combobox({
		url:basePath+"/dataaccess.json",
		queryParams:{
			accessId:"3301",
			typeCode:"PC_PAWN_PAY_TYPE"
		},
		loadFilter:function(data){
			return data.rows;
		},
		onChange: function (value){
			if(value == "02"){
				$("#imgTd").css("display","table-cell");
			}else{
				$("#imgTd").css("display","none");
			}
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
		data: { logicId:"04.06.02" },
		async:false,
		success:function(data){
			//得到用户
			empInfo = data.empInfo;
		}
	});
	
	//从任务信息中取出业务主键作为典当业务id，查询信息
	var rentId = _taskData.businessKey;

	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.04.01",rentId:rentId},
		success:function(data){
			//典当业务信息
			var rentInfo=data.rentInfo;
			rentInfoTop=rentInfo;
			currLoanAmount=rentInfo.payAmount;
			
			//如果付款方式为转账，则上传凭证图片
			if(rentInfo.payType=="02"){
				$("#zhuanzhangDiv").show();
			}else{
				$("#zhuanzhangDiv").hide();
			}
			
			if(rentInfo.payType){
				rentInfo.payType=payTypeFormatter(rentInfo.payType);
			}
			//会员信息
			memberInfo=data.memberInfo;
			//租赁信息回显
			//disableForm('rentData','disabled');
			rentInfo.memberId=memberInfo.memberId;
			rentInfo.memberName=memberInfo.memberName;
			rentInfo.mobile=memberInfo.mobile;
			rentInfo.certNo=memberInfo.certNo;
			$("#rentData").form("load",rentInfo);	
			
			$("#memberInfo_form").form("load",memberInfo);
			//去除input边框
			$("#memberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#memberInfo_form input").attr("readonly",true);
			
			
			//商品信息
			var goodsInfo=data.goodsInfo;
			
			//全局变量赋值
			gathPawnGoods=data.goodsInfo;
			
			//基本信息回显
			$("#goodsIdP").text(goodsInfo.goodsId);
			$("#shopCodeP").text(goodsInfo.shopCode);
			$("#inputUserP").text(goodsInfo.inputUser);
			$("#catCodeP").text(goodsInfo.goodsCatRoute);
			$("#goodsNameP").text(goodsInfo.goodsName);
			$("#firstPriceP").text(goodsInfo.firstPrice);
			$("#goodsDescP").text(goodsInfo.goodsDesc);
			$("#goodsBrandP").text(goodsInfo.goodsBrand);
			$("#articleNumberP").text(goodsInfo.articleNum);
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
 *收款操作 
 *@param audit 审核结果(1.通过 0.不通过)
 */
function gath(){
	//构造参数
	var auditParams=new FormData(document.getElementById("rentData"));
	if($("#rentData").form("validate")){
		if(($("#zhuanzhang").val()==null || $("#zhuanzhang").val()=="") && auditParams.get("payType")=="02"){
			$.messager.alert("提示信息","请上传转账凭证(图片)！！","info");
		}else{
			var message = "收款方式为:"+$("#payTypeCombo").combobox("getText")+",金额"+rentInfoTop.payAmount+"元,是否入账？";
			$.messager.confirm("确认", message, function(r){
				if(r){
					auditParams.append("logicId","03.05.03");
					
					auditParams.append("rentStat","01");//已租赁状态
					auditParams.append("rentId",rentInfoTop.rentId);
					auditParams.append("memberId",memberInfo.memberId);
					auditParams.append("payType",rentInfoTop.payType);
					
					//操作记录
					auditParams.append("busiType","01");
					auditParams.append("busiId",rentInfoTop.rentId);
					auditParams.append("empId",empInfo.empId);
					auditParams.append("auditEmpId",empInfo.empId);
					auditParams.append("operation","收款");
					auditParams.append("gath",1);
					auditParams.append("taskId",_taskData.id);
					
					//转账凭证图片资源信息
					auditParams.append("infoType","1010");
					auditParams.append("typeId","1173");
					auditParams.append("resDesc","收款转账凭证图片(租赁业务序号:"+rentInfoTop.rentId+")");
					
					//会员余额变更记录参数
					if(auditParams.get("payType")=="04"){
						auditParams.append("changeType","02");
						auditParams.append("balance",memberInfo.balance);
						auditParams.append("changeAmount",currLoanAmount);
						auditParams.append("changeDesc","时间:"+new Date().Format("yyyy-MM-dd HH:mm:ss")+",商品:"+gathPawnGoods.goodsName+"(商品编号:"+gathPawnGoods.goodsId+")"+",变动金额:"+currLoanAmount);
						auditParams.append("changeTitle","租赁收款");
						auditParams.append("balanceLogStat","01");
						auditParams.append("memberId",memberInfo.memberId);
						auditParams.append("newBalance",memberInfo.balance-rentInfoTop.payAmount);
					}
					
					//资金流水
					auditParams.append("busiTableName","06");
					auditParams.append("busiName","租赁业务");
					auditParams.append("busiDesc","商品租赁");
					auditParams.append("payType",rentInfoTop.payType);
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
								$("#auditformParse").dialog("close");
								$("#productsTable").datagrid("reload");
								$.messager.alert("提示信息","收款成功","info");
								refresh();
							}else{
								$.messager.alert("错误信息","办理失败，请重试或联系管理员","error");
							}
						}
					});
				};
			});
		}
	}else{
		$.messager.alert("提示信息","请选择收款方式","info");
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

/**
 * 图片选择实时预览
 */
function previewImage(file, type) { 
	var div = null;
	if(type == 1) {
		fileName=$("#zhuanzhang").val(); 
		div = document.getElementById('preview'); 
	}else if(type == 2){
		fileName=$("#imgSelect1").val(); 
		div = document.getElementById('preview1'); 
	}else{
		fileName=$("#replyPhoto").val(); 
		div = document.getElementById('preview2');
	}
	
	$("#imgName").attr("value",fileName);  
	var MAXWIDTH  = 80;     //用来显示上传图片的宽度  
	var MAXHEIGHT = 62;     //用来显示上传图片的高度  

		
  
	if (file.files && file.files[0]) {  
		div.innerHTML = '<img id="imghead_'+type+'">';  
		var img = document.getElementById('imghead_'+type);  
		img.onload = function(){  
			var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);  
			img.width = rect.width;  
			img.height = rect.height;  
			img.style.marginLeft = rect.left+'px';  
			img.style.marginTop = rect.top+'px';  
		};  
		var reader = new FileReader();  
		reader.onload = function(evt){img.src = evt.target.result;};  
		reader.readAsDataURL(file.files[0]);  
	}  
	else {  
		var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';  
		file.select();  
		var src = document.selection.createRange().text;  
		div.innerHTML = '<img id=imghead>';  
		var img = document.getElementById('imghead');  
		img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;  
		var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);  
		status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);  
		div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;margin-left:"+rect.left+"px;"+sFilter+src+"\"'></div>";  
	}  
}

/**
 * 预览大小
 * @param maxWidth
 * @param maxHeight
 * @param width
 * @param height
 * @returns {___anonymous6065_6107}
 */
function clacImgZoomParam( maxWidth, maxHeight, width, height ){  
    var param = {top:0, left:0, width:width, height:height};  
    if( width>maxWidth || height>maxHeight )  
    {  
        rateWidth = width / maxWidth;  
        rateHeight = height / maxHeight;  
        if( rateWidth > rateHeight )  
        {  
            param.width =  maxWidth;  
            param.height = Math.round(height / rateWidth);  
        }else  
        {  
            param.width = Math.round(width / rateHeight);  
            param.height = maxHeight;  
        }  
    }  
    param.left = Math.round((maxWidth - param.width) / 2);  
    param.top = Math.round((maxHeight - param.height) / 2);  
    return param;  
}  