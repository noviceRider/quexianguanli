$(function (){ 
	validateResDesc();
	//初始化数据网格
	doSearch();
});
function doSearch(){
	searchFile('dg','form_search','typeDiv');
}
function fileUpload(){
	if($("#form_add").form("validate")){
	$("#form_add").form("submit", {
		method: "post",
		url: basePath+"/gmodule_resmanage_add.json",
		success: function(data) {
			var data1 = JSON.parse(data);
			if(data1.resultCode == "1") {
				doSearch();
				$("#form_add").form("reset");
			} else if(data.resultCode == "0") {
				$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
			} else {
				$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
			}
		}
	});
	}
}