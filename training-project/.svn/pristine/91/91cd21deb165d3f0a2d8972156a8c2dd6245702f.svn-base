	//获取页面跳转传递的角色ID参数
	var roleId = GetQueryString("roleId");
	
	/**
	 * 功能：加载授权初始页面
	 * @param 无
	 */
	$(function(){
		//根据角色ID查询角色信息
		var role = loadRoleInfoById(roleId);
		
		//设置角色名称
		$("#searchForm #roleName").text(role.roleName);
		
		//格式化treeGrid网格信息
		formatTreeGrid();
	});
	
	/**
	 * 功能：格式化系统保留否数据列
	 * @param value
	 * @param row
	 * @param index
	 */
	function isPreDefFormatter(value, row, index){
		if(value==1) {
			return  "<img src='../../css/themes/icons/ok.png'/>";
		} 
		else if(value==0){
			return  "—";
		}
	}
	
	
	/**
	 * 功能：格式化是否有效数据列
	 * @param value
	 * @param row
	 * @param index
	 */
	function isUsedFormatter(value, row, index){
		if(value==1) {
			return  "<img src='../../css/themes/icons/ok.png'/>";
		} 
		else if(value==0){
			return  "—";
		}
	}
	
	/**
	 * 功能：格式化treeGrid网格信息
	 */
	function formatTreeGrid(){
		//存储操作权限的局部变量
		var opTypes = [];
		//加载操作权限数组
		$.ajax({
			type: 'post',
			async:false,
			data:{'typeCode':$("#searchForm [name='typeCode']").val()},
			url:basePath + "/resource_manage_loadoptypes_list.json",
			success: function(data){
				opTypes = data.opTypes;
			},
			error: function(){
				alert("系统错误！");
				reback();
			}
		});
		
		/*格式化treeGrid网格信息*/
		//资源操作权限数组长度
		var resAuthesSize = opTypes.length == 0?1:opTypes.length;
		//网格中资源权限宽度
		var resAutheWidth = (60/resAuthesSize).toFixed(0) < 5?'50px':((60/resAuthesSize).toFixed(0)+"%");
		//资源权限数组
		var resAuthes = [];
		//循环添加信息
		for (var i = 0; i < opTypes.length; i++) {
			//资源权限格式化信息
			var resAuthe = {field:'',width:resAutheWidth,title:'',halign:'center',align:'center',formatter:authFormatter};
			resAuthe.field = opTypes[i].opCode;
			resAuthe.title = opTypes[i].opDesc;
			resAuthes.push(resAuthe);
		}
		if(opTypes.length == 0){
			resAuthes.push({field:'tip',width:'60%',title:"<span style='color:red;'>该资源类型没有操作权限</span>",halign:'center',align:'center'});
		}
		if($("#searchForm [name='typeCode']").val()==null||$("#searchForm [name='typeCode']").val()==""){
			resAuthes = [];
			resAuthes.push({field:'tip',width:'60%',title:"<span style='color:red;'>请选择资源类型</span>",halign:'center',align:'center'});
		}
		//设置treegrid初始属性及方法
		$("#ResTreeGrid").treegrid({
			idField: 'resCode',
			treeField: 'resName',
			parentField : 'pResCode',
			animate: true,
			striped:true,
			method: 'post',
			singleSelect:true,
			onBeforeExpand: onBeforeExpand,
			onClickCell:function(field,row){
				if(field=="resName"){
					var children = $("#ResTreeGrid").treegrid("getChildren",row.resCode);
					if(row.childNum>0||children.length>0){
						$(this).treegrid("toggle",row.resCode);
					}
				}
				$(":checkbox[rescode='"+row.resCode+"'][value='"+field+"']").attr('clickstate',true);
			},
			columns:[[
			          {field:'resName',width:'20%',title:'资源名称',halign:'center',align:'left',rowspan:2},
			          {field:'resCode',width:'10%',title:'资源编号',halign:'center',align:'left',rowspan:2},
			          {field:'typeDesc',width:'10%',title:'资源类型',halign:'center',align:'left',rowspan:2},
			          {title:'资源权限',halign:'center',align:'left',colspan:resAuthesSize,width:'60%'}
			          ],resAuthes]
		});
		
		if($("#searchForm [name='typeCode']").val()==null||$("#searchForm [name='typeCode']").val()==""){
		} else{
			//加载treegrid数据
			$.ajax({  
				url: basePath + '/resource_manage_sysres_findres.json',  
				type: 'post',
				async: false,
				data:{'typeCode':$("#searchForm [name='typeCode']").val()},
				dataType: 'json', 
				success:function(data) {
					$("#ResTreeGrid").treegrid('loadData',data);
				},
				error : function() {
					$.messager.alert('错误','服务器内部错误!','error');
				}
			});
		}
		
		//绑定checkbox的值
		bingCheckboxVal();
	}
	
	/**
	 * 功能：节点展开之前的事件
	 * @param row
	 */
	function onBeforeExpand(row){
		//判断是否需要加载子节点
		if(row.children==undefined||row.children==[]){
			var resCode = row.resCode;
			var childNodes = reloadChildrenMenu(row);
			$('#ResTreeGrid').treegrid('append',{
				parent: resCode,  
				data: childNodes
			});
		}
		
		//绑定checkbox的值
		bingCheckboxVal();
		
	}
	
	/**
	 * 功能：加载子节点数据
	 * @param row
	 * @returns
	 */
	function  reloadChildrenMenu(row){
		var menuChildData = undefined;
		row.typeCode = $("#searchForm [name='typeCode']").val();
		row.isAuthRes = "";
		$.ajax({  
			type: 'post',
			async: false,  
			data:row,
			url: basePath + '/resource_manage_sysres_findres.json',  
			success:function(data) {
				menuChildData = data.rows;
			},
			error : function() {
				$.messager.alert('错误','服务器内部错误!','error');
			}
		});
		
		return menuChildData;
	}

	/**
	 * 功能：根据角色编号加载角色信息
	 * @param roleId 角色编号
	 * @returns roleInfo 角色信息
	 */
	function loadRoleInfoById(roleId){
		var role = undefined;
		$.ajax({
			type: 'post',
			data: {'roleId': roleId},
			async: false,
			url: basePath+"/apron_punish_find_sysrolebyid.json",
			success: function(data){
				
				if(data.resultCode == 0){
					reback();
				}
				role = data.role;
			},
			error: function(){
				alert("加载角色信息失败！");
			}
		});
		return role;
	}
	
	
	/**
	 * 功能：返回选择授权角色的页面
	 * @param 无
	 */
	function reback(){
		window.location.replace("vclresource.html");
	}
	
  	/**
  	 * 功能：根据参数名获取url内的参数值
  	 * @param name 参数名
  	 * @returns 该参数名对应的参数值
  	 */
	function GetQueryString(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	
	/**
	 * 功能：打开资源类型选择窗口
	 * @param 无
	 */
	function openrtsw(){
		$("#rtsw #rd").datagrid({
			url: basePath+"/resource_manage_restype_list.json",
			queryParams:{
				"keyWord":$("#rtsw #keyWord").searchbox('getValue')
			}
		});
		$("#rtsw").dialog({
			onClose:function(){
				$("#rtsw").form('clear');
			}
		});
		$("#rtsw").dialog('open');
	}
	
	/**
	 * 功能：资源类型查询
	 * @param value
	 * @param name
	 */
	function doSearch(value,name){
		$("#rtsw #rd").datagrid('load',{"keyWord":value});
	}
	
	/**
	 * 功能：判断是否隐藏分页信息
	 * @param data
	 */
	function onLoadSuccess(data){
		if(data.total<10){
			$("#rtsw .datagrid-pager").hide();
		}else{
			$("#rtsw .datagrid-pager").show();
		}
	}
	
	/**
	 * 功能：双击选择资源类型事件
	 * @param rowIndex
	 * @param rowData
	 */
	function selectResType(rowIndex,rowData){
		$("#searchForm [name='typeDesc']").val(rowData.typeDesc);
		$("#searchForm [name='typeCode']").val(rowData.typeCode);
		$("#rtsw").dialog('close');
		formatTreeGrid();
	}
	
	/**
	 * 功能：对选中资源类型保存
	 * @param 无
	 */
	function doSave(){
		var typeCodes = Common.getSelectedIds("#rd", "typeCode", "typeCodes");
		var typeDesces = Common.getSelectedIds("#rd", "typeDesc", "typeDesces");
		if(typeCodes.length==0||typeDesces.length){
			$("#searchForm [name='typeDesc']").val("");
			$("#searchForm [name='typeCode']").val("");
			$("#rtsw").dialog('close');
			formatTreeGrid();
			return;
		}
		$("#searchForm [name='typeDesc']").val(typeDesces[0].value);
		$("#searchForm [name='typeCode']").val(typeCodes[0].value);
		$("#rtsw").dialog('close');
		formatTreeGrid();
	}
	
	/**
	 * 功能：关闭选择资源类型的弹窗
	 * @param 无
	 */
	function doCancel(){
		$("#rtsw").dialog('close');
	}
	
	/**
	 * 功能：格式化权限显示数据列
	 * @param value
	 * @param row
	 */
	function authFormatter(value, row){
		return "<input type='checkbox' name='opCodes' clickState=false resCode='"+row.resCode+"' pResCode='"+row.pResCode+"' style='width:16px;height:16px;'/>";
	}
	
	/**
	 * 功能:绑定checkbox的值
	 * @param 无
	 */
	function bingCheckboxVal(){
		 $(":checkbox").each(function(){
			 if($(this).parents('[field]').attr('field')!=undefined){
				 $(this).val($(this).parents('[field]').attr('field'));
			 }
		});
		 
		//复选框事件处理函数
		$(":checkbox").click(function(){
			var rescode = $(this).attr('rescode');
			var prescode = $(this).attr("prescode");
			var opcode = $(this).val();
			selectParentCheckbox(opcode,prescode,this.checked);
			selectChildrenCheckbox(opcode,rescode,this.checked);
		});
		
		/*根据当前角色编号，查询角色某资源是否已拥有该权限，并设checkbox为选中状态*/
		
		//设置查询参数
		var params = {memberId:roleId};
		$.ajax({  
			url: basePath + '/resource_manage_find_sysresauths.json',  
			type: 'post',
			async: false,
			data:params,
			dataType: 'json', 
			success:function(data) {
				var resAuths = data.opAuths;
				if(resAuths==0){
				} else{
					for (var j = 0; j < resAuths.length; j++) {
						if($(":checkbox[rescode='"+resAuths[j].resCode+"'][value='"+resAuths[j].opCode+"']")==undefined){
							return;
						}
						$(":checkbox[rescode='"+resAuths[j].resCode+"'][value='"+resAuths[j].opCode+"']").prop("checked",true);
					}
				}
			},
			error : function() {
				$.messager.alert('错误','加载已拥有权限错误!','error');
			}
		});
	}
	
	/**
	 * 功能：递归设置父节点checkbox状态
	 * @param opcode 操作权限编号
	 * @param prescode 父资源编号
	 * @parem state 选中状态
	 */
	function selectParentCheckbox(opcode,prescode,state){
		if(prescode==undefined){
			return;
		}
		if(state){
			$("tr[node-id='"+prescode+"']").find(":checkbox[value='"+opcode+"']").prop("checked",state);
			prescode = $("tr[node-id='"+prescode+"']").find(":checkbox[value='"+opcode+"']").attr('prescode');
			selectParentCheckbox(opcode,prescode,state);
		} else{
			if($("input:checked[prescode='"+prescode+"'][value='"+opcode+"']").size() == 0){
				$("tr[node-id='"+prescode+"']").find(":checkbox[value='"+opcode+"']").prop("checked",state);
				prescode = $("tr[node-id='"+prescode+"']").find(":checkbox[value='"+opcode+"']").attr('prescode');
				selectParentCheckbox(opcode,prescode,state);
			}
		}
	}
	
	/**
	 * 功能：递归设置子节点checkbox状态
	 * @param opcode 操作权限编号
	 * @param rescode 当前资源编号
	 * @parem state 选中状态
	 */
	function selectChildrenCheckbox(opcode,rescode,state){
		if(rescode==undefined){
			return;
		}
		$(":checkbox[prescode='"+rescode+"'][value='"+opcode+"']").prop("checked",state);
		$(":checkbox[prescode='"+rescode+"'][value='"+opcode+"']").each(function(){
			rescode = $(this).attr('rescode');
			selectChildrenCheckbox(opcode,rescode,state);
		});
	}
	
	/**
	 * 功能：保存授权信息
	 * @param 无
	 */
	function saveResAuths(){
		//保存结果
		var resultCode = 1;
		Common.ajaxLoading();
		/*构造需要保存参数*/
		var resAuth = {resCode:'',opCode:'',memberId:roleId,typeCode:$("#searchForm [name='typeCode']").val(),state:"0",clickState:false};
		$(":checkbox").each(function(){
			if($(this).attr('rescode')==undefined){
				return;
			}
			if($(this).attr('value')==undefined){
				return;
			}
			resAuth.resCode = $(this).attr('rescode');
			resAuth.clickState = $(this).attr('clickState');
			resAuth.opCode = $(this).attr('value');
			resAuth.state = (this.checked==false)?"0":"1";
			$.ajax({  
				url: basePath + '/resource_manage_insert_sysresauth.json',  
				type: 'post',
				async: false,
				data: resAuth,
				dataType: 'json', 
				success:function(data) {
					resultCode = data.resultCode;
				}
			});
		});
		
		Common.ajaxLoadEnd();
		//保存完毕，提示
		if(resultCode==1){
			$.messager.confirm('确认提示', '授权信息保存成功，是否返回授权角色选择页面?', function(r){
				if (r){
					reback();
				}
			});
		} else{
			$.messager.alert('错误提示','保存授权信息失败!','error');
		}
	}
