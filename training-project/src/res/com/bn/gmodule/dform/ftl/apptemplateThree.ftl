<!DOCTYPE html>
<html>
  <head>
    <title>${ title}</title>
    <meta charset="UTF-8">
	<meta name="content-type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="../../css/common/main.css" />
	<link rel="stylesheet" type="text/css" href="../../css/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="../../css/themes/icon.css">
	<script type="text/javascript" src="../../js/jquery.min.js"></script>
	<script type="text/javascript" src="../../js/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="../../js/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="../../js/ejs_production.js"></script>
	<script type="text/javascript" src="../../js/common.js"></script>
  </head>
  <body onload="init()">
    <table style="width:100%;padding:5px;" id="navigate">
    	<tr>
    		<td style="width:25%">
    			<img src='../../images/common/title.gif' style="vertical-align:middle;"><label id="navigate_title">${title}</label>
    		</td>
    		<td style="text-align: right;" id="navigate_btns">
    			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="query()">查询</a>
    		</td>
    	</tr>
    </table>
  	<#if queryForm??>
    ${ queryForm.html}
    </#if>
  	<#if datagrid??>
    ${ datagrid.html}
    </#if>
    
    <div id="editPanel" style="display:none;">
	</div>
    <script>
    	var isEdit = false;
    	<#if dataFormat??>
    		${ dataFormat}
    	</#if>
    	
    	//初始化
	  	function init(){
	  		
			initQueryForm();
			query();
			
			<#if editPanel?? && moudleCode?? && editPanel.html??>
				isEdit = true;
			</#if>
			
			if(isEdit){
				var loadUrl = "${ moudleCode}_1.html";
				$("#editPanel").load(loadUrl,null,function(){
					$.parser.parse(this);
				});
			}
			
			//给数据网格设置属性事件
			$('#${ datagrid.id}').datagrid({
				//行的单击事件
				onClickRow:function(index,row){
					//取消所有选择行
					$('#${ datagrid.id}').datagrid("uncheckAll");
					//选中当前行
					$('#${ datagrid.id}').datagrid("checkRow",index);
				},
				onDblClickRow:function(index,row){
					//取消所有选中行
					$('#${ datagrid.id}').datagrid("uncheckAll");
					//选中当前行
					$('#${ datagrid.id}').datagrid("checkRow",index);
				}
			});
	  	};
	  	
	  	//初始化查询表单
	  	function initQueryForm(){
	  		<#if queryFormJsArry??>
		  		<#list queryFormJsArry as queryFormJs>
					${queryFormJs}
				</#list>
			</#if>
	  	}
	  	
	  	//查询
	  	function query(){
	  		var params = {};
	  		<#if queryForm??>
	  		  var params = $('#${ queryForm.id}').serializeObject();
	  		</#if>
	  		if('${searchType}'=='1'){
				params.logicId = '${searchAccessCode}';
			}else{
				params.accessId = '${searchAccessCode}';
			}
	  		<#if datagrid??>
		  	  $('#${ datagrid.id}').datagrid('reload',params);
		    </#if>
	  	}
	  	
    </script>
  </body>
</html>
