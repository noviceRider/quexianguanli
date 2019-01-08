/**
 *标记新增或修改
 */
var isNew;
var empId;
var worklistId;

/**
 * 加载数据
 */
$(function () {
    $("#showEmployeeTable").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId: "1322"}));
    //加载所有下拉选数据
    initAllSelect();
});

/**
 * 查询人事档案信息
 */
function Search() {
    var formData = $("#selectEmployeeForm").serializeObject();
    if (formData.jobPosition == "全部职位") {
        delete formData.jobPosition;
    }
    formData.accessId = "1322";
    $("#showEmployeeTable").datagrid("reload", formData);
}

/**
 * 加载所有下拉选数据
 */
function initAllSelect() {
    //加载职位下拉选
    $("#jobPositionEdit").combobox("loadData", queryDictData("HR_JOB_POSITION"));
    var queryData2 = queryDictData("HR_JOB_POSITION");
    queryData2.unshift({dictDesc: "全部职位"});
    $("#jobPositionQuery").combobox("loadData", queryData2);
}

/**
 * 根据类型编码查询数字典信息
 * @param typeCode 类型编码
 */
function queryDictData(typeCode) {
    var returnData = null;
    $.ajax({
        url: basePath + "/gmodule_datadict_findall.json",
        type: 'post',
        async: false,
        data: {"typeCode": typeCode},
        dataType: "json",
        success: function (data) {
            // 获取数据字典中的字段类型的数据
            returnData = data.rows;
        }
    });
    return returnData;
}

/**
 * 设置显示员工详情
 */
function oprateFormatter(value, row, index) {
    var data = JSON.stringify(row);
    var str = "";

    str = "<a href='#' style='color:blue' onclick='shopAuth(" + data + ")'>配置</a>";

    return str;
}

/**
 *门店授权
 *@param 授权员工数据
 */
function shopAuth(row) {
    $("#empCodeP").text("");
    $("#empNameP").text("");
    $("#jobPositionP").text("");
    $("#deptNameP").text("");
    $("#postNameP").text("");
    $("#empIdP").val("");
    //员工信息显示
    $("#empCodeP").text(row.empCode);
    $("#empNameP").text(row.empName);
    $("#jobPositionP").text(row.jobPosition);
    $("#deptNameP").text(row.deptName);
    $("#postNameP").text(row.postName);
    $("#empIdP").val(row.empId);

    //构造门店复选框
    $("#shopCheckbox").checkBoxGroup({
        width: 'auto',
        height: 'auto',
        url: basePath + "/dataaccess.json",
        method: "post",
        params: {accessId: "61109"},
        valKey: "shopCode",
        textKey: "shopName",
        async: false
    });

    $('.panel-shop-list').panel('resize');

    //勾选原有门店
    if (row.authShopCode != null && row.authShopCode != "" && row.authShopCode != undefined) {
        for (var i = 0; i < row.authShopCode.split(",").length; i++) {

            $("#shopCheckbox").checkBoxGroup("checkByValue", row.authShopCode.split(",")[i]);
        }
    }

    //打开对话框
    $("#authDig").show().dialog({
        width: 600,
        height: 400,
        title: "门店授权",
        modal: true,
        closed: true,
        buttons: '#authDigBtn'
    }).dialog('open');
}

/**
 *当选择一行时，复选框也只能选择这行
 */
function onClickRow(rowIndex, rowData) {
    //设置成不全选
    $("#showEmployeeTable").datagrid("uncheckAll");
    //选择当前行
    $("#showEmployeeTable").datagrid("checkRow", rowIndex);
}

/**
 *当双击单元格时，修改当前行
 */
function onDblClickRow(rowIndex, rowData) {
    shopAuth(rowData);
}

/**
 * 单击
 */
function onClickPost(rowIndex, rowData) {
    //设置成不全选
    $("#selectPostTable").datagrid("uncheckAll");
    //选择当前行
    $("#selectPostTable").datagrid("checkRow", rowIndex);
}

/**
 * 创建数据网格的参数对象(动态计算分页查询数据显示条数)
 * @param bPath 项目路径
 * @param loadUrl 动态加载数据的url
 * @param headHeight 包含表格前与表格头以及分页部分的高度
 * @param params 分页查询所需要的参数
 * @returns {___anonymous7643_7644}
 */
function createDatagridOptionsParams(bPath, loadUrl, params) {
    /*var rowCount = Math.floor((document.body.clientHeight - hHeight)/25);*/
    var rowCount = 5;
    var opts = {};
    opts['url'] = bPath + loadUrl;
    opts['pageList'] = [10, 20, 30, 40, 50];
    opts['pageSize'] = rowCount;
    opts['pageList'].push(rowCount);
    opts['queryParams'] = params;
    //当数据查询完成时，判断数据是否超过一页，如果少于一页，则不显示分页，否则显示分页
    opts['onLoadSuccess'] = function (data) {
        console.log(data);
        $(".datagrid-body").css("overflow", "hidden");
        if (data.total <= opts.pageSize) {
            $(".datagrid-pager").hide();
        } else {
            $(".datagrid-pager").show();
        }
    };

    return opts;
}

/**
 * 关闭弹出窗口，刷新数据
 */
function closeDig() {
    //关闭弹窗
    $("#authDig").dialog("close");
}

/**
 *确认授权
 */
function doSave() {
    var shopList = $("#shopCheckbox").checkBoxGroup("getSelectItems");
    var shopCodeStr = "";
    //构造商铺编码列表
    for (var i = 0; i < shopList.length; i++) {

        shopCodeStr += shopList[i].shopCode;

        if (i < shopList.length - 1) {
            shopCodeStr += ",";
        }
    }

    var doauthParams = {};
    doauthParams.logicId = "04.06.03";
    doauthParams.empId = $("#empIdP").val();
    doauthParams.shopCodeStr = shopCodeStr;
    console.log(doauthParams);
    $.ajax({
        url: basePath + "/businesslogic.json",
        method: "post",
        data: doauthParams,
        success: function (data) {
            if (data.resultCode == 1) {
                $("#showEmployeeTable").datagrid("reload");
                closeDig();
            } else {
                $.messager.alert("错误信息", "保存过程中发生错误，请重试或联系管理员", "error");
            }
        }
    });
}


