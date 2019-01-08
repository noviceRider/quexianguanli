//定义jquery插件selectAreaPlugin
(function($) {
	var methods =  {
	
		init : function(options) {
			// 默认参数
			var defaults = {
				"selShopId":"shopId", // 门店combox的id
				"selUserId":"userId", // 员工combox的id
				"typeCode":"", // 加载门店数据的typeCode
				"defaultshopId":"", // 根据defaultshopId加载员工数据
				"defaultuserId":"", // 默认设置的员工值
				'required': false,	//门店信息是否是必选
				'missingMessage': '请选择一个数据项',	//必输的时候的提示
				'showShopCbb' : 1, // 是否显示门店，默认显示，不显示时shopId必须有值
				'shopWidth' : '120px', // 门店选择的宽度
				'userWidth' : '120px', // 员工选择的宽度
			};
			
			var settings = $(this).data('settings');
            if(!settings) {
            	settings = $.extend({id: this.attr('id')}, defaults);
            }
            
            //使用外部传入的参数更新默认参数
            $.extend(settings, settings, options);
            $(this).data('settings', settings);

			// 创建门店员工选择插件
            initShopUserData($(this).data('settings'));
		},
		
		// 获取选择的员工代码
		getValue : function() {
			return $("#" + $(this).data('settings').selUserId).combobox("getValue");
		},
		// 设置选择的员工代码
		setValue : function(value) {
			$("#" + $(this).data('settings').selUserId).combobox("setValue", value);
		},
		// 获取选择的员工描述
		getText : function() {
			return $("#" + $(this).data('settings').selUserId).combobox("getText");
		},
		setText : function(text) {
			$("#" + $(this).data('settings').selUserId).combobox("setText", text);
		},
		
		//  获取选择的门店代码
		getShopValue:function(){
			return $("#" + $(this).data('settings').selShopId).combobox("getValue");
		},
		// 设置选择的门店代码
		setShopValue : function(value) {
			$("#" + $(this).data('settings').selShopId).combobox("setValue", value);
			
			// 重新加载员工代码combobox中的数据
			var userIdObj = $("#" + $(this).data('settings').selUserId);
			
			reloadUserData(userIdObj,value,$(this).data('settings'));
		},
		//  获取选择的门店描述
		getShopText:function(){
			return $("#" + $(this).data('settings').selShopId).combobox("getText");
		},
		// 设置选择的门店描述,只是改变名称，重新加载门店代码
		setShopText : function(text) {
			$("#" + $(this).data('settings').selShopId).combobox("setText", text);
		},
		
		// 获取combox中的所有值的代码
		getAllCode : function() {
			return $("#" + $(this).data('settings').selShopId).combobox("getValue") + ","
					+ $("#" + $(this).data('settings').selUserId).combobox("getValue");
		},
		// 设置选combox中的所有值的代码
		setAllCode: function(allParams) {
			$("#" + $(this).data('settings').selShopId).combobox("setValue",
					allParams.shopVal);
			
			// 重新加载员工代码combobox中的数据
			var userIdObj = $("#" + $(this).data('settings').selUserId);		
			reloadUserData(userIdObj,allParams.shopVal,$(this).data('settings'));
			
			// 设置员工的值
			$("#" + $(this).data('settings').selUserId).combobox("setValue",
					allParams.userVal);
		},
		
		// 获取combox中的所有值的描述
		getAllDesc : function() {
			return $("#" + $(this).data('settings').selShopId).combobox("getText") + ","
					+ $("#" + $(this).data('settings').selUserId).combobox("getText");
		},
		
		// 设置combox中的所有值的描述
		setAllDesc : function(allParams) {
			$("#" + $(this).data('settings').selShopId).combobox("setText",
					allParams.shopVal);
			$("#" + $(this).data('settings').selUserId).combobox("setText",
					allParams.userVal);
		}
	};

	// 定义selectShopUserPlugin插件，实际上会调用methods中的方法
	$.fn.selectShopUserPlugin = function(method) {
		// 方法调用
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method
					+ 'does not exist on jQuery.selectShopUserPlugin');
		}
	};
	
	// 定义方法
	
	/**
	 * 初始化 加载数据
	 */
	function initShopUserData(params){	

		// 先初始化combox
		initShopUserCombox(params);
		
		var shopData = loadShopData(params.typeCode);
		
		// 触发门店数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
		if (params.onLoadShopData)
			shopData = params.onLoadShopData(shopData);
		
		$('#' + params.selShopId).combobox("loadData", shopData);
		
		if(params.defaultshopId){
			$("#" + params.selShopId).combobox("setValue", params.defaultshopId);
			
			reloadUserData($('#' + params.selUserId), params.defaultshopId, params);
			
			if(params.defaultuserId) $("#" + params.selUserId).combobox("setValue", params.defaultuserId);
		}else{
			reloadUserData($('#' + params.selUserId), params.defaultshopId, params);
		}
	}

	/**
	 * 初始化combox
	 */
	function initShopUserCombox(params){
		
		// 通过id得到页面div来装combobox
		var div = $("#" + params.id);
		
		// 判断div中是否已经创建combox
		if ($(div).html() == null || $(div).html() == ""){
			var shopSel = $("<select id='" + params.selShopId
					+ "' name='"+ params.selShopId +"' class='easyui-combobox'  style='width:"
					+ params.shopWidth + ";'></select>");
			
			var userSel = $("<select id='"+params.selUserId+"' name='"+params.selUserId+"' class='easyui-combobox'  style='width:"
					+ params.userWidth +";' " +
	            (params.required ? "data-options='required:true,missingMessage:\"" + params.missingMessage + "\"'" : "") + "></select");
		}
		
		// 把combox放在div里面
		div.append(shopSel);
		//显示门店数据的时候才在两个控件之间加入空格
		if(params.showShopCbb == 1) div.append("&nbsp;&nbsp;");	
		div.append(userSel);
		
		// 数据类型combox
		$("#" + params.selShopId).combobox({
	        valueField: 'shopId',
	        textField: 'shopName',
	        panelHeight: 'auto',
	        editable: false,
	        onSelect: function (rec) {
	            //重新加载员工combobox中的数据
	            var selUserIdObj = $("#" + params.selUserId);
	            reloadUserData(selUserIdObj,rec.shopId,params);
	            
	          //判断是否定义了onchange回调函数
	            if (params.onChange) params.onChange(rec);
	            
	        }
	    });
		
		$("#" + params.selUserId).combobox({
	        valueField: 'userId',
	        textField: 'userName',
	        panelHeight: 'auto',
	        editable: false,
	        onSelect: function (rec) {         
	        	//判断是否定义了onchange回调函数
	        	if (params.onChange) params.onChange(rec);
	        }
	    });
		
		// 设置是否显示数据类型combobox
		if (params.showShopCbb == 1) {
			div.find("#" + params.selShopId).next(".combo").show();
		} else {
			div.find("#" + params.selShopId).next(".combo").hide();
		}

	}

	/**
	 * 根据传入的字段,重新加载员工数据
	 */
	function reloadUserData(userIdObj, shopId, params) {
		var selectData = loadUserData(shopId);

		// 触发字典数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
		if (params.onLoadUserData)
			selectData = params.onLoadUserData(selectData);

		// 清空combobox再加载
		userIdObj.combobox("clear");
		userIdObj.combobox("loadData", selectData);
	}

	/**
	 * 加载门店数据
	 */
	function loadShopData(typeCode){
		var shopAttr = [];
		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data :{ 
				accessId:"201610",
				typeCode:typeCode
			},
			success : function(data) {
				if(data != null){
					shopAttr = data.rows;
				}
			}
		});
		
		return shopAttr;
	}

	/**
	 * 根据门店id加载员工数据
	 */
	function loadUserData(shopId){
		var userAttr = [];
		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data :{ 
				accessId:"201607",
				shopId:shopId
			},
			success:function (data){
				if(data != null){
					userAttr = data.rows;
				}
			}
		});
		return userAttr;
	}

})(jQuery);



























