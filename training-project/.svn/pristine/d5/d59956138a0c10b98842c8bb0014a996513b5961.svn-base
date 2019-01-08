//定义jquery插件selectDeptEmployeePlugin
(function($) { 
	var methods = {

		init : function(options) {
			// 默认参数
			var defaults = {
				'selDepartmentId' : 'departmentId', // 默认的部门combotree的id
				'selEmployeeId' : 'employeeId', // 默认的员工combox的id
				'defaultDeptId' : "", // 默认加载的部门id			
				'defaultEmpId' :"",// 默认的员工编号 
				'required' : false, // 员工是否是必选
				'missingMessage' : '请选择员工', // 必输的时候的提示

				'showDept' : 1, // 是否显示部门，默认显示，不显示时defaultDeptId必须有值
				'deptWidth' : '100px', // 部门选择的宽度
				'employeeWidth' : '100px' // 员工选择的宽度
			};

			var settings = $(this).data('settings');
			if (!settings) {
				settings = $.extend({
					id : this.attr('id')
				}, defaults);
			}

			// 使用外部传入的参数更新默认参数
			$.extend(settings, settings, options);
			$(this).data('settings', settings);

			// 创建部门员工选择插件
			initDeptEmpData($(this).data('settings'));
		},
		
		// 获取选择的员工代码
		getValue : function() {
			return $("#" + $(this).data('settings').selEmployeeId).combobox("getValue");
		},
		// 设置选择的员工代码
		setValue : function(value) {
			$("#" + $(this).data('settings').selEmployeeId).combobox("setValue", value);
		},
		// 获取选择的员工描述
		getText : function() {
			return $("#" + $(this).data('settings').selEmployeeId).combobox("getText");
		},
		setText : function(text) {
			$("#" + $(this).data('settings').selEmployeeId).combobox("setText", text);
		},
		
		// 获取选择的部门代码
		getDeptValue : function() {
			return $("#" + $(this).data('settings').selDepartmentId).combo("getValue");
		},
		// 设置选择的部门代码
		setDeptValue : function(value) {
			$("#" + $(this).data('settings').selDepartmentId).combotree("setValue", value);
		},
		// 获取选择的部门描述
		getDeptText : function() {
			return $("#" + $(this).data('settings').selDepartmentId).combo("getText");
		},
		setDeptText : function(text) {
			$("#" + $(this).data('settings').selDepartmentId).combo("setText", text);
		},
		
		// 得到部门和员工的代码
		getAllCodeValue:function(){
			return $("#" + $(this).data('settings').selDepartmentId).combo("getValue") + ","
			+ $("#" + $(this).data('settings').selEmployeeId).combobox("getValue");
		},
		// 设置部门和员工的代码
		setAllCodeValue : function(allParams) {
			$("#" + $(this).data('settings').selDepartmentId).combotree("setValue",
					allParams.deptVal);

			// 重新加载员工数据
			var empIdObj =$("#" + $(this).data('settings').selEmployeeId);
			reloadEmpData(empIdObj, allParams.deptVal, $(this).data('settings'));

			// 设置员工的值
			$("#" + $(this).data('settings').selEmployeeId).combobox("setValue",
					allParams.empVal);
		},	
		// 获取combox中的所有值的描述
		getAllDescValue : function() {
			return $("#" + $(this).data('settings').selDepartmentId).combo("getText") + ","
					+ $("#" + $(this).data('settings').selEmployeeId).combobox("getText");
		},

		// 设置combox中的所有值的描述
		setAllDescValue : function(allParams) {
			$("#" + $(this).data('settings').selDepartmentId).combo("setText",
					allParams.deptVal);
			$("#" + $(this).data('settings').selEmployeeId).combobox("setText",
					allParams.empVal);		
		}

	};

	// 定义selectDeptEmployeePlugin插件，实际上会调用methods中的方法
	$.fn.selectDeptEmployeePlugin = function(method) {
		// 方法调用
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method
					+ 'does not exist on jQuery.selectDeptEmployeePlugin');
		}
	};
	
	//定义方法
	
	/**
	 * 初始化 加载数据
	 */
	function initDeptEmpData(params) {
		// 初始化combox
		initDeptEmpCombox(params);

		// 得到部门数据
		var deptData = loadDeptData();

		// 给获取得到的数据添加id和text字段 便于combotree加载
		for ( var i in deptData) {
			deptData[i].id = deptData[i].deptId;
			deptData[i].text = deptData[i].deptName;
		}
		$('#' + params.selDepartmentId).combotree("loadData", deptData);
		
		if (params.defaultDeptId){
			// defaultDeptId有值 设置部门下拉框的值
			$("#" + params.selDepartmentId).combotree("setValue", params.defaultDeptId);
			
			// 根据defaultDeptId加载员工数据
			reloadEmpData($('#' + params.selEmployeeId),params.defaultDeptId, params);
			
			// defaultEmpId有值 设置员工下拉框的值
			if(params.defaultEmpId) $('#' + params.selEmployeeId).combobox("setValue", params.defaultEmpId);
		}else{
			reloadEmpData($('#' + params.selEmployeeId),params.defaultDeptId, params);
		}

	}

	/**
	 * 初始化combox
	 */
	function initDeptEmpCombox(params) {
		// 得到页面的div
		var divObj = $('#' + params.id);
		
		// 清空div
		$(divObj).empty();
		
		var deptSel = $("<select id='"
				+ params.selDepartmentId
				+ "' class='easyui-combotree' name='"
				+ params.selDepartmentId
				+ "' data-options='prompt:\""
				+ params.tipMessage
				+ "\","
				+ (params.required ? "required:true,missingMessage:\""
						+ params.deptMissingMessage + "\"" : "")
				+ "' style='width:" + params.deptWidth + ";'></select>");

		var employeeSel = $("<select id='"
				+ params.selEmployeeId
				+ "' class='easyui-combobox' name='"
				+ params.selEmployeeId
				+ "' style='width:"
				+ params.employeeWidth
				+ ";' "
				+ (params.required ? "data-options='required:true,missingMessage:\""
				+ params.empMissingMessage + "\"'" : "") + "></select>");
		

		// 把combox放在div里面
		divObj.append(deptSel);
		if (params.showDept == 1)
			divObj.append("&nbsp;&nbsp;");
		divObj.append(employeeSel);

		// 初始化 部门combotree
		$("#" + params.selDepartmentId).combotree({
			panelHeight : 'auto',
			editable : false,
			onSelect : function(rec) {
				var empIdObj = $("#" + params.selEmployeeId);
				reloadEmpData(empIdObj, rec.deptId, params);

				// 判断是否定义了onchange回调函数
				if (params.onChange)
					params.onChange(rec);

			}
		});

		// 初始化  员工combobox
		$("#" + params.selEmployeeId).combobox({
			valueField : 'empId',
			textField : 'empName',
			panelHeight : 'auto',
			editable : false,
			onSelect : function(rec) {
				// 判断是否定义了onchange回调函数
				if (params.onChange)
					params.onChange(rec);
			}
		});
		
		// 设置是否显示数据类型combobox
	    if (params.showDept == 1) {
	    	divObj.find("#" + params.selDepartmentId).next(".combo").show();
	    }else {
	    	divObj.find("#" + params.selDepartmentId).next(".combo").hide();
	    }
	}

	/**
	 * 根据传入的字段,重新加载员工数据
	 */
	function reloadEmpData(empIdObj, deptId, params) {
		var empData = loadEmployeeData(deptId);

		// 触发字典数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
		if (params.onLoadEmpData)
			empData = params.onLoadEmpData(empData);

		// 清空combobox再加载
		empIdObj.combobox("clear");
		empIdObj.combobox("loadData", empData);
	}

	/**
	 * 加载部门数据
	 */
	function loadDeptData() {
		var deptAttr = [];
		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data : {
				accessId : "1201",
				isUsed : "1",
				pDeptId : "-1"
			},
			success : function(data) {
				if (data != null) {
					deptAttr = data.rows;
				}
			}
		});

		return deptAttr;
	}

	/**
	 * 加载员工数据
	 */
	function loadEmployeeData(deptId) {
		var empAttr = [];
		$.ajax({
			url : basePath + "/dataaccess.json",
			type : "post",
			async : false,
			data : {
				accessId : "1323",
				deptId : deptId
			},
			success : function(data) {
				if (data != null) {
					empAttr = data.rows;
				}
			}
		});

		return empAttr;
	}

	/**
	 * 调用后台数据访问，将指定部门的数据加载到map中，map的key值为员工id，value为对应的描述 
	 * @returns
	 */
	function loadDeptDataMap() {
		// 定义一个json装数据
		var map = {};

		// 得到获取的后台数据
		var dataList = loadDeptData();

		// 遍历放进map中
		for ( var i in dataList) {
			map[dataList[i].id] = dataList[i].text;
		}

		return map;
	}

	/**
	 * 调用后台数据访问，将指定员工的数据加载到map中，map的key值为员工id，value为对应的描述 参数：deptId 上级部门的id
	 * @returns
	 */
	function loadEmpDataMap(deptId) {
		// 定义一个json装数据
		var map = {};

		// 得到获取的后台数据
		var dataList = loadEmployeeData(deptId);

		// 遍历放进map中
		for ( var i in dataList) {
			map[dataList[i].empId] = dataList[i].empName;
		}

		return map;
	}

})(jQuery);


