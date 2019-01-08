//form表单弹窗属性
var options={
	width:800,
	height:600,
	title:'调整折旧费',
	buttons:'#sc_form',
};
//折旧费
var zhejiufei;
var newGoodsId;

function initPage(){
	//从任务信息中取出业务主键作为商品id，查询商品信息
	var rentId = _taskData.businessKey;
	var goodsInfoOld;
	var goodsInfoNew;
	var rentInfo;
	var countInfo;
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
			rentInfo = data.rentInfo;
			countInfo = $.extend({}, rentInfo);
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
			$("#inputValuationP").text(goodsInfoOld.valuationPrice+"元");
			$("#inputNewValuationP").text(goodsInfoNew.valuationPrice+"元");
			$("#inputRentPriceP").text(goodsInfoOld.rentPrice+"元");
			$("#inputNewRentPriceP").text(goodsInfoNew.rentPrice+"元");
			
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
	rentInfo.zhejiufei = zhejiufei;
	//租金
	rentInfo.zujin = goodsInfoOld.rentPrice+"元";
	//周期
	rentInfo.zhouqi = addDate(rentInfo.returnDate,-rentInfo.rentTerm)+'~'+rentInfo.realReturnDate;
	//应退金额 = 收款金额-租金-折旧
	rentInfo.shouldBack = rentInfo.payAmount - goodsInfoOld.rentPrice*(rentInfo.rentTerm)-rentInfo.zhejiufei+"元";
	rentInfo.payAmount = rentInfo.payAmount+"元";
	Common.loadDataForDOM(rentInfo,"#comfirmTable","span","name");
	$("#zhejiuInput").textbox("setValue",rentInfo.zhejiufei).textbox({
		onChange:function(newValue,oldValue){
			rentInfo.shouldBack = countInfo.payAmount - goodsInfoOld.rentPrice*(countInfo.rentTerm)-newValue+"元";
			Common.loadDataForDOM(rentInfo,"#comfirmTable","span","name");
		}
	});
}
/**
 * 日期加天数
 * @param date
 * @param days
 * @returns {String}
 */
function addDate(date,days){ 
    var d=new Date(date); 
    d.setDate(d.getDate()+days); 
    var m=d.getMonth()+1; 
    return d.getFullYear()+'-'+m+'-'+d.getDate(); 
}
/**
 * 计算日期之间间隔
 * @param startDate
 * @param endDate
 * @returns {Number}
 */
function GetDateDiff(startDate,endDate) {  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);     
    return  dates;    
}
//确认调整费用
function changeCost(){
	var zhejiuM = $("#zhejiuInput").textbox("getValue");
	$.ajax({
		type: "post",
		url: basePath+"/businesslogic.json",
		data: {taskId:_taskData.id,zhejiufei:zhejiuM,rentId:_taskData.businessKey,logicId:'03.05.07'},
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