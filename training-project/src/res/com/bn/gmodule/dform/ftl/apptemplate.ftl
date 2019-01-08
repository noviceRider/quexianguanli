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
	<script type="text/javascript" src="../../js/dictSingleSelect.js"></script>
  </head>
  <body onload="init()">
    <table style="width:100%;padding:5px;" id="navigate">
    	<tr>
    		<td style="width:25%">
    			<img src='../../images/common/title.gif' style="vertical-align:middle;"><label id="navigate_title">${title}</label>
    		</td>
    		<td style="text-align: right;" id="navigate_btns">
    			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="query()">查询</a>
    			<a class="easyui-linkbutton" data-options="iconCls:'icon-add'" onclick="add()">新增</a>
				<a class="easyui-linkbutton" data-options="iconCls:'icon-edit'" onclick="modify()">修改</a>
				<a class="easyui-linkbutton" data-options="iconCls:'icon-remove'" onclick="remove()">删除</a>
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
					
					//修改选中数据
					modify();
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
	  		//判断是否是数据字典页面查询请求
	  		
	  		if("${dictSign}"!=""){
	  			//判断用户是否已经选择数据类型
	  			if("${selectedTypeCode}"!=""){
	  				var params = {};
			  		<#if queryForm??>
			  		  var params = $('#${ queryForm.id}').serializeObject();
			  		  params.type_code="${selectedTypeCode}";
			  		  
			  		</#if>
			  		if('${searchType}'=='1'){
						params.logicId = '${searchAccessCode}';
					}else{
						params.accessId = '${searchAccessCode}';
					}
			  		<#if datagrid??>
				  	  $('#${ datagrid.id}').datagrid('reload',params);
				  	 
				    </#if>
	  			}else{
	  				$.messager.alert("提示信息","请先选择数据类型","info");
	  			}
	  		}else{
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
	  		
	  	}
	  	
	  	//新增
	  	function add(){
			//判断是否是数据字典管理页面新增请求
			if("${dictSign}"!=""){
				//判断用户是否已经选择数据类型
				if("${selectedTypeCode}"!=""){
					if(isEdit){
						$('#${ editPanel.id}').form('reset');
						<#if addFormJsArry??>
							<#list addFormJsArry as addFormJs>
								${ addFormJs}
							</#list>
							
							//数据类型输入框设固定值
							$("#type_code").textbox("setValue","${selectedTypeCode}");
							
							//数据类型输入框不可编辑
							$("#type_code").textbox("disable",true);
							
							//字典类型输入框可编辑
							$("#dict_code").textbox("enable");
							
							<#if editPanel??>
								<#if editPanel.keyId??>
									$('#${ editPanel.id} #${ editPanel.keyId}').textbox('enableValidation');//启用验证
								</#if>
							</#if>
						</#if>
						
						$("#edit_dlg").dialog({
							title: '新增${ editPanel.title}',
							width: '${ editPanel.width}',
							height: '${ editPanel.height}',
							closed: false,
							modal: true,
						});
						
						$("#edit_btns #edit_save").unbind().click(function(){
							
							var isValid = $('#${ editPanel.id}').form('validate');
							if(isValid){
								//数据类型输入框可用以便取值
								$("#type_code").textbox("enable");
								
								var params	= $('#${ editPanel.id}').serializeObject();
								params.type_code="${selectedTypeCode}";
								
								if('${ addType}'=='1'){
								params.logicId = '${ addAccessCode}';
								}else{
								params.accessId = '${ addAccessCode}';
								}	
								$.post(basePath+'/${ editPanel.addUrl}.json', params, function(data){
									if(data.resultCode == 1){
										$('#${ datagrid.id}').datagrid('reload');
										closeEditDlg();
									} else {
										$.messager.alert("提示信息", "新增${ editPanel.title}失败", "error");
									}
								}, 'json');
							}
						});
						
						$("#edit_btns #edit_cancel").unbind().click(closeEditDlg);
					}
				}else{
					$.messager.alert("提示信息","请先选择数据类型","info");
				}
			}else{
				if(isEdit){
					$('#${ editPanel.id}').form('reset');
					<#if addFormJsArry??>
						<#list addFormJsArry as addFormJs>
							${ addFormJs}
						</#list>
						
						<#if editPanel??>
							<#if editPanel.keyId??>
								$('#${ editPanel.id} #${ editPanel.keyId}').textbox('enableValidation');//启用验证
							</#if>
						</#if>
					</#if>
					
					$("#edit_dlg").dialog({
						title: '新增${ editPanel.title}',
						width: '${ editPanel.width}',
						height: '${ editPanel.height}',
						closed: false,
						modal: true,
					});
					
					$("#edit_btns #edit_save").unbind().click(function(){
						var isValid = $('#${ editPanel.id}').form('validate');
						if(isValid){
							var params	= $('#${ editPanel.id}').serializeObject();	
							if('${ addType}'=='1'){
							params.logicId = '${ addAccessCode}';
							}else{
							params.accessId = '${ addAccessCode}';
							}	
							$.post(basePath+'/${ editPanel.addUrl}.json', params, function(data){
								if(data.resultCode == 1){
									$('#${ datagrid.id}').datagrid('reload');
									closeEditDlg();
								} else {
									$.messager.alert("提示信息", "新增${ editPanel.title}失败", "error");
								}
							}, 'json');
						}
					});
					
					$("#edit_btns #edit_cancel").unbind().click(closeEditDlg);
				}
			}
			
		}
	  	
	  	//修改
	  	function modify(){
	  		<#if datagrid??>
	  			var row = $('#${ datagrid.id}').datagrid('getSelected');
		  		if(row == null){
					$.messager.alert("提示信息", "请选择要修改的数据", "info");
				}else{
					if(isEdit){
			  			$('#${ editPanel.id}').form('reset');
			  			<#if editFormJsArry??>
					  		<#list editFormJsArry as editFormJs>
								${ editFormJs}
							</#list>
							<#if editPanel??>
								<#if editPanel.keyId??>
									$('#${ editPanel.id} #${ editPanel.keyId}').textbox('disableValidation');//禁用验证
								</#if>
							</#if>	
						</#if>
						
						$('#${ editPanel.id}').form('load',row);
						
						//判断是否是来自dictSign页面的请求
						if("${dictSign}"!=""){
							//数据类型和字典类型输入框不可修改
							$("#dict_code").textbox("disable");
							$("#type_code").textbox("disable");
						}
							
						$("#edit_dlg").dialog({
							title: '修改${ editPanel.title}',
							width: '${ editPanel.width}',
							height: '${ editPanel.height}',
							closed: false,
							modal: true,
						});
						
						$("#edit_btns #edit_save").unbind().click(function(){
							var isValid = $('#${ editPanel.id}').form('validate');
							if(isValid){
							
								//判断是否是来自dictSign页面的请求
								if("${dictSign}"!=""){
									//数据类型和字典类型输入框可用以便取值
									$("#dict_code").textbox("enable");
									$("#type_code").textbox("enable");
								}
							
								var params	= $('#${ editPanel.id}').serializeObject();		
								if('${ modifyType}'=='1'){
								params.logicId = '${ modifyAccessCode}';
								}else{
								params.accessId = '${ modifyAccessCode}';
								}
								$.post(basePath+'/${ editPanel.modifyUrl}.json', params, function(data){
									if(data.resultCode == 1){
										$('#${ datagrid.id}').datagrid('reload');
										closeEditDlg();
									} else {
										$.messager.alert("提示信息", "修改${ editPanel.title}失败", "error");
									}
								}, 'json');
							}
						});
						
						$("#edit_btns #edit_cancel").unbind().click(closeEditDlg);
			  		}
				}
	  		</#if>
	  	}
	  	
	  	//关闭编辑弹窗
	  	function closeEditDlg(){
	  		$("#edit_dlg").dialog("close");
	  	}
	  	
	  	//删除
	  	function remove(){
		//获取主键
		var keyStr="${keyId}"
		
		//判断是否是来自数据字典页面的请求
		if("${dictSign}"!=""){
			var type_code=keyStr.split("+")[0];
			var dict_code=keyStr.split("+")[1];
			
			<#if datagrid??>
			var rows = $('#${ datagrid.id}').datagrid('getSelections');
			var keyIds = [];
			if(rows.length<1){
				$.messager.alert("提示信息", "请选择要删除的数据", "info");
			}else{
				$.messager.confirm("提示信息","你确定要删除这些数据吗？",function(r){
					if(r){
						var result = true;
						for (var i = 0; i < rows.length; i++) {
							keyIds.push(rows[i].type_code+"+"+rows[i].dict_code);
						}
						
						if(result){
							if(result){
								var a={};
								keyIds = keyIds.join(',');
								a.keyIdsStr=keyIds;
								if('${ deleteType}'=='1'){
									a['logicId'] = '${ deleteAccessCode}';
								}else{
									a['accessId'] = '${ deleteAccessCode}';
								}
								$.ajax({
									url: basePath+"/${ datagrid.deleteUrl}.json",
									data: a,
									type: 'post',
									dataType: 'json',
									async: false,
									success: function(data){
										if(data.resultCode!="1" && data.resultCode!=1){
											result = false;
										}
									}
								});
							}
						}
						if(result){
							$('#${ datagrid.id}').datagrid('reload');
						}else{
							$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
						}
					}
				});
			}
			</#if>
			
			
		}else{
			<#if datagrid??>
			var rows = $('#${ datagrid.id}').datagrid('getSelections');
			var keyIds = [];
			if(rows.length<1){
				$.messager.alert("提示信息", "请选择要删除的数据", "info");
			}else{
				$.messager.confirm("提示信息","你确定要删除这些数据吗？",function(r){
					if(r){
						var result = true;
						for (var i = 0; i < rows.length; i++) {
							keyIds.push(rows[i].${keyId});
						}
						
						if(result){
							if(result){
								var a={};
								keyIds = keyIds.join(',');
	
								a.keyStr=keyIds;
	
								if('${ deleteType}'=='1'){
									a['logicId'] = '${ deleteAccessCode}';
								}else{
									a['accessId'] = '${ deleteAccessCode}';
								}
								$.ajax({
									url: basePath+"/${ datagrid.deleteUrl}.json",
									data: a,
									type: 'post',
									dataType: 'json',
									async: false,
									success: function(data){
										if(data.resultCode!="1" && data.resultCode!=1){
											result = false;
										}
									}
								});
							}
						}
						if(result){
							$('#${ datagrid.id}').datagrid('reload');
						}else{
							$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
						}
					}
				});
			}
			</#if>
		}
	}
    </script>
  </body>
</html>
