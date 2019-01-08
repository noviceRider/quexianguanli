/**
 * 
 */
$(function(){
	/**
	 * 表单验证-非空
	 */
	$.extend($.fn.validatebox.defaults.rules,{	
		NotEmpty : { // 非空字符串验证。 easyui 原装required 不能验证空格				
			validator : function(value, param) {
				return $.trim(value).length>0;			
			}, 			
			message : '该输入项为必输项'}
	});

	//数据网格加载数据
	searchIssue();
	
	//加载增加面板
	$("#addIssueContainer").load("addIssue.html",null,function(){
		//增加面板初始化
		$("#addIssuePanel").dialog({
			title:"增加新缺陷",
			iconCls:"icon-save",
			width:200,
			height:200,
			closed:true,
			modal:true,
			buttons:"#saveBtnA",
			onBeforeClose:function () { 
				//调用方法清空增加面板的数据
				resetAddForm();
		        }
			});
			$("#addTypeCode").textbox({
				iconCls:"icon-man",
				width:120
			});
			$("#addTypeDesc").textbox({
				panelHeight:50,
				width:120
			});
			//提交增加表单
			$("#addIssueForm").form({
				url:basePath+"/addIssueClassification.json",
				novalidate:false,
				success:function(data){
					if(JSON.parse(data)!=0){
						$("#addIssuePanel").dialog("close");
						resetAddForm();
						searchIssue();
						$("#addIssuePanel").dialog({closed:true});
					}
					else{
						$.messager.alert("警告","新增失败");
						resetAddForm();
					}
				}
			//初始化页面提交按钮
			})
			$("#addFormSubmit").linkbutton({
			text:"保存",
			iconCls:"icon-save",
			onClick:function(){
				
				$("#addIssueForm").submit();	
			}
		})	
	})
	
		//加载修改面板
			$("#modifyIssueContainer").load("modifyIssue.html",null,function(){
		//修改面板初始化
		$("#modifyIssuePanel").dialog({
			title:"修改缺陷",
			iconCls:"icon-save",
			width:200,
			height:200,
			closed:true,
			modal:true,
			buttons:"#saveBtnM",
			onBeforeClose:function () { 
				//调用方法清空增加面板的数据
				resetmodifyForm();
		        }
			});
			$("#modifyTypeCode").textbox({
				iconCls:"icon-man",
				width:120
			});
			$("#modifyTypeCode").textbox({readonly:true});
			$("#modifyTypeDesc").textbox({
				panelHeight:50,
				width:120
			});
			//提交修改表单
			$("#modifyIssueForm").form({
				url:basePath+"/modifyIssueClassification.json",
				novalidate:false,
				success:function(data){
					if(JSON.parse(data)!=0){
						$("#modifyIssuePanel").dialog("close");
						resetmodifyForm();
						searchIssue();
						$("#modifyIssuePanel").dialog({closed:true});
					}
					else{
						$.messager.alert("警告","修改失败");
						resetmodifyForm();
					}
				}
			//初始化页面提交按钮
			})
			$("#modifyFormSubmit").linkbutton({
			text:"保存",
			iconCls:"icon-save",
			onClick:function(){
				$("#modifyIssueForm").submit();
			}
		})	
	})
	
	//加载详细信息面板
				$("#infoIssueContainer").load("ditalsInfo.html",null,function(){
		//修改面板初始化
		$("#infoIssuePanel").dialog({
			title:"详细信息",
			iconCls:"icon-save",
			width:280,
			height:300,
			closed:true,
			modal:true,
			buttons:"#saveBtnd",
			onBeforeClose:function () { 
				//调用方法清空增加面板的数据
				$("#infoIssueForm").form("reset");
		        }
			});
			
			//提交修改表单
			$("#infoFormSubmit").linkbutton({
			text:"关闭",
			onClick:function(){
				$("#infoIssuePanel").dialog({closed:true});
			}
		})	
	})		
});
	
	//删除issue数据
	function delIssueTable(){
		var rows =$("#issueTypeTable").datagrid("getSelections");
		if(rows.length == 0){
			$.messager.alert('警告','请先选中要删除的记录');
			return;
		}$.messager.confirm('确认','您确认想要删除记录吗？',function(r){    
		    if (r){    
		    	var delIds=[];
		    	rows.forEach(obj=>{
		    		delIds.push(obj.typeCode);
		    	});
		    	$.ajax({
		    		url:basePath+"/DelClassification.json",
		    		type:"post",
		    		data:{"delIds":delIds},
		    		dataType:"json",
		    		success:function(data){
		    			 if(data.result==1){
		    				 $.messager.alert("信息","删除成功！！");
							
							 return;
						 }else{
							 $.messager.alert("警告","删除失败！！");
						 }
		    			 searchIssue();
		    		}
		    	});  
		    }
		})
	}

	//显示添加面板
	function addIssueTable(){
		$("#addIssuePanel").dialog("open");
		validateMetamanage()
		}
	
	//显示编辑issue数据的面板并且显示数据
	function editIssueTable(){
		
		var rows =$("#issueTypeTable").datagrid("getSelections");
		if(rows.length != 1){
			$.messager.alert('警告','一次修改一条数据的记录');
			
			return;
			}else{
		$("#modifyIssuePanel").dialog("open");
		 var typeCode=rows[0].typeCode;
		 //发送请求得到后台数据并且显示
		 $.post(basePath+"/searchIssueForModify.json",
	    			{"typeCode":typeCode},
	    			function(data){
	    				var issueTypePo =data.result;
    					$("#modifyTypeCode").textbox("setValue",issueTypePo.typeCode);
    					$("#modifyTypeDesc").textbox("setValue",issueTypePo.typeDesc);
	    				},
				    	"json");
			}
	}
	
		//模糊查询并且加载数据
		function searchIssue(){
			$("#issueTypeTable").datagrid( Common.createDatagridOptionsParams(basePath, "/DefectClassification.json",135,{"keyWords":$("#searchIssue").val()}));
			//每次查询后都自动清空搜索框内的数据
			$("#searchIssue").textbox("setValue","");
		}
		
		//清空修改表单面板的数据
		function resetmodifyForm(){
			$("#modifyTypeCode").textbox("setValue","");
			$("#modifyTypeDesc").textbox("setValue","");
		}
		
		//清空增加表单的数据
		function resetAddForm(){
			$("#addTypeCode").textbox("setValue","");
			$("#addTypeDesc").textbox("setValue","");
			}
		
		//改变禁用启用
		function changeStatue(value,row,index){
			if(row.dictCode == "00"){
			return '<a href="#" style="color:red" onclick="modifyStatue(\''+row.dictCode+'\',\''+row.typeCode+'\')">&nbsp;启用&nbsp;</a>' +
			"&nbsp;/&nbsp;" +
				"<a href='#' style='color:blue;' onclick='showDetaiInfo(this)'>&nbsp;详情&nbsp;<a/>"
			}else{
				return'<a href="#" style="color:blue" onclick="modifyStatue(\''+row.dictCode+'\',\''+row.typeCode+'\')">&nbsp;禁用&nbsp;</a>' +
				"&nbsp;/&nbsp;" +
				"<a href='#' style='color:blue;' onclick='showDetaiInfo(this)'>&nbsp;详情&nbsp;<a/>"
			}	
		}
		//改变状态图标
		function iconStatu(value,row,index){
			if(row.dictCode == "01"){
				return "<img src='../../../../css/themes/icons/ok.png'/>";
			}else{
				return "—";
			}
		}
		//修改启用禁用的状态
		function modifyStatue(dictCode,typeCode){
			
			$.post(basePath+"/modifyDictDesc.json",
	    			{"dictCode":dictCode,"typeCode":typeCode},
	    			function(data){
	    				searchIssue();
	    				},
				    	"json");
		}
		
		//显示详细信息的面板并且显示数据
		function showDetaiInfo(dom){
			var typeCode =$(dom).parents("tr").find("[field='typeCode']").text();
			
			$.post(basePath+"/showDetaiInfo.json",
	    			{"typeCode":typeCode},
	    			function(data){
	    				for(var key in data.result){
	    					if($("#info"+key+"").length>0){
	    						$("#info"+key+"").text(data.result[""+key+""]);
	    					}
	    				}
	    				
	    				},
	    				
				    	"json");
			
			$("#infoIssuePanel").dialog({closed:false});
		}
		//表单非重验证
		function validateMetamanage() {
			$("#addTypeCode").textbox({
				required:true,
				missingMessage:"编号不能为空",
				invalidMessage:"编号已存在",
				validType:"remoteValid['"+basePath+"/jvalidatePriorityCode.json','typeCode']"
			});
		}
		