//定义jquery插件selectDictCodePlugin
(function ($) {
    var methods = {
        init: function (options) {
            //默认参数，只在第一次初始化的时候使用
            var defaults = {
                'dictTypeId': 'dictType',  	//默认的数据字典类型combox的id
                'dictCodeId': 'dictCode',	//默认的数据字典代码combox的id
                //'defaultDictType': "",			//默认的数据字典类型
                //'defaultDictCode': "",			//默认的数据字典编码
                'required': false,						//数据字典是否是必选
                'missingMessage': '请选择一个数据项',	//必输的时候的提示
                'showDictType': 0,				//是否显示数据字典类型，默认不显示
                'dictTypeWidth': '150px',		//类型选择的款段
                'dictCodeWidth': '150px'		//数据字典编码的宽度
            };

            var settings = $(this).data('settings');
            if(!settings) {
            	settings = $.extend({id: this.attr('id')}, defaults);
            }
            
            //使用外部传入的参数更新默认参数
            $.extend(settings, settings, options);
            $(this).data('settings', settings);

            //创建数据字典选择插件
            selectDictCode($(this).data('settings'));
        },
        //获取选择的数据字典代码
        getValue: function () {
            return $("#" + $(this).data('settings').dictCodeId).combobox("getValue");
        },
        //设置选择的数据字典代码
        setValue: function (value) {
            $("#" + $(this).data('settings').dictCodeId).combobox("setValue", value);
        },
        //获取选择的数据字典描述
        getText: function () {
            return $("#" + $(this).data('settings').dictCodeId).combobox("getText");
        },
        setText: function (text) {
            $("#" + $(this).data('settings').dictCodeId).combobox("setText", text);
        },
        //获取选择的数据字典类型代码
        getTypeValue: function () {
            return $("#" + $(this).data('settings').dictTypeId).combobox("getValue");
        },
        //设置选择的数据字典类型代码
        setTypeValue: function (value) {
            $("#" + $(this).data('settings').dictTypeId).combobox("setValue", value);

            //重新加载数据字典代码combobox中的数据
            var dictCodeObj = $("#" + $(this).data('settings').dictCodeId);
            reloadDictCodeData(dictCodeObj, value, $(this).data('settings'));
        },
        //获取选择的数据字典类型描述
        getTypeDesc: function () {
            return $("#" + $(this).data('settings').dictTypeId).combobox("getText");
        },
        //设置选择的数据字典类型描述，只是改变名称，重新加载数据字典代码
        setTypeDesc: function (text) {
            $("#" + $(this).data('settings').dictTypeId).combobox("setText", text);
        }

    };

    //定义selectDictCodePlugin插件，实际上会调用methods中的方法
    $.fn.selectDictCodePlugin = function (method) {
        // 方法调用
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method' + method + 'does not exist on jQuery.selectDictCodePlugin');
        }

    };

})(jQuery);

/**
 * 初始化combobox
 */
function initCombobox(params) {
    // 通过id得到页面div来装combobox
    var div = $("#" + params.id);
    //清空div
    div.empty();

    // 根据dictTypeId、dictCodeId在div中创建对应的combox  dictTypeId 数据类型id  dictCodeId 字典编码id
    var dictTypeObj = $("<select id='" + params.dictTypeId + "' name='" + params.dictTypeId + "' class='easyui-combobox'  style='width:" + params.dictTypeWidth + ";'></select>");
    var dictCodeObj = $("<select id='" + params.dictCodeId + "' name='" + params.dictCodeId + "' class='easyui-combobox'  style='width:" + params.dictCodeWidth + ";'" +
        (params.required ? "data-options='required:true,missingMessage:\"" + params.missingMessage + "\"'" : "") + "></select>");

    // 把combox放在div里面
    div.append(dictTypeObj);
    //显示数据字典分类的时候才在两个控件之间加入空格
    if (params.showDictType == 1) div.append("&nbsp;&nbsp;");

    div.append(dictCodeObj);

    // 数据类型combox
    $("#" + params.dictTypeId).combobox({
        valueField: 'typeCode',
        textField: 'typeDesc',
        panelHeight: 'auto',
        editable: false,
        onSelect: function (rec) {
            //重新加载数据字典代码combobox中的数据
            var dictCodeObj = $("#" + params.dictCodeId);
            reloadDictCodeData(dictCodeObj, rec.typeCode, params);
        }
    });

    // 字典编码combox
    $("#" + params.dictCodeId).combobox({
        valueField: 'dictCode',
        textField: 'dictDesc',
        panelHeight: 'auto',
        editable: false,
        onSelect: function (rec) {
            //判断是否定义了onchange回调函数
            if (params.onChange) params.onChange(rec);
        },
        // 格式化字典编码明细的显示
        formatter: function (row) {
            return row.dictDesc;
        }
    });
}

/**
 * 功能：根据传入的数据字典类型编码，重新加载数据字典combobox中的内容
 * @param dictCodeObj 数据字典combox对象
 * @param selTypeCode 数据字典类型编码
 * @param params 控件参数
 */
function reloadDictCodeData(dictCodeObj, typeCode, params) {
    var dictData = loadDictDataList(typeCode);

    //触发字典数据加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
    if (params.onLoadData) dictData = params.onLoadData(dictData);

    // 清空combobox再加载
    dictCodeObj.combobox("clear");
    
    dictCodeObj.combobox("loadData", dictData);
}

/**
 *  功能：选择数据字典类型
 *  参数：params{
 *  		id: '放置控件的div，默认:selDictCode',
 * 	 		dictTypeId: '数据字典类型选择combox的id，默认是dictType',
 *  		dictCodeId: '数据字典编码选择combox的id，默认是dictCode',
 *  		dictTypeSope: '需要加载的数据字典类型的范围，
 *                类型编码在括号内以逗号隔开，如："('HR_EMP_TYPE','HR_NATIONAL')"，默认不加载任何分类数据，空表示加载所有',
 *  		defaultDictCode: '默认数据字典类型编码',
 *  		showDictType: '是否显示数据字典类型combox，1表示显示，0不显示(只显示默认数据字典代码列表)',
 *  		onChange: function(var dictCode){}
 *  	}
 *    当用户选择了某个数据字典代码后调用onChange，dictCode是一个json，包含了数据字典代码、描述等，具体内容参见数据字典表
 */
function selectDictCode(params) {
	//数据字典联动选择的容器jquery对象
	var divObj = $("#" + params.id);
	
    // 初始化combobox
    initCombobox(params);

    // 加载数据类型
    var typeData = loadTypeDataList(params.dictTypeSope);

    //触发字典类型加载完毕的事件，用户可以在事件里面对要显示的数据进行加工，增加新的项
    if (params.onLoadTypeData) typeData = params.onLoadTypeData(typeData);

    $("#" + params.dictTypeId).combobox("loadData", typeData);

    // 判断是否有默认的数据类型
    if (params.defaultDictType) {
        if (params.dictTypeSope != null) $("#" + params.dictTypeId).combobox("setValue", params.defaultDictType);

        reloadDictCodeData($("#" + params.dictCodeId), params.defaultDictType, params);

        // 判断是否有默认的字典编码值
        if (params.defaultDictCode) $("#" + params.dictCodeId).combobox("setValue", params.defaultDictCode);
    }

    // 设置是否显示数据类型combobox
    if (params.showDictType == 1) {
//    	divObj.find("#" + params.dictTypeId).show();
    	divObj.find("#" + params.dictTypeId).next(".combo").show();
    }
    else {
//    	divObj.find("#" + params.dictTypeId).hide();
    	divObj.find("#" + params.dictTypeId).next(".combo").hide();
    }

}

/**
 * 功能：调用后台数据访问，将指定数据字典类型的数据加载到一个列表中，列表中每一个项代表数据库中的一行，数据加载采用同步的方式
 * 参数：dictType 数据字典类型代码
 * 返回值：json类型的列表，列表中每一个项代表数据库中的一行
 */
function loadTypeDataList(dictType) {
    // 数据类型状态集合
    var typeArr = [];

    // 调用数据库中制定类型的数据
    $.ajax({
        url: basePath + '/dataaccess.json',
        type: "post",
        async: false,
        data: {
            accessId: "3309",
            dictTypeScope: dictType,
            sort: "typeCode",
            order: "asc"
        },
        success: function (data) {
            if (data != null) {
                typeArr = data.rows;
            }
        }
    });

    return typeArr;
}

/**
 * 功能：加载指定数据类型下的数据明细
 * 参数：typeCode 选中数据字典类型的typeCode，可以设置默认值
 */
function loadDictDataList(typeCode) {
    // 字典信息状态集合
    var dictArr = [];

    $.ajax({
        url: basePath + '/dataaccess.json',
        type: "post",
        async: false,
        data: {
            accessId: '3301',
            typeCode: typeCode
        },
        success: function (data) {
            if (data != null) {
                dictArr = data.rows;
            }
        }
    });

    return dictArr;
}

/**
 * 功能：调用后台数据访问，将指定数据字典类型的数据加载到map中，map的key值为数据字典中代码，value为对应的描述
 * 参数：dictType 数据字典类型代码
 * 返回值：json，属性为数据字典中代码，value为对应的描述
 */
function loadDictDataMap(dictType) {
    // 定义一个json装数据
    var map = {};

    // 得到获取的后台数据
    var dataList = loadDictDataList(dictType);

    // 遍历放进map中
    for (var i in dataList) {
        map[dataList[i].dictCode] = dataList[i].dictDesc;
    }

    return map;
}

/**
 * 功能：获取指定数据字典类型，某个代码对应的描述
 * 参数：dictType 数据字典类型代码
 *     dictCode 数据字典中的代码
 * 返回值：数据字典代码对应的描述
 */
function getDictCodeDesc(dictType, dictCode) {
    var map = loadDictDataMap(dictType);
    if(map) 
    	return map[dictCode];
    else
    	return null;
}

/**
 * 根据指定数据诶性范围查询对应数据字典代码
 * @param scope数据字典类型的范围，数据字典类型之间逗号隔开，并且用单引号，格式：'HOUSE_TIME_SELECT','IS_USED','HOUSE_ADV_STAT'
 * @param callback回调函数，当数据加载完毕后，调用该函数
 * 			回调函数：function(data) data为返回的数据
 *			返回值是一个hashMap，key:数据类型，value：对应的数据字典数据
 */
function loadDictDataByScope(scope,callback){
	$.ajax({
        url: basePath + '/businesslogic.json',
        type: "post",
        async: true,
        data: {
        	logicId: '05.01.1001',
            typeCodes: scope
        },
        success: function (data) {
            if (callback != null) {
            	callback(data);
            }
        }
    });
}

