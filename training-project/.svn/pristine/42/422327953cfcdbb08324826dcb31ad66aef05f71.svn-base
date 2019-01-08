(function ($) {
    // 关键字输入框ID
    var inputKeyWordId;
    // 地区联动选择插件ID
    var selectAreaPluginId;
    // 城市选择下拉框ID
    var selectCityId;
    // 区域选择下拉框ID
    var selectAreaId;
    // 片区选择下拉框ID
    var selectSubAreaId;
    // 楼盘字典表格ID
    var tableEstateInfoId;
    // 楼盘字典搜索FormID
    var searchFormId;
    // 楼盘详情对话框ID
    var detailDialogId;

    var idSeed = new Date().getTime();

    var methods = {
        /**
         * 功能：初始化对话框
         * 参数：options
         *      id 对话框id
         *      onSelect() 选择用户后调用
         *      onClose() 关闭窗口调用
         */
        init: function (options) {
            //默认参数
            var defaults = {
                onSelect: $.noop,
                onClose: $.noop
            };

            var settings = $(this).data('settings');

            if (!settings) {
                settings = $.extend({
                    id: $(this).attr('id')
                }, defaults);

                inputKeyWordId = "estateInfoKeyWord" + idSeed;

                selectAreaPluginId = "selectAreaPlugin" + idSeed;
                selectCityId = "estateInfoCity" + idSeed;
                selectAreaId = "estateInfoArea" + idSeed;
                selectSubAreaId = "estateInfoSubArea" + idSeed;
                tableEstateInfoId = "estateInfoTable" + idSeed;
                searchFormId = "estateInfoSearchForm" + idSeed;
                detailDialogId = "estateInfoDetailDialog" + idSeed;
            }

            //使用外部传入的参数更新默认参数
            $.extend(settings, settings, options);
            $(this).data('settings', settings);

            // 初始化对话框
            initSelEstateInfoDialog($(this).data('settings'));
        },
        /**
         * 功能：打开对话框
         */
        open: function () {
            openEstateInfoDialog($(this).data('settings'));
        }

    };

    $.fn.selEstateInfoDialog = function (method) {
        // 方法调用
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.selEstateInfoDialog');
        }

    };

    /**
     * 功能： 初始化对话框
     * @param params 用户传入的对话框id以及onSelect、onCancel方法
     * 1、根据id创建一个div
     * 2、定义对话框中的布局、包含关键字、datagrid
     * 3、给双击、选择、取消绑定事件
     */
    function initSelEstateInfoDialog(params) {
        // 定义对话框
        $("#" + params.id).dialog({
            title: "楼盘字典选择",
            width: 840,
            height: 416,
            cache: false,
            modal: true,
            closed: true,
            // 设置对话框按钮
            buttons: [{
                //设置选择按钮
                text: "选择",
                iconCls: "icon-save",
                handler: function () {
                    var row = $("#" + tableEstateInfoId).datagrid("getSelected");
                    if (row == null) {
                        $.messager.alert("提示信息", "请选择楼盘字典", "info");
                    } else {
                        params.onSelect && params.onSelect(row);
                        params.onClose && params.onClose();
                        $("#" + params.id).dialog("close");
                    }
                }
            }, {
                text: "取消",
                iconCls: "icon-cancel",
                handler: function () {
                    params.onClose && params.onClose();
                    $("#" + params.id).dialog("close");
                }
            }]
        });

        $("#" + params.id).on('click', 'a.linkEstateInfoDetail', function () {
            // 获取当前行数据
            var row = $("#" + tableEstateInfoId).datagrid("getSelected");
            // 数据加载
            var spanAttr = $('#' + detailDialogId + ' form span');
            for (var i = 0; i < spanAttr.length; i++) {
                for (var key in row) {
                    if ($(spanAttr[i]).attr("name") == key) {
                        // 时间  格式化
                        if ($(spanAttr[i]).attr("name") == "createTime" || $(spanAttr[i]).attr("name") == "modifyTime") {
                            $(spanAttr[i]).text(timeformatter(row[key]));
                        } else {
                            $(spanAttr[i]).text(row[key]);
                        }

                    }
                }
            }

            // 打开详情对话框
            $("#" + detailDialogId).dialog("open");
        });

        var form = $('<form id="' + searchFormId + '" style="padding: 6px;"></form>');

        // 创建Input输入框
        var input = $('<input type="text" id="' + inputKeyWordId + '" class="easyui-textbox" data-options="prompt:\'请输入楼盘字典或拼音查询\'" style="width: 200px;" />');
        // 创建查询按钮
        var aBtn = $('<a href="javascript:;" class="easyui-linkbutton searchEstateInfo" iconCls="icon-search" style="float: right;">查询</a>');

        /**
         * 关键字查询
         * */
        $("#" + params.id).on('click', 'a.searchEstateInfo', function () {
            // 获取关键字的值
            var params = {
                accessId: "201701",
                keyWord: $("#" + inputKeyWordId).textbox("getValue"),
                city: $("#" + selectCityId).textbox("getValue"),
                areaId: $("#" + selectAreaId).textbox("getValue"),
                subAreaId: $("#" + selectSubAreaId).textbox("getValue"),
                estateStat: "01"
            };
            $("#" + tableEstateInfoId).datagrid("load", params);
        });

        var divInput = $("<div></div>").append($("<span>&nbsp;关键字&nbsp;</span>").append(input).append(aBtn));

        form.append($('<div id="' + selectAreaPluginId + '" style="float: left;"></div>')).append(divInput);

        $("#" + params.id + "").append(form);

        var areaSelParams = {

            // 装 combobox的div的id
            id: selectAreaPluginId,

            // 需要创建的combox 的id cityId:城市combox的id areaId：区域combox的id subAreaId:片区combox的id
            cityId: selectCityId,
            areaId: selectAreaId,
            subAreaId: selectSubAreaId,

            // 默认加载的城市区域
            defaultCityName: '',

            // 默认加载的区域的片区id
            defaultAreaId: '',

            //是否显示 城市类型combox
            showCityAreaCbb: 1,

            //城市 选择combox的宽度
            cityWidth: '90px',

            //区域选择combox的宽度
            areaWidth: '90px',

            //片区选择combox的宽度
            subAreaWidth: '90px',

            // 不为空
            required: false,

            //为空时显示提示
            cityMissingMessage: '城市不能为空',

            areaMissingMessage: '区域不能为空',

            subAreaMissingMessage: '片区不能为空',

            //对加载成功的城市数据进行二次处理，处理完毕返回
            onLoadCityData: function (data) {
                data.unshift({dictCode: "", dictDesc: "全部城市"});

                return data;
            },

            //对加载成功的区域数据进行二次处理，处理完毕返回
            onLoadAreaData: function (data) {
                data.unshift({areaId: "", areaName: "全部区域"});

                return data;
            },

            //对加载成功的片区数据进行二次处理，处理完毕返回
            onLoadSubAreaData: function (data) {
                data.unshift({areaId: "", areaName: "全部片区"});

                return data;
            }
        };

        // 初始化页面地区区域片区选择框
        $("#" + selectAreaPluginId).selectAreaPlugin(areaSelParams);

        // 渲染表单组件样式
        $.parser.parse(form);

        $('<div id="' + detailDialogId + '" class="easyui-dialog" style="width:690px;height:540px;padding:15px;" title="楼盘字典详情" data-options="resizable:true,modal:true,closed:true"></div>').load(basePath + "/view/demo/selEstateInfoDetailDialog.html", null, function () {
            $('#' + detailDialogId).dialog();
            // 进行解析
            $.parser.parse(this);
        }).appendTo('body');

        // 创建表
        var dataTable = $('<table id="' + tableEstateInfoId + '" class="easyui-datagrid" data-options="pagination:true,singleSelect:true,rownumbers:true"></table>');

        $("#" + params.id + "").append(dataTable);

        /**
         * 双击
         */
        $("#" + tableEstateInfoId).datagrid({
            onDblClickRow: function () {
                // 获取选中行
                var row = $("#" + tableEstateInfoId).datagrid("getSelected");
                params.onSelect && params.onSelect(row);
                params.onClose && params.onClose();
                $("#" + params.id).dialog("close");
            }
        });

    }

    /**
     * 1、加载所有登录用户的数据
     * 2、打开对话框
     * */
    function openEstateInfoDialog(params) {
        $("#" + tableEstateInfoId).datagrid({
            url: basePath + "/dataaccess.json",
            queryParams: {accessId: "201701"},
            method: "post",
            columns: [[
                {field: "estateAlias", title: "楼盘字典", width: 90, align: "left", halign: "center"},
                {field: "abbreviation", title: "拼音", width: 90, align: "left", halign: "center"},
                {
                    field: "cityName",
                    title: "地址",
                    width: 130,
                    align: "left",
                    halign: "center",
                    formatter: function (value, row, index) {
                        return row.cityName + "-" + row.areaName + "-" + row.subAreaName;
                    }
                },
                {field: "summaryAddress", title: "概要地址", width: 110, align: "left", halign: "center"},
                {field: "metroNo", title: "地铁", width: 90, align: "left", halign: "center"},
                {field: "propertyUse", title: "用途", width: 65, align: "left", halign: "center"},
                {field: "propertyType", title: "类型", width: 70, align: "left", halign: "center"},
                {field: "remark", title: "备注", width: 65, align: "left", halign: "center"},
                {
                    field: "detail",
                    title: "操作",
                    width: 80,
                    align: "left",
                    halign: "center",
                    formatter: function () {
                        return "<a href='javascript:;' class='linkEstateInfoDetail' style='color: blue; text-decoration: none;' >详情</a>";
                    }
                }
            ]]
        });

        $("#" + params.id + "").dialog("open");

    }

    /**
     * 日期格式化
     */
    function timeformatter(value) {
        if (value == "" || value == undefined) {
            return "";
        } else {
            var date = new Date(value);
            return date.pattern("yyyy-MM-dd");
        }
    }

})(jQuery);
