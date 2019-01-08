/**
 * 功能：加载多级分类信息
 * 参数：
 * id combotree在页面中定义的id
 * infoType 信息类型编号
 */
function loadCombotree(id,infoType){
	$.ajax({
		url:basePath+"/gmodule_multilevel_findall.json",
		type:'post',
		data:{infoType:infoType,isUsed:1},
		success:function(data){
			$("#"+id).combotree("loadData",data.rows);
		}
	});
}
/**
 * 功能：加载多级分类信息
 * 参数：
 * id combotree在页面中定义的id
 * infoType 信息类型编号
 */
function loadCombobox(id,infoType){
	$.ajax({
		url:basePath+"/gmodule_resourcetype_findbyinfotype.json",
		type:'post',
		data:{infoType:infoType},
		success:function(data){
			$("#"+id).combobox("loadData",data.rows);
		}
	});
}
/**
 * 格式化文件大小
 * @param value
 * @returns
 */
function fileSizeFormatter(value) {
	if(null == value || value == '') {
		return "0 Bytes";
	}
	var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
	var index = 0;
	var srcsize = parseFloat(value);
	index = Math.floor(Math.log(srcsize) / Math.log(1024));
	var size = srcsize / Math.pow(1024, index);
	size = size.toFixed(2); //保留的小数位数
	return size + unitArr[index];
}
/**
 * 文件操作格式化
 * @param value
 * @param row
 * @param index
 * @returns {String}
 */
function fileOpFormatter(value, row, index) {
	if (row.isPic == "1") {
		return "<a href='"+basePath+"/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;float:left;width:50%;margin-left:5%;border-right:1px solid;' >下载</a>  <a href='#'  style='color: blue;;float:right;width:30%;margin-right:5%;' onclick=lookPic(" + row.resId + ")>预览</a>";
	} else {
		return "<a href='"+basePath+"/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;float:left;width:50%;margin-left:5%;border-right:1px solid;' >下载</a> ";
	}
}
/**
 * 文件查询
 * @param dgTag
 * @param formTag
 * @param divTag
 */
function searchFile(dgTag,formTag,divTag){
	$("#"+dgTag).datagrid(createDatagrid(basePath, "/gmodule_resmanage_findpage.json",document.body.clientHeight, 135, $("#"+formTag).serializeObject(),divTag));
}

/**
 * 初始化datagrid
 * @param bPath
 * @param loadUrl
 * @param div
 * @param headHeight
 * @param params
 * @returns {___anonymous4375_4376}
 */
function createDatagrid(bPath, loadUrl,divHeight, headHeight, params ,divName){
	var hHeight = (typeof headHeight != "undefined") ? headHeight : 135;
	var rowCount = Math.floor((divHeight - hHeight)/25);
	var opts = {};
	opts['url'] = bPath + loadUrl;
	opts['pageList'] = [5, 10];
	opts['pageSize'] = rowCount;
	opts['pageList'].push(rowCount);
	opts['queryParams'] = params;
	//当数据查询完成时，判断数据是否超过一页，如果少于一页，则不显示分页，否则显示分页
 	if(divName!=""){
 		opts['onLoadSuccess'] = function(data){
 	 		$("#"+divName+" .datagrid-body").css("overflow", "hidden");
 			if(data.total<=opts.pageSize){
 				$("#"+divName+" .datagrid-pager").hide();
 			}else{
 				$("#"+divName+" .datagrid-pager").show();
 			}
 		};
 	}
	return opts;
}
/**
 * 图片预览 
 */
function lookPic(id){
	var aaa=[];
	var url={url:''+basePath+'/gmodule_resmanage_filedown.json?id=' + id};
	aaa.push(url);
	$("#aaa").picturePreview(aaa,"showPics");
}
/**
 * 验证资源描述
 */
function validateResDesc(){
	$("#resDesc").textbox({
		required: true,
		missingMessage: "资源描述不能为空",
		invalidMessage: "资源描述已经存在",
		validType: "remoteValid['" + basePath + "/gmodule_resmanage_validatedesc.json','resDesc']"
	});
}