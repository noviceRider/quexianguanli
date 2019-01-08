//form表单弹窗属性
var options={
	width:800,
	height:600,
	title:'押金退还',
	buttons:'#sc_form',
};

//当前登录用户信息
var user;

//当前登录用户员工信息
var empInfo;

//折旧费
var zhejiufei;
var rentInfoTop;
var memberInfo;
var goodsInfoTop;
var shouldBackMoney;
var newGoodsId;
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
		data: { logicId:"04.06.02" },
		async:false,
		success:function(data){
			//得到用户
			empInfo = data.empInfo;
		}
	});
	
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
	var rentId = _taskData.businessKey;
	var goodsInfoOld;
	var goodsInfoNew;
	var rentInfo;
	//从流程中查询新商品的id
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"03.02.07",taskId:_taskData.id,varName:'newGoodsId'},
		success:function(data){
			newGoodsId = data.newGoodsId;
		}
	});
	
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		async:false,
		data:{accessId:"62510",goodsId:newGoodsId},
		success:function(data){
			goodsInfoNew = data;
		}
	});
	
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.04.01",rentId:rentId},
		success:function(data){
			goodsInfoOld = data.goodsInfo;
			goodsInfoTop = data.goodsInfo;
			rentInfo = data.rentInfo;
			rentInfoTop = data.rentInfo;
			memberInfo = data.memberInfo;
			//基本信息回显
			$("#goodsIdP").text(goodsInfoOld.goodsId);
			$("#shopCodeP").text(goodsInfoOld.shopCode);
			$("#inputUserP").text(goodsInfoOld.inputUser);
			$("#catCodeP").text(goodsInfoOld.goodsCatRoute);
			$("#goodsNameP").text(goodsInfoOld.goodsName);
			$("#firstPriceP").text(goodsInfoOld.firstPrice);
			$("#goodsDescP").text(goodsInfoOld.goodsDesc);
			$("#goodsBrandP").text(goodsInfoOld.goodsBrand);
			$("#articleNumberP").text(goodsInfoOld.articleNumber);
			$("#inputDateP").text(goodsInfoOld.inputDate);
			
			//查询并回显商品属性
			var getGoodsAttrParams={};
			getGoodsAttrParams.accessId="62504";
			getGoodsAttrParams.goodsId=goodsInfoOld.goodsId;
			
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
			getImageParams.goodsId=newGoodsId;
			getImageParams.infoType="1004";
			
			//设置商品分类参数  （判断商品属于几级分类）
			if(goodsInfoOld.detailCatCode!=null && goodsInfoOld.detailCatCode!="" && goodsInfoOld.detailCatCode!=undefined){
				getImageParams.catCode=goodsInfoOld.detailCatCode;
			}else{
				if(goodsInfoOld.subCatCode!=null && goodsInfoOld.subCatCode!="" && goodsInfoOld.subCatCode!=undefined){
					getImageParams.catCode=goodsInfoOld.subCatCode;
				}else{
					if(goodsInfoOld.catCode!=null && goodsInfoOld.catCode!="" && goodsInfoOld.catCode!=undefined){
						getImageParams.catCode=goodsInfoOld.catCode;
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
	//老商品估价和新商品估价差距为折旧费
	zhejiufei = rentInfo.depreciationCost;
	rentInfo.zhejiufei = zhejiufei+"元";
	//租金
	rentInfo.zujin = goodsInfoOld.rentPrice+"元/天";
	//周期
	rentInfo.zhouqi = addDate(rentInfo.returnDate,-rentInfo.rentTerm)+'~'+rentInfo.realReturnDate;
	//应退金额 = 收款金额-租金-折旧
	shouldBackMoney = rentInfo.payAmount - goodsInfoOld.rentPrice*(rentInfo.rentTerm)-zhejiufei;
	
	rentInfo.shouldBack = shouldBackMoney+"元";
	
	Common.loadDataForDOM(rentInfo,"#comfirmTable","span","name");
}
/**
 * 计算日期加天数得到新的日期
 */
function addDate(date,days){ 
    var d=new Date(date); 
    d.setDate(d.getDate()+days); 
    var m=d.getMonth()+1; 
    return d.getFullYear()+'-'+m+'-'+d.getDate(); 
}
/**
 * 计算日期之间的间隔 天数
 * @param startDate
 * @param endDate
 * @returns {Number}
 */
function GetDateDiff(startDate,endDate){  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);     
    return  dates;    
}

//收款确定任务处理
function comfirmCost(flag){
	$.ajax({
		type: "post",
		url: basePath+"/businesslogic.json",
		data: {flag:flag,taskId:_taskData.id,zhejiufei:zhejiufei,rentId:_taskData.businessKey,procInstId:_taskData.procInstId,logicId:'03.05.06'},
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
	
}
/**
 * 处理
 */
function getBackBalance(){
	//获取退款方式
	var refundPayType = $("#payTypeCombo").combobox("getValue");
	if(refundPayType){
		if(($("#zhuanzhang").val()==null || $("#zhuanzhang").val()=="") && $("#payTypeCombo").combobox("getValue")=="02"){
			$.messager.alert("提示信息","请上传转账凭证(图片)！！","info");
		}else{
			var message = "退款方式为:"+$("#payTypeCombo").combobox("getText")+",金额"+shouldBackMoney+"元,是否确定？";
			$.messager.confirm("确认", message, function(r){
				if(r){
					//构造参数
					var auditParams=new FormData(document.getElementById("uploadForm"));
					
					auditParams.append("logicId","03.05.11");
					
					auditParams.append("rentId",rentInfoTop.rentId);
					//退款方式
					auditParams.append("refundPayType",$("#payTypeCombo").combobox("getValue"));
					//已收回状态
					auditParams.append("rentStat",'03');
					
					//操作记录
					auditParams.append("busiType","01");
					auditParams.append("busiId",rentInfoTop.rentId);
					auditParams.append("empId",empInfo.empId);
					auditParams.append("auditEmpId",empInfo.empId);
					auditParams.append("operation","租赁退款");
					
					//转账凭证图片资源信息
					auditParams.append("infoType","1010");
					auditParams.append("typeId","1173");
					auditParams.append("resDesc","退款凭证图片(租赁业务序号:"+rentInfoTop.rentId+")");
					
					//公用参数
					auditParams.append("taskId",_taskData.id);
					
					//会员余额变更记录参数
					if($("#payTypeCombo").combobox("getValue")=="04"){
						auditParams.append("changeType","02");
						auditParams.append("balance",memberInfo.balance);
						auditParams.append("changeAmount",shouldBackMoney);
						auditParams.append("changeDesc","时间:"+new Date().Format("yyyy-MM-dd HH:mm:ss")+",商品:"+goodsInfoTop.goodsName+"(商品编号:"+goodsInfoTop.goodsId+")"+",变动金额:"+shouldBackMoney);
						auditParams.append("changeTitle","租赁退款");
						auditParams.append("balanceLogStat","01");
						auditParams.append("memberId",memberInfo.memberId);
						auditParams.append("newBalance",memberInfo.balance+shouldBackMoney);
					}
					
					//资金流水
					auditParams.append("busiTableName","06");
					auditParams.append("busiName","租赁业务");
					auditParams.append("busiDesc","商品租赁");
					auditParams.append("payType",$("#payTypeCombo").combobox("getValue"));
					auditParams.append("amount",shouldBackMoney);
					
					//调用业务逻辑完成收款
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
					
				};
			});
		}
	}else{
		$.messager.alert("提示信息","请选择退款方式进行退款！","info");
	}
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
