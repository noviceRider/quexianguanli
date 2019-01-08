$(function (){ 
	    var text="<script type=\"text/javascript\" src=\"../js/common.js\">"+"</script>";
	    var jsCoce="\n/**"+
	    "\n * 加载资源分类信息"+
	    "\n */"+
	    "\nfunction loadResData(){"+
	    "\n	//loadCombobox(id,infoType);id为combobox的id，infotype表示信息类型编码"+
	    "\n	loadCombobox(\"resType\",$(\"#infoType\").textbox(\"getValue\"));"+
	    "\n}";

	var secondCode="信息类型&nbsp;<input id=\"infoType\" class=\"easyui-textbox\" name=\"infoType\"data-options=\"editable:false\" value=\"1001\">"+
	"\n<a class=\"easyui-linkbutton\" id=\"add_button\"data-options=\"iconCls:\'icon-search\'\" onclick=\"loadResData()\">加载资源分类数据</a>"+
	"\n资源分类&nbsp;<input id=\"resType\" class=\"easyui-combobox\" name=\"dept\" data-options=\"valueField:\'typeId\',textField:\'typeName\',editable:false,panelHeight:\'auto\'\">";

	var searchDgCode="\n信息类型&nbsp;<input id=\"infoTypeM\" class=\"easyui-textbox\" name=\"infoTypeM\" data-options=\"editable:false\" value=\"1001\">"+
"\n<a class=\"easyui-linkbutton\" id=\"add_button\" data-options=\"iconCls:\'icon-search\'\" onclick=\"loadMulData()\">加载多级分类数据</a>"+
"\n资源分类&nbsp;<select id=\"mulType\" class=\"easyui-combotree\" style=\"width:300px;\" data-options=\"editable:false,panelHeight:\'auto\'\">";

	var searchJsCode="\n/**"+
	"\n * 加载多级分类信息"+
	"\n */"+
	"\nfunction loadMulData(){"+
	"\n	//loadCombotree(id,infoType);id为combotree的id，infotype表示信息类型编码"+
	"\n	loadCombotree(\"mulType\",$(\"#infoTypeM\").textbox(\"getValue\"));"+
	"\n}";
	       $("#editCode").text(text);
	       $("#secondCode").text(secondCode);
	       $("#editJsCode").text(jsCoce);
	       $("#searchFormCode").text(text);
	       $("#searchDgCode").text(searchDgCode);
	       $("#searchJsCode").text(searchJsCode);
	        // Load Prettify  
	        prettyPrint(); 
});
function doSearch(){
	searchFile('dg','form_search','typeDiv');
}
function fileUpload(){
	if($("#form_add").form("validate")){
	$("#form_add").form("submit", {
		method: "post",
		url: "/apron_punish/gmodule_resmanage_add.json",
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
/**
 * 加载资源分类信息
 */
function loadResData(){
	//loadCombobox(id,infoType);id为combobox的id，infotype表示信息类型编码
	loadCombobox("resType",$("#infoType").textbox("getValue"));
}
/**
 * 加载多级分类信息
 */
function loadMulData(){
	//loadCombotree(id,infoType);id为combotree的id，infotype表示信息类型编码
	loadCombotree("mulType",$("#infoTypeM").textbox("getValue"));
}