//定义jquery插件selectAreaPlugin
(function($) {
	var methods = {	
		init : function(options) {
			// 默认参数
			var defaults = {
				'cityId' : 'cityId', // 默认的区域combox的id
				'areaId' : 'areaId', // 默认的区域combox的id
				'subAreaId' : 'subAreaId', // 默认的片区combox的id
				'cityType' : 'HOUSE_CITY', // 加载的城市数据
				'defaultCityName' : "", // 默认加载的城市id
				'defaultAreaId' : "", // 默认的区域编码
				'defaultSubAreaId':"", // 默认设置片区下拉框的值
				'required': false,	  //地址是否是必选
                'cityMissingMessage': '请选择城市',	//必输的时候的提示
                'areaMissingMessage': '请选择区域',	//必输的时候的提示
                'subAreaMissingMessage': '请选择片区',	//必输的时候的提示
				'showCityAreaCbb' : 1, // 是否显示区域和城市，默认显示，不显示时defaultCityName和defaultAreaId必须有值
				'cityWidth' : '80px', // 区域选择的宽度
				'areaWidth' : '80px', // 区域选择的宽度
				'subAreaWidth' : '80px' // 片区选择的宽度
			};
			
			var settings = $(this).data('settings');
            if(!settings) {
            	settings = $.extend({id: this.attr('id')}, defaults);
            }
            
            //使用外部传入的参数更新默认参数
            $.extend(settings, settings, options);
            $(this).data('settings', settings);

			// 创建城市-区域-片区选择插件
			initSelData($(this).data('settings'));
		},

		// 获取选择的片区代码
		getValue : function() {
			return $("#" + $(this).data('settings').subAreaId).combobox("getValue");
		},
		// 设置选择的片区代码
		setValue : function(value) {
			$("#" + $(this).data('settings').subAreaId).combobox("setValue", value);
		},
		// 获取选择的片区描述
		getText : function() {
			return $("#" + $(this).data('settings').subAreaId).combobox("getText");
		},
		setText : function(text) {
			$("#" + $(this).data('settings').subAreaId).combobox("setText", text);
		},

		// 获取选择的区域代码
		getAreaValue : function() {
			return $("#" + $(this).data('settings').areaId).combobox("getValue");
		},
		// 设置选择的区域代码
		setAreaValue : function(params) {
			$("#" + $(this).data('settings').cityId).combobox("setValue",
					params.cityVal);
			
			// 重新加载区域中combobox中的数据
			var areaIdObj = $("#" + $(this).data('settings').areaId);
			reloadAreaData(areaIdObj, params.cityVal, $(this).data('settings'));

			// 重新加载片区代码combobox中的数据
			var subAreaIdObj = $("#" + $(this).data('settings').subAreaId);
			reloadSubAreaData(subAreaIdObj,params.cityVal,params.areaVal, $(this).data('settings'));

			$("#" + $(this).data('settings').areaId).combobox("setValue",
					params.areaVal);
		},
		// 获取选择的区域描述
		getAreaDesc : function() {
			return $("#" + $(this).data('settings').areaId).combobox("getText");
		},
		// 设置选择的区域描述，只是改变名称，重新加载区域代码
		setAreaDesc : function(text) {
			$("#" + $(this).data('settings').areaId).combobox("setText", text);
		},

		// 获取选择的城市代码
		getCityValue : function() {
			return $("#" + $(this).data('settings').cityId).combobox("getValue");
		},
		// 设置选择的城市代码
		setCityValue : function(value) {
			$("#" + $(this).data('settings').cityId).combobox("setValue", value);

			// 重新加载片区代码combobox中的数据
			var areaIdObj = $("#" + $(this).data('settings').areaId);
			reloadAreaData(areaIdObj, value, $(this).data('settings'));
		},
		// 获取城市描述
		getCityDesc : function() {
			return $("#" + $(this).data('settings').cityId).combobox("getText");
		},
		// 设置城市描述
		setCityDesc : function(text) {
			$("#" + $(this).data('settings').cityId).combobox("setText", text);
		},

		// 获取combox中的所有值的代码
		getAllCodeValue : function() {
			return $("#" + $(this).data('settings').cityId).combobox("getValue") + ","
					+ $("#" + $(this).data('settings').areaId).combobox("getValue") + ","
					+ $("#" + $(this).data('settings').subAreaId).combobox("getValue");
		},
		// 设置选combox中的所有值的代码
		setAllCodeValue : function(allParams) {
			$("#" + $(this).data('settings').cityId).combobox("setValue",
					allParams.cityVal);

			// 重新加载区域和片区中combobox中的数据
			var areaIdObj = $("#" + $(this).data('settings').areaId);
			reloadAreaData(areaIdObj, allParams.cityVal, $(this).data('settings'));

			var subAreaIdObj = $("#" + $(this).data('settings').subAreaId);
			reloadSubAreaData(subAreaIdObj, allParams.cityVal,
					allParams.areaVal, $(this).data('settings'));

			// 设置区域和片区的值
			$("#" + $(this).data('settings').areaId).combobox("setValue",
					allParams.areaVal);
			$("#" + $(this).data('settings').subAreaId).combobox("setValue",
					allParams.subAreaVal);
		},

		// 获取combox中的所有值的描述
		getAllDescValue : function() {
			return $("#" + $(this).data('settings').cityId).combobox("getText") + ","
					+ $("#" + $(this).data('settings').areaId).combobox("getText") + ","
					+ $("#" + $(this).data('settings').subAreaId).combobox("getText");
		},

		// 设置combox中的所有值的描述
		setAllDescValue : function(allParams) {
			$("#" + $(this).data('settings').cityId).combobox("setText",
					allParams.cityVal);
			$("#" + $(this).data('settings').areaId).combobox("setText",
					allParams.areaVal);
			$("#" + $(this).data('settings').subAreaId).combobox("setText",
					allParams.subAreaVal);
		}

	};

	// 定义selectDictCodePlugin插件，实际上会调用methods中的方法
	$.fn.selectAreaPlugin = function(method) {
		// 方法调用
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method
					+ 'does not exist on jQuery.selectAreaPlugin');
		}
	};
	
	// 定义方法
	/**
	 * 初始化 加载数据
	 */
	function initSelData(params) {

		// 调用初始化combox方法
		initAreaCombox(params);

		var cityData = loadCityList(params.cityType);

		// 触发城市数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
		if (params.onLoadCityData)
			cityData = params.onLoadCityData(cityData);

		$('#' + params.cityId).combobox("loadData", cityData);
		
		// defaultCityName是否有值
		if(params.defaultCityName){
			// 设置城市下拉框的值
			$("#" + params.cityId).combobox("setValue", params.defaultCityName);
			
			// 加载区域下拉框
			reloadAreaData($('#' + params.areaId), params.defaultCityName, params);
			
			// defaultAreaId是否有值
			if(params.defaultAreaId){
				// 设置区域下拉框的值
				$("#" + params.areaId).combobox("setValue", params.defaultAreaId);
				
				// 加载片区下拉框
				reloadSubAreaData($('#' + params.subAreaId), params.defaultCityName, params.defaultAreaId, params);
				
				// defaultSubAreaId是否有值 设置片区下拉框的值
				if(params.defaultSubAreaId) $("#" + params.subAreaId).combobox("setValue", params.defaultSubAreaId);
			}else{
				reloadSubAreaData($('#' + params.subAreaId), params.defaultCityName, params.defaultAreaId, params);
			}
			
		}else{
			reloadAreaData($('#' + params.areaId), params.defaultCityName, params);
			reloadSubAreaData($('#' + params.subAreaId), params.defaultCityName, params.defaultAreaId, params);
		}
	}

	/**
	 * 初始化combox
	 */
	function initAreaCombox(params) {

		// 通过id得到页面div来装combobox
		var div = $("#" + params.id);

		// 判断div中是否已经创建combox 
		if ($(div).html() == null || $(div).html() == "") {
			// 根据areaId、subAreaId在div中创建对应的combox areaId 区域combox的id subAreaId
			// 片区combox的id
			var citySel = $("<select id='" + params.cityId
					+ "' name='"+ params.cityId +"' class='easyui-combobox'  style='width:"
					+ params.cityWidth + ";'" +
	            (params.required ? "data-options='required:true,missingMessage:\"" + params.cityMissingMessage + "\"'" : "") + "></select>");
			var areaSel = $("<select id='" + params.areaId + "' name='"
					+ params.areaId + "' class='easyui-combobox'  style='width:"
					+ params.areaWidth + ";'" +
	            (params.required ? "data-options='required:true,missingMessage:\"" + params.areaMissingMessage + "\"'" : "") + "></select>");
			var subAreaSel = $("<select id='" + params.subAreaId + "' name='"
					+ params.subAreaId + "' class='easyui-combobox'  style='width:"
					+ params.subAreaWidth + ";'" +
	            (params.required ? "data-options='required:true,missingMessage:\"" + params.subAreaMissingMessage + "\"'" : "") + "></select>");
		}

		// 把combox放在div里面
		div.append(citySel);
		div.append("&nbsp;&nbsp;");
		div.append(areaSel);
		div.append("&nbsp;&nbsp;");
		div.append(subAreaSel);

		// 选择城市时得到选中值
		$("#" + params.cityId).combobox({
			valueField : 'dictCode',
			textField : 'dictDesc',
			panelHeight : 'auto',
			editable : false,
			onSelect : function(rec) {
				// 当选中城市的时候得到城市数据
				var selCity = rec.dictCode;
				var areaIdObj = $("#" + params.areaId);
				reloadAreaData(areaIdObj, selCity, params);

				var subAreaIdObj = $("#" + params.subAreaId);
				reloadSubAreaData(subAreaIdObj, selCity, params.parentId, params);
				
				// 判断是否定义了onchange回调函数
				if (params.onChange)
					params.onChange(rec);
			}
		});

		// 选择区域时得到选中值
		$("#" + params.areaId).combobox({
			valueField : 'areaId',
			textField : 'areaName',
			panelHeight : 'auto',
			editable : false,
			onSelect : function(rec) {

				// 选择城市 加载区域数据
				var selCity = rec.city;
				var parentId = rec.areaId;
				var subAreaIdObj = $("#" + params.subAreaId);
				reloadSubAreaData(subAreaIdObj, selCity, parentId, params);
				
				// 判断是否定义了onchange回调函数
				if (params.onChange)
					params.onChange(rec);

			}
		});

		$("#" + params.subAreaId).combobox({
			valueField : 'areaId',
			textField : 'areaName',
			panelHeight : 'auto',
			editable : false,
			onSelect : function(rec) {
				// 判断是否定义了onchange回调函数
				if (params.onChange)
					params.onChange(rec);
			}
		});
		
		// 设置是否显示数据类型combobox
		if (params.showCityAreaCbb == 1) {
			div.find("#" + params.cityId).next(".combo").show();
			div.find("#" + params.areaId).next(".combo").show();
		} else {
			if (params.defaultCityName != "" && params.defaultAreaId != "") {
				div.find("#" + params.cityId).next(".combo").hide();
				div.find("#" + params.areaId).next(".combo").hide();
			}
		}
	}

	/**
	 * 根据传入的字段,重新加载区域数据
	 */
	function reloadAreaData(areaIdObj, city, params) {
		var selectData = loadAreaList(city);

		// 触发字典数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
		if (params.onLoadAreaData)
			selectData = params.onLoadAreaData(selectData);

		// 清空combobox再加载
		areaIdObj.combobox("clear");
		areaIdObj.combobox("loadData", selectData);
	}

	/**
	 * 根据传入的字段，重新加载片区数据
	 */
	function reloadSubAreaData(subAreaIdObj, city, parentId, params) {

		var selectData = loadSubAreaList(parentId, city);

		// 触发片区数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
		if (params.onLoadSubAreaData)
			selectData = params.onLoadSubAreaData(selectData);

		// 清空combobox再加载
		subAreaIdObj.combobox("clear");
		subAreaIdObj.combobox("loadData", selectData);
	}

	/**
	 * 通过数据字典查询得到的城市数据集合
	 */
	function loadCityList(cityType) {
		// 城市数据集合
		var cityArr = [];

		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data : {
				accessId : "3301",
				typeCode : cityType
			},
			success : function(data) {
				if (data != null) {
					cityArr = data.rows;
				}
			}
		});
		return cityArr;
	}

	/**
	 * 通过数据字典查询得到的区域数据集合
	 */
	function loadAreaList(city) {
		// 区域数据集合
		var areaArr = [];

		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data : {
				accessId : "201504",
				parentId : "-1",
				areaStat : "01",
				city : city
			},
			success : function(data) {
				if (data != null) {
					areaArr = data.rows;
				}
			}
		});
		return areaArr;
	}

	/**
	 * 通过数据字典查询得到的片区状态集合
	 */
	function loadSubAreaList(parentId, city) {
		// 片区数据集合
		var subAreaArr = [];

		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data : {
				accessId : "201504",
				parentId : parentId,
				areaStat : "01",
				city : city
			},
			success : function(data) {
				if (data != null) {
					subAreaArr = data.rows;
				}
			}
		});

		return subAreaArr;
	}

	/**
	 * 功能：调用后台数据访问，将指定片区的数据加载到map中，map的key值为数据字典中代码，value为对应的描述 参数：dictType 数据字典类型代码
	 * 返回值：json，属性为数据字典中代码，value为对应的描述
	 */
	function loadAreaDataMap(city) {
		// 定义一个json装数据
		var map = {};

		// 得到获取的后台数据
		var dataList = loadAreaList(city);

		// 遍历放进map中
		for ( var i in dataList) {
			map[dataList[i].areaId] = dataList[i].areaName;
		}

		return map;
	}

	/**
	 * 功能：调用后台数据访问，将指定片区的数据加载到map中，map的key值为数据字典中代码，value为对应的描述 参数：dictType 数据字典类型代码
	 * 返回值：json，属性为数据字典中代码，value为对应的描述
	 */
	function loadSubAreaDataMap(parentId, city) {
		// 定义一个json装数据
		var map = {};

		// 得到获取的后台数据
		var dataList = loadSubAreaList(parentId, city);

		// 遍历放进map中
		for ( var i in dataList) {
			map[dataList[i].areaId] = dataList[i].areaName;
		}

		return map;
	}

})(jQuery);


