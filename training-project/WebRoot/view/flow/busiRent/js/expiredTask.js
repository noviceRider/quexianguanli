/**
 * 
 *典当流程任务节点JS
 */

//form表单弹窗属性
var options={
	width:'800',
	height:'600',
	title:'绝当',
	buttons:'#expired_form'
};

var goodsInfoTop;
//当前登录用户信息
var user;

//付款方式数据集合（数据字典）
var payTypeObj;

//当前审核的典当业务ID
var gathPawnId;

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
	
	//从任务信息中取出业务主键作为典当业务id，查询信息
	var rentId = _taskData.businessKey;
	//gathPawnId=pawnId;
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.04.01",rentId:rentId},
		success:function(data){
			var memberInfo=data.memberInfo;
			//租赁信息
		var rentInfo=data.rentInfo;
//			//disableForm('rentData','disabled');
//			rentInfo.memberId=memberInfo.memberId;
//			rentInfo.memberName=memberInfo.memberName;
//			rentInfo.mobile=memberInfo.mobile;
//			rentInfo.certNo=memberInfo.certNo;
//			rentInfo.rentPrice=data.goodsInfo.rentPrice;
//			$("#rentData").form("load",rentInfo);
			
			//会员信息
			var memberInfo=data.memberInfo;
			
			$("#memberInfo_form").form("load",memberInfo);
			//去除input边框
			$("#memberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#memberInfo_form input").attr("readonly",true);
			
			
			//会员信息
			var memberInfo=data.memberInfo;
			
			$("#memberInfo_form").form("load",memberInfo);
			//去除input边框
			$("#memberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
			
			//不可编辑
			$("#memberInfo_form input").attr("readonly",true);
			
			//商品信息
			var goodsInfo=data.goodsInfo;
			goodsInfoTop=data.goodsInfo;
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
	
//	//操作记录
//	$("#showhistoryIdentifyTable").datagrid({
//		url:basePath+"/dataaccess.json",
//		method:"post",
//		fitColumns:true,
//		queryParams:{accessId:"63206",busiId:pawnId},
//		columns:[[
//			         {field:'busiLogId',title:'记录编号',width:'15%',sortable:true,alias:'busi_log_id',halign:'center',align:'left'},
//			         {field:'busiId',title:'业务编号',hidden:true},
//			         {field:'empId',title:'操作人',width:"20%",sortable:false,halign:'center',align:'left'},
//			         {field:'operation',title:'操作类型',width:'20%',sortable:false,alias:'',halign:'center',align:'center'},
//			         {field:'operateTime',title:'操作时间',width:'35%',sortable:false,alias:'',halign:'center',align:'center'},
//			     ]]
//	});
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
 *绝当操作 
 */
function expired(){
	//构造参数
	var auditParams={};
	auditParams.logicId="03.05.13";
	//商品无效状态
	auditParams.goodsStat = '00'; 
//	//商品库存状态 已出库
//	auditParams.stockStat = '04';
	//租赁状态为 已出售
	auditParams.rentStat = '05';
	auditParams.rentId = _taskData.businessKey;
	auditParams.taskId = _taskData.id;
	auditParams.goodsId = goodsInfoTop.goodsId;
	
	//调用业务逻辑完成放款
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

 