/**
* 功能：页面加载完毕后执行的函数，相当于window.onload的作用
* 参数：无
**/
jQuery(function() {
	//光标初始定位在原密码输入域
	$('oldPassword').focus();

	//构造强制修改密码的提示文字
	handleForceModifyTip();
	
	//对输入框进行修饰，隔行显示一种色彩
	decorateTable('#modiUser.btbForm');
	
	//调整输入域，使得宽度一致
	jQuery('#modiUser.btbForm tr td input').width(160);
	
	//处理form校验
	jQuery("#form1").validate({
		messages: {
			oldPassword: {
				required: "请输入原密码",
				minlength: "密码的最小长度不能小于6位"
			},
			'user.password': {
				required: "请输入新密码",
				minlength: "密码的最小长度不能小于6位"
			},
			confirmNewPassword: {
				required: "请再次输入新密码",
				minlength: "密码的最小长度不能小于6位",
				equalTo: "请输入和新密码相同的数据"
			},
			'user.email': "请输入合法的邮箱地址"
		},
		
		/**
		* 功能：form的提交处理函数
		**/
		submitHandler: function() {
			//调用保存用户信息的url，并将返回的结果写入到messageInfo中
			var url = "user!save.action";
			new Ajax.Updater('messageInfo', url,
				{
					method: 'post',
					parameters: $('form1').serialize(),
					asynchronous: false,
					evalScripts: true,   //允许执行js
					onComplete: function() {
						//根据处理结果做页面跳转
						jumpHandle();
					}
				}
			);
		}
	});
	
	//确保两次输入的新密码相同
	jQuery("#confirmNewPassword").blur(function() {
		jQuery(this).valid();
	});
	
});

/**
* 根据强制修改的变量forceModify和forceType来动态构造强制修改用户信息的提示文字
**/
handleForceModifyTip = function() {
	var forceModify = $F('forceModify');
	var forceType = $F('forceType');
	
	//只有强制修改密码的时候才做处理
	if(forceModify == '1') {
		if(forceType == '0') {
			$('forceModiTip').innerHTML = '由于您是第一次登录系统，请修改默认密码后方能正常使用系统';
		}
		else {
			$('forceModiTip').innerHTML = '由于您的密码已经超过设定的有效期限，请修改原密码后方能正常使用系统';
		}
	}
}

/**
* 功能：根据保存用户信息返回的结果进行相应的跳转
*	   如果是用户自主修改，就不跳转，如果是强制修改，就跳转到对应的主框架url
**/
jumpHandle = function() {
	var forceModify = $F('forceModify');
	var resultCode = $('resultCodeSpan').getAttribute('resultCode');
	
	//是强制修改，并且保存成功
	if(forceModify == 1  && resultCode == 0) {
		//首先在用当前用户名和密码重新登录一次系统
		//由于刚刚修改成功，所以登录一定成功
		login.auth($F('userId'), $F('newPassword'), $F('companyId'),
			function(data) {
				var mainFrameUrl = "";
				
				//是否认证成功，由于刚刚修改成功，所以登录一定成功
				if(data == 0) {
					//是合法用户，进一步取得该主题对应的主框架url
					login.getMainFrameUrl($F('themeName'), function(data){
							//跳转到对应的主框架页面
							window.location = data;
						});
				}
			});
	}
	else if(resultCode == 1) {
		//原密码不正确，光标定位在原密码的输入域
		$('oldPassword').focus();
		$('oldPassword').select();
	}
}