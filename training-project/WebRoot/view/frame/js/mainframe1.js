//当前登录的用户信息
var user;

/**
 * 获取icon
 * @param iconId
 * @returns {String}
 */
function getIcons(iconId){
	var iconPath = '';
	//获取icon
	$.ajax({
		url:basePath+"/frame_mainframe_findicons.json",
		type:"post",
		data:{iconsId:iconId},
		dataType:"json",
		async:false,
		success:function(data){
			iconPath = data.icons.rows.userFilePath;
		}
	});
	return iconPath;
}

/**
 * 页面加载完成后就执行
 */
$(function(){
	//首页图片
	$("#content").attr("src","img.html");
	$(".divHead_title").css("background-image","url("+basePath+"/"+getIcons('03.jpg')+")");
	
	//问候语
	$.ajax({
		url:basePath+"/frame_mainframe_welcome.json",
		type:"post",
		dataType:"json",
		success:function(data){
			$("#welcome").text(data.welcome);
		}
	});
	
	//查找当前登录用户信息
	$.ajax({
		url:basePath+"/apron_punish_sysrole_finduser.json",
		type:"post",
		dataType:"json",
		async:false,
		success:function(data){
			user = data.user;
			$("#userName").text(user.userName);
			var text = user.deptName;
			if(user.roleNameList){
				text += "/"+user.roleNameList;
			}
			$("#deptRole").text(text);
		}
	});
	
	//查询当前登录用户拥有权限的菜单
	$.ajax({
		url:basePath+"/frame_manage_menu_findusermenu.json",
		type:"post",
		data:{roleList:user.roleList},
		dataType:"json",
		success:function(data){
			data = data.rows;
			loadMenu(data[0].id);
			for(var i in data){
			$("<div class='divNav_every'><a>&nbsp;&nbsp;&nbsp;"+data[i].text+"</a></div>")
				.attr("id",data[i].id)
				.appendTo($(".divNav_inner"))
				.mouseover(function(){
					this.className = "divNav_everyHover";
				})
				.mouseout(function(){
					this.className = "divNav_every";
				})
				.click(function(){
					loadMenu($(this).attr("id"));
					if($("#left").css("display")=="none"){
						$(".easyui-layout").layout("expand","west");
					}
				});
			}
		}
	});
	
	//主题列表
	$.ajax({
		url:basePath+"/frame_mainframe_findthemes.json",
		type:"post",
		dataType:"json",
		success:function(data){
			var themes = data.themeList;
			for(var i = 0;i<themes.length;i++){
				$('#menuStyle').menu('appendItem', {
					id:themes[i].themeName,
					text:themes[i].themeDesc,
					href:basePath+"/"+themes[i].mainFrameUrl,
					onclick: function(){
						//将主题名称保存到cookie
						cookie('ezframe.theme', this.id, {expires: 7,path:basePath});
					}
				});
			}
		}
	});
	
	//设置版权信息
	$("#frameTitle").text(copyright('frame.title'));
	$("#frameCopyright").text(copyright('frame.copyright'));
	
	//每隔60秒自动调用updateLastAccessTime函数,让服务端更新最近访问时间
	window.setInterval(updateLastAccessTime, 60 * 1000);
});

/**
 * 每隔60秒钟调用一下这个函数，去向服务器发送一个请求，让服务端更新最近访问时间
 */
function updateLastAccessTime(){
	try{
		//调用dwr更新最近访问时间
		sysLog.updateLastAccessTime();
   	}catch(e){
   		
   	}
}

/**
 * 加载菜单数据
 * 参数：rootId 跟菜单的ID
 */
function loadMenu(rootId){
	$("#leftMenu").empty();
	$.ajax({
		url:basePath+"/frame_manage_menu_navmenu.json",
		type:"post",
		data:{menuId:rootId,roleList:user.roleList},
		dataType:"json",
		success:function(data){
			data = data.rows;
			$("#leftMenu").navMenu({
				width:'100%',
				height:'auto',
				lineHeight:'30px',
				hover:'pink',
				icon_open:'../../navigat/images/open.png',
				icon_close:'../../navigat/images/close.png',
				icon_size:'7%',
				border:'1px solid #efefef',
				
				head_background:'#f4f4f4',
				head_fontFamily:'Avenir',
				head_fontWeight:'400',
				head_color:'#4c4c4c',
				
				item_color:'#4c4c4c',
				item_fontSize:'14px',
				item_fontWeight:'400',
				item_background:'#fff',
				item_hover:'#e2f1fb',
				item_active:'#aadbfa',
				
				data:data,
				onItemClick:function(childrenItem){
					var url = basePath + "/" + childrenItem.url.trim();
					$("#content").attr("src",url);
					
					//点击添加操作日志
					$.ajax({
						url:basePath+"/fram_sys_operatelog_add.json",
						type:"post",
						dataType:"json",
						data:{moduleId:childrenItem.id,userId:user.userId},
						success:function(data){
							if(data.menu != " " && data.menu != null) {
								var url = basePath + "/" + data.menu.url.trim();
								$("#content").attr("src",url);
							}
						}
					});
				}
			});
		}
	});
}

/**
 * 修改密码
 */
function changePwd(){
	$("#userName_form").text(user.userName);
	$("[name='userId']").val(user.userId);
	pwdValid();
	$("#changePwd").show().dialog({
		iconCls:"icon-edit",
		modal: true,
		title:"修改密码",
		onClose:function(){
			$("#form_changePwd").form("reset");
		}
	});
}

/**
 * 退出系统
 */
function logout1(){
	if(window.confirm("请确认是否现在就退出系统？")){
		$.ajax({  
			url:basePath + "/frame_mainframe_logout.json",
			type:"post",
			dataType:"json",  
			success:function(data) {
				if(data.resultCode==1) {
					window.location = basePath+"/enter.action";
				}
				else
					$.messager.alert("错误","退出过程中出现问题!","error");
			},  
			error : function() {
				$.messager.alert("错误","服务器内部错误!","error");
			}
		});
	}
}

/**
 * 修改密码保存按钮
 */
function doSave(){
	if($("#form_changePwd").form('validate')) {
		var formData = $("#form_changePwd").serializeObject();
		formData.logicId = "09.01.05";
		$.ajax({
			url: logicUrl,
			type: "post",
			data: formData,
			dataType: "json",
			success: function(data){
				if(data.resultCode==1){
					doClose();
				}else if(data.resultCode==2){
					$.messager.alert("提示信息","密码输入错误！","info");
				}else{
					$.messager.alert("提示信息","密码修改失败！","info");
				}
			}
		});
	}
}

/**
 * 校验输入数据
 */
function pwdValid(){
	$("[name='oldPassword']").validatebox({
		required:true,
		missingMessage:"请输入原密码"
	});
	$("[name='password']").validatebox({
		required:true,
		missingMessage:"请输入新密码",
		invalidMessage:"密码的最小长度不能小于6位",
		validType:"minLength[6]"
	});
	$("[name='surePassword']").validatebox({
		required:true,
		missingMessage:"请再次输入新密码",
		invalidMessage:"两次密码不一致",
		validType:"equals['#password']"
	});
}

/**
 * 关闭按钮
 */
function doClose(){
	$("#changePwd").dialog("close");
}

/**
 * 扩展validatebox校验规则
 */
$.extend($.fn.validatebox.defaults.rules, {
	minLength:{
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字符.'
    },
    equals: {
		validator: function(value,param){
			return value == $(param[0]).val();
		},
		message: 'Field do not match.'
    }
});

/**
 * 查询版权信息
 * @param paramId 系统参数
 */
function copyright(paramId) {
	var param = "";
	$.ajax({
		url:basePath + "/apron_punish_sysparam_findbyid.json",
		type:"post",
		async:false,
		data:{paramId:paramId},
		success:function(data){
			param = data.param.paramValue;
		}
	});
	return param;
}