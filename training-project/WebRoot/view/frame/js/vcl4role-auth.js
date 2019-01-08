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
		$(".btbHead #roleName").text(role.roleName);
		
		//绘制授权菜单
		drawAuthMenuForm();
		
		//加载角色已拥有权限列表
		var roleVclList = loadRoleVclInfo(roleId);
		
		//将角色已拥有的权限设为选中
		for(var i in roleVclList) {
			$("#inputForm :checkbox[value='"+roleVclList[i].menuId+"']").prop("checked",true);
	    } 
		
		//复选框的事件处理函数
	    $("#inputForm .menu3 :checkbox").click(function(){
	    	var parentId = $(this).attr("parentId");
	    	var firstId = $(this).attr("firstId");
	    	
	    	//如果选中，则将一级和二级分类选中
	    	if(this.checked) {
	    		$(".menu1 :checkbox[value='" + firstId + "']").prop("checked",true);
	    		$(".menu2 :checkbox[value='" + parentId + "']").prop("checked",true);
	    	}
	    	else {
	    		//如果此二级分类下未选中其他分类，则取消二级分类选中
	    		if($(".menu3 input:checked[parentId='" + parentId + "']").size() == 0 ) {
	    			$(".menu2 :checkbox[value='" + parentId + "']").prop("checked",false);
	    		}
	    		
	    		//如果此一级分类下未选中其他分类，则取消一级分类选中
	    		if($(".menu2 input:checked[parentId='" + firstId + "']").size() == 0 ) {
	    			$(".menu1 :checkbox[value='" + firstId + "']").prop("checked",false);
	    		}
	    	}
	    });
	    
	    //复选框的事件处理函数
	    $("#inputForm .menu2 :checkbox").click(function(){
	    	//全选或全取消
	    	$(".menu3 :checkbox[parentId='" + this.value + "']").prop("checked",this.checked);
	    	
	    	var firstId = $(this).attr("parentId");
	    	
	    	//如果选中，则将一级选中
	    	if(this.checked) {
	    		$(".menu1 :checkbox[value='" + firstId + "']").prop("checked",true);
	    	}
	    	else {
	    		//如果此一级分类下未选中其他分类，则取消一级分类选中
	    		if($(".menu2 input:checked[parentId='" + firstId + "']").size() == 0 ) {
	    			$(".menu1 :checkbox[value='" + firstId + "']").prop("checked",false);
	    		}
	    	}
	    });
	    
	    //复选框的事件处理函数
	    $("#inputForm .menu1 :checkbox").click(function(){
	    	$(".menu3 :checkbox[firstId='" + this.value + "']").prop("checked",this.checked);
	    	$(".menu2 :checkbox[parentId='" + this.value + "']").prop("checked",this.checked);
	    });
	});
	
	/**
	 * 功能：绘制授权菜单
	 * @param null
	 */
	function drawAuthMenuForm(){
		/*绘制第一级菜单*/
		//加载第一级菜单数据
		var menu1 = loadMenu();
		if(menu1.length != 0){
			$(menu1).each(function(index,item){
				$("#inputForm").append("<div class='menu' style='position:relative;'><div class='menu1'><div class='checkbox'><input type='checkbox' name='menuIds' value='"+item.id+"'/></div><span  class='checkbox-text'>"+item.text+"</span></div></div>");
				//加载第二级菜单
				var menu2 = loadMenu(item.id);
				if(menu2.length != 0){
					var menu1obj = $("#inputForm [value='"+item.id+"']").parent().parent().parent();
					var menu2parentId = item.id;
					$(menu2).each(function(index,item){
						$(menu1obj).append("<div class='menu2'><div class='checkbox'><input type='checkbox' name='menuIds' value='"+item.id+"' parentId='"+menu2parentId+"'/></div><span  class='checkbox-text'>"+item.text+"</span></div>");
						//加载第三级菜单
						var menu3 = loadMenu(item.id);
						if(menu3.length != 0){
							$("#inputForm [value='"+item.id+"']").parent().parent().parent().append("<div class='line'></div>");
							var menu2obj = $("#inputForm [value='"+item.id+"']").parent().parent().next();
							var menu3parentId = item.id;
							var menu3firstId = $("#inputForm [value='"+item.id+"']").attr("parentId");
							$(menu3).each(function(index,item){
								if(index!=0 && (index)%4==0){
									$(menu2obj).parent().append("<div class='line'></div>");
									menu2obj = $(menu2obj).next();
									
								}
								$(menu2obj).append("<div class='menu3'><div class='checkbox'><input type='checkbox' name='menuIds' value='"+item.id+"' parentId='"+menu3parentId+"' firstId='"+menu3firstId+"'/></div><span  class='checkbox-text'>"+item.text+"</span></div>");
							});
						}
					});
				}
			});
		}
	}

	/**
	 * 功能：根据角色编号加载角色信息
	 * @param roleId 角色编号
	 * @returns roleInfo 角色信息
	 */
	function loadRoleInfoById(roleId){
		var role;
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
	 * 功能：加载角色已拥有权限列表
	 * @param 无
	 */
	function loadRoleVclInfo(roleId){
		var roleVclList;
		$.ajax({
			type: 'post',
			async: false,
			data: {'roleId':roleId},
			url: basePath+"/frame_manage_find_vclbyroleid.json",
			success: function(data){
				roleVclList = data.rolevcls;
			},
			error: function(){
				alert("加载角色已拥有权限失败！");
			}
		});
		return roleVclList;
	}
	
	/**
	 * 功能：根据菜单编号加载菜单信息
	 * @param menuId
	 */
	function loadMenu(menuId){
		var data;
		var menus;
		//当menuId未定义时，设为null
		if(menuId == undefined){
			data = {'isUsed':1};
		} else{
			data = {'id':menuId,'isUsed':1};
		}
		$.ajax({
			type: 'post',
			async: false,
			data: data,
			url: basePath+"/frame_manage_menu_findmenu.json",
			success: function(data){
				menus = data.rows;
			},
			error: function(){
				alert("加载菜单失败！");
			}
		});
		
		return menus;
	}
	
	/**
	 * 功能：返回选择授权角色的页面
	 * @param 无
	 */
	function reback(){
		window.location.replace("vcl4role.html");
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
	 * 功能：保存功能授权信息事件处理函数
	 * @param 无
	 */
	function saveAuthFunc(){
		var formData = $("#inputForm :checked").serializeObject();
		var menuIds = formData.menuIds;
		if(menuIds!=null){
			if(typeof roleIds=="string"){
				
			}else if(menuIds){
				formData.menuIds = menuIds.join(",");
			}
		}
		formData["memberId"] = roleId;
		$.ajax({
			type: 'post',
			async: false,
			data: formData,
			url: basePath+"/frame_manage_insert_rolevcl.json",
			success: function(data){
				if(data.resultCode==1){
					$.messager.confirm('确认提示', '授权信息保存成功，是否返回授权角色选择页面?', function(r){
						if (r){
							reback();
						}
					});
				} else{
					$.messager.alert("提示信息","授权信息保存失败！","error");
				}
			},
			error: function(){
				$.messager.alert("提示信息","授权信息保存失败！","error");
			}
		});
	}
	