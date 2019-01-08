/**
 *标记新增或修改
 */
var isNew;
var empId;
var worklistId;
var infoType = '1002';//员工电子资料
var typeId = '1142';//其他电子资料
var picTypeId = '1141';//员工照片
var opType;//电子资料操作类型
var refInfoType = '23';//资源引用表里的infoType
var currUserInfo; //当前登录用户信息
/**
 * 加载岗位信息
 */
$(function () {
    $("#picLogo").filebox({
        accept: ['image/jpg', 'image/bmp', 'image/jpeg', 'image/gif', 'image/png']
    });
    $("#showEmployeeTable").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId: "1301"}));
    //加载所有下拉选数据
    initAllSelect();
    //详情页面
    $("#emp_detail").load("emp_detail.html", null, function () {
        //进行解析
        $.parser.parse(this);
    });

    //获取当前用户
    $.ajax({
        url: basePath + "/frame_sysrole_finduser.json",
        type: "post",
        async: false,
        success: function (data) {
            //得到用户
            currUserInfo = data.user;
        }
    });

});

/**
 * 查询人事档案信息
 */
function Search() {
    var formData = $("#selectEmployeeForm").serializeObject();
    if (formData.empType == "全部类型") {
        delete formData.empType;
    }
    if (formData.empState == "全部状态") {
        delete formData.empState;
    }
    if (formData.jobPosition == "全部职位") {
        delete formData.jobPosition;
    }
    formData.accessId = "1301";
    $("#showEmployeeTable").datagrid("load", formData);
}

/**
 * 点击打开新增弹窗
 *
 */
function add() {

    $("#empNameEdit").textbox({
        onChange: function () {
            nameChange();
        }
    });

    $("#isChangePic").val("");
    isNew = true;
    //重置表单
    $("#addAndSubmitForm").form("reset");

    //初始化所有下拉选数据
    initAllSelect();
    //加载组织机构树
    loadDeptTree();

    //打开新增弹窗
    $("#addAndSubmitDiv").dialog({
        title: "新增人事档案",
        width: "650px",
        height: "550px"
    }).dialog("open").dialog("center");
    validateCode('', 1);
}

/**
 * 点击打开修改弹窗
 */
function modify() {

    $("#empNameEdit").textbox({
        onChange: function () {
            nameChange();
        }
    });

    $("#isChangePic").val("");
    isNew = false;
    //重置表单
    $("#addAndSubmitForm").form("reset");
    //加载组织机构树
    loadDeptTree();
    //判断选中项
    var selectRows = $("#showEmployeeTable").datagrid("getSelections");
    if (selectRows.length > 1) {
        $.messager.alert("提示信息", "请勿选中多条记录", "info");
    } else if (selectRows.length < 1) {
        $.messager.alert("提示信息", "请选中一条记录", "info");
    } else {
        //初始化所有下拉选数据
        initAllSelect();
        //数据回显
        var row = $("#showEmployeeTable").datagrid("getSelected");
        //记录员工编号
        empId = row.empId;
        //加载工作经验
        loadWork();
        //加载电子资料
        loadEleRecord();
        //加载岗位数据
        setTimeout(function () {
            loadPostData(row.deptId);
        }, 10);

        //岗位字符串转数组
        postIdArray = row.postId ? row.postId.split(",") : "";
        var newpostIdArray = [];
        for (var i = 0; i < postIdArray.length; i++) {
            if (postIdArray[i] != null && postIdArray[i] != "") {
                newpostIdArray.push(postIdArray[i]);
            }
        }
        //复制row对象，用于回显数据
        var newRow = $.extend({}, row);
        newRow.postId = newpostIdArray;
        setTimeout(function () {
            $('#addAndSubmitForm').form('load', newRow);
        }, 20);
        $("#addAndSubmitDiv").dialog({
            title: "修改人事档案",
            width: "650px",
            height: "550px",
        }).dialog("open").dialog("center");
        validateCode(row.empId, 0);
    }
}

/**
 * 新增修改保存
 */
function doSave() {
    var formObj = $("#addAndSubmitForm").serializeObject();
    var form = new FormData(document.getElementById("addAndSubmitForm"));
    formObj.infoType = infoType;
    formObj.typeId = picTypeId;
    //表单里面没有的字段用append
    formObj.resDesc = "员工" + formObj.empName + "的照片";
    var detp = $("#deptIdEdit").val();
    //表单里面有的字段用set来设置值
    formObj.deptId = detp;
    if (isNew) {
        formObj.logicId = '04.03.01';
    } else {//修改保存
        formObj.logicId = '04.03.02';
        //数据回显
        var row = $("#showEmployeeTable").datagrid("getSelected");
        formObj.empId = row.empId;
    }
    //资源引用表的的资源类型
    formObj.refInfoType = refInfoType;
    //由于之前做的资源表和关系表的infoType是相同的值，用的是同一个字段，现在是修改成了不同的值，infoType2用来起中间作用
    formObj.infoType2 = infoType;
    //拼接岗位id字符串
    var postIdArray = form.getAll("postId");
    var newpostIdArray = [];
    for (var i = 0; i < postIdArray.length; i++) {
        if (postIdArray[i] != null && postIdArray[i] != "") {
            newpostIdArray.push(postIdArray[i]);
        }
    }
    var postId = newpostIdArray.join(",");

    formObj.postId = postId;

    console.log(postId);
    //文件上传，保存数据
    if ($("#addAndSubmitForm").form("validate")) {
        $("#addAndSubmitForm").form("submit", {
            type: "post",
            url: basePath + "/businesslogic_upload.json",
            onSubmit: function (formData) {
                formData.infoType = formObj.infoType;
                formData.typeId = formObj.typeId;
                formData.resDesc = formObj.resDesc;
                formData.deptId = formObj.deptId;
                formData.logicId = formObj.logicId;
                if (!isNew) {
                    formData.empId = formObj.empId;
                }
                formData.refInfoType = formObj.refInfoType;
                formData.infoType2 = formObj.infoType2;
                $("#postNameEdit").combobox("setValue", postId);
                $("#deptIdEdit").val(formObj.deptId);
            },
            success: function (data) {
                if (JSON.parse(data).resultCode == "1") {
                    //关闭弹窗
                    closeDig();
                } else {
                    $.messager.alert("错误信息", "操作失败！", "error");
                }
            }
        });
    } else {//必填项，并且提示框没有出现的几项
        if (formData.empCode == "" || formData.empCode == null) {
            $.messager.alert("提示信息", "请输入员工编码！", "info");
        } else if (formData.empName == "" || formData.empName == null) {
            $.messager.alert("提示信息", "请输入员工姓名！", "info");
        } else if (formData.empState == "" || formData.empState == null) {
            $.messager.alert("提示信息", "请选择员工状态！", "info");
        } else if (formData.jobPosition == "" || formData.jobPosition == null) {
            $.messager.alert("提示信息", "请选择员工职位！", "info");
        } else if (formData.deptName == "" || formData.deptName == null) {
            $.messager.alert("提示信息", "请选择员工部门！", "info");
        } else if (formData.postId == "" || formData.postId == null) {
            $.messager.alert("提示信息", "请选择员工岗位，若岗位下拉数据为空，请先选择员工部门！", "info");
        }
    }
}

/**
 * filebox的change事件，主要用于控制是否修改员工头像
 */
function onChangeFile() {
    $("#isChangePic").val("1");
}

/**
 * 关闭修改或添加弹出框
 */
function closePostDialog() {
    $("#addAndSubmitDiv").dialog("close");
}

/**
 * 验证编号不重复
 */
function validateCode(empId, isNew) {
    $('#empCodeEdit').textbox({
        required: true,
        missingMessage: '请输入员工编号',
        invalidMessage: '员工编号已经存在',
        //参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
        validType: "remoteValid['" + basePath + "/businesslogic.json','empCode',{logicId:'04.03.06',empId:'" + empId + "',isNew:'" + isNew + "'}]"
    });
}

/**
 * 关闭弹窗时移除工作经验和电子资料节点
 */
function onClose() {
    //移动工作经验节点
    $("#workExpOld").append($("#addAndSubmitDiv #workContent").hide());
    //移动电子资料节点
    $("#eleRecordOld").append($("#addAndSubmitDiv #eleRecordContent").hide());
}

/**
 * 删除人事档案
 */
function remove() {
    //获取当前选择的信息数组
    var ids = Common.getSelectedIds("#showEmployeeTable", "empId", "empIds");
    if (ids.length == 0) {
        $.messager.alert("提示信息", "请选择你要删除的数据！", "info");
    } else {
        if ($.messager.confirm("提示信息", "是否删除所选的人事档案信息，这一操作是不可逆的，是否继续？", function (r) {
                if (r) {
                    var empIds = [];
                    for (var i in ids) {
                        empIds.push(ids[i].value);
                    }
                    //执行删除操作
                    $.ajax({
                        type: "post",
                        url: basePath + "/businesslogic.json",
                        data: {empIds: empIds.join(","), logicId: "04.03.03", infoType: refInfoType},
                        success: function (data) {
                            var result = data.resultCode;
                            if (result == "1") {
                                //关闭弹窗
                                $("#addAndSubmitDiv").dialog("close");
                                //刷新列表
                                Search();
                            } else {
                                $.messager.alert("提示信息", "操作失败！", "info");
                            }
                        }
                    });
                }
            })) ;
    }
}

/**
 * 加载所有下拉选数据
 */
function initAllSelect() {
    //加载性别下拉选
    $("#genderEdit").combobox("loadData", queryDictData("GENDER"));
    //加载员工类型下拉选
    $("#empTypeEdit").combobox("loadData", queryDictData("HR_EMP_TYPE"));
    var queryData = queryDictData("HR_EMP_TYPE");
    queryData.unshift({dictDesc: "全部类型"});
    $("#empTypeQuery").combobox("loadData", queryData);
    //加载名族下拉选
    $("#nationalEdit").combobox("loadData", queryDictData("HR_NATIONAL"));
    //加载员工状态下拉选
    $("#empStateEdit").combobox("loadData", queryDictData("HR_EMP_STATUS"));
    var queryData1 = queryDictData("HR_EMP_STATUS");
    queryData1.unshift({dictDesc: "全部状态"});
    $("#empStateQuery").combobox("loadData", queryData1);
    //加载最高学历下拉选
    $("#eduQualificationEdit").combobox("loadData", queryDictData("HR_EDU_QUALIFICATION"));
    //加载院校级别下拉选
    $("#collegeLvlEdit").combobox("loadData", queryDictData("HR_COLLEGE_LVL"));
    //加载英语能力下拉选
    $("#engAbilityEdit").combobox("loadData", queryDictData("HR_ENG_ABILITY"));
    //加载职位下拉选
    $("#jobPositionEdit").combobox("loadData", queryDictData("HR_JOB_POSITION"));
    var queryData2 = queryDictData("HR_JOB_POSITION");
    queryData2.unshift({dictDesc: "全部职位"});
    $("#jobPositionQuery").combobox("loadData", queryData2);
    //加载岗位数据
    //loadPostData();
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
function detailFormatter(value, row, index) {
    var data = JSON.stringify(row);
    var html = "<a href='#1' onclick='detail(\"" + index + "\",\"" + row.empId + "\")' style='color: blue;' >详情</a>";

    //限制不可修改当前登录用户信息
    if (row.userId != currUserInfo.userId) {
        html += "<a href='#1' onclick='sysUser(" + data + ")' style='color: blue;margin-left:10px' >系统账号</a>";
    }

    return html;
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
    modify();
}

//******************************************* 选择所属机构  *****************************************
/**
 * 加载部门树结构
 */
function loadDeptTree() {
    var loadDeptParams = {};
    loadDeptParams.logicId = "04.01.01";
    loadDeptParams.postId = "";
    //加载部门树结构
    $("#deptNameEdit").combotree({
        url: basePath + "/businesslogic.json",
        method: "post",
        animate: true,//动画效果
        checkbox: true,//节点前勾选框
        queryParams: loadDeptParams,
        loadFilter: function (data1, parent) {
            var data = data1.rows;
            for (var i in data) {
                data[i].text = data[i].text;
            }
            return data;
        },
        onSelect: function (node) {
            //设值
            $("#deptIdEdit").val(node.deptId);
            loadPostData(node.deptId);
            //
        }
    });
}

/**
 * 加载部门树结构
 */
function loadDeatailDeptTree() {
    var loadDeptParams = {};
    loadDeptParams.logicId = "04.01.01";
    loadDeptParams.postId = "";
    //加载部门树结构
    $("#deptNameEditDt").combotree({
        url: basePath + "/businesslogic.json",
        method: "post",
        animate: true,//动画效果
        checkbox: true,//节点前勾选框
        queryParams: loadDeptParams,
        loadFilter: function (data1, parent) {
            var data = data1.rows;
            for (var i in data) {
                data[i].text = data[i].text;
            }
            return data;
        },
        onSelect: function (node) {
            //设值
            $("#deptIdEditDt").val(node.deptId);
            loadPostDataDt(node.deptId);
            //
        }
    });
}

/**
 * 加载岗位数据
 */
function loadPostData(deptId) {
    //初始化
    $("#postNameEdit").combobox('loadData', []);
    $("#postNameEdit").combobox('clear');
    var postData = [];
    $.ajax({
        type: "post",
        url: basePath + "/dataaccess.json",
        data: {deptId: deptId, accessId: '1113'},
        async: false,
        success: function (data) {
            postData = data.rows;
        }
    });
    //岗位字符串转数组
    var newpostIdArray = [];
    for (var i = 0; i < postData.length; i++) {
        if (postData[i] != null && postData[i] != "") {
            newpostIdArray.push(postData[i]);
        }
    }
    $("#postNameEdit").combobox('loadData', newpostIdArray);
}

/**
 * 加载岗位数据
 */
function loadPostDataDt(deptId) {
    //初始化
    $("#postNameEditDt").combobox('loadData', []);
    $("#postNameEditDt").combobox('clear');
    var postData = [];
    $.ajax({
        type: "post",
        url: basePath + "/dataaccess.json",
        data: {deptId: deptId, accessId: '1113'},
        async: false,
        success: function (data) {
            postData = data.rows;
        }
    });
    var newpostIdArray = [];
    for (var i = 0; i < postData.length; i++) {
        if (postData[i] != null && postData[i] != "") {
            newpostIdArray.push(postData[i]);
        }
    }
    $("#postNameEditDt").combobox('loadData', newpostIdArray);
}

//******************************************* 选择工作岗位 ***************************************************
/**
 * 打开选择岗位弹窗
 */
function selectPost() {
    //打开弹窗
    $("#selectPostDialog").dialog({
        title: "选择工作岗位",
        width: "650px",
        height: "308px"
    }).dialog("open").dialog("center");
    $("#selectPostTable").datagrid(createDatagridOptionsParams(basePath, "/dataaccess.json", {accessId: "1101"}));
}

/**
 * 选择工作岗位
 */
function selectPostId() {
    //得到选择的岗位信息
    var row = $("#selectPostTable").datagrid("getSelected");
    //设值
    $("#postNameEdit").textbox("setValue", row.postName);
    $("#postIdEdit").val(row.postId);
    //关闭弹窗
    $('#selectPostDialog').dialog('close');
}

/**
 * 根据关键字查询岗位信息
 */
function queryPost() {
    $("#selectPostTable").datagrid("load", {keyWord: keyWord, accessId: "1101"});
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
 * 双击选择
 */
function dbClickSelect(rowIndex, rowData) {
    //设值
    $("#postNameEdit").textbox("setValue", rowData.postName);
    $("#postIdEdit").val(rowData.postId);
    //关闭弹窗
    $('#selectPostDialog').dialog('close');
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
    $("#addAndSubmitDiv").dialog("close");
    //移动工作经验节点
    $("#workExpOld").append($("#addAndSubmitDiv #workContent").hide());
    //移动电子资料节点
    $("#eleRecordOld").append($("#addAndSubmitDiv #eleRecordContent").hide());
    //刷新列表
    Search();
}

//******************************************* 工作经验 ***************************************************
function loadWork() {
    //修改时在table后面添加工作经验
    $("#addAndSubmitDiv #workExp").append($("#workContent").show());
    $("#workTable").datagrid({
        url: basePath + "/dataaccess.json",
        queryParams: {accessId: '1312', empId: empId},
        onDblClickRow: function (index, row) {
            modifyWork();
        }
    });
}

/**
 * 添加工作经历
 */
function addWork() {
    workIsNew = true;
    saveWorkUrl = basePath + "/dataaccess.json";
    $("#work_am").form('reset');
    //打开添加对话框
    $("#work_dialog").dialog('setTitle', '添加工作经历').dialog('open').dialog('center');
    $(".dialog-button").css("text-align", "right");
    //添加验证
    validateWork();
    setTimeout($("#unitNameWork").textbox().next("span").find("input").focus(), 500);
}

/**
 * 工作经历修改代码管理
 */
function modifyWork() {
    //修改标志
    workIsNew = false;
    //设置修改url
    saveWorkUrl = basePath + "/dataaccess.json";
    //获取选择的数据
    var rows = $("#workTable").datagrid("getSelections");
    if (rows.length != 1) {
        $.messager.alert("提示信息", "请选择要修改的数据");
    } else {
        //主键
        worklistId = rows[0].listId;
        //打开对话框
        $("#work_dialog").dialog({
            modal: true,
            title: "修改工作经历",
            onClose: function () {
                //清空数据
                $("#work_am").form("reset");
            }
        }).dialog('open').dialog("center");
        //数据回显
        $("#work_am").form("load", rows[0]);
        //进行验证
        validateWork();
        setTimeout($("#unitNameWork").textbox().next("span").find("input").focus(), 500);
    }
}

/**
 * 工作经历删除
 */
function removeWork() {
    //获取修改的数据
    var rows = $("#workTable").datagrid("getSelections");
    if (rows.length != 1) {
        $.messager.alert("提示信息", "请选择要删除的数据");
    } else {
        $.messager.confirm("提示信息", "你确定要删除这条数据吗？删除后将无法恢复！", function (r) {
            if (r) {
                $.ajax({
                    url: basePath + "/dataaccess.json",
                    type: 'post',
                    data: {listId: rows[0].listId, accessId: '1314'},
                    success: function (data) {
                        if (data.resultCode == 1) {
                            //刷新数据网格
                            $("#workTable").datagrid("reload");
                        } else {
                            $.messager.alert("提示信息", "删除失败！", "info");
                        }
                    }
                });
            }
        });
    }
}

/**
 * 验证工作经历各项不能为空，且开始时间不能大于结束时间
 */
function validateWork() {
    $("#unitNameWork").textbox({
        required: true,
        missingMessage: "公司名称不能为空"
    });
    $("#jobPositionWork").textbox({
        required: true,
        missingMessage: "工作岗位不能为空"
    });
    $("#workScopeWork").textbox({
        required: true,
        missingMessage: "工作职责不能为空"
    });
    $("#startTimeWork").textbox({
        required: true,
        missingMessage: "开始时间不能为空"
    });
    $("#endTimeWork").textbox({
        required: true,
        missingMessage: "结束时间不能为空",
        invalidMessage: "结束时间不能小于开始时间",
        validType: 'projectTime["startTimeWork"]'
    });
}

/**
 * 工作经历新增、修改保存
 */
function doWorkSave() {
    //提交数据
    if ($("#work_am").form("validate")) {
        $("#work_am").form("submit", {
            method: "post",
            url: saveWorkUrl,
            onSubmit: function (param) {
                param.empId = empId;
                //param.accessId='1311';
                if (!workIsNew) {
                    param.listId = worklistId;
                    param.accessId = '1313';
                } else {
                    param.accessId = '1311';
                }
            },
            success: function (data) {
                var data1 = JSON.parse(data);
                if (data1.resultCode == "1") {
                    //刷新数据网格
                    $("#workTable").datagrid("reload");
                    //关闭对话框
                    $('#work_dialog').dialog('close');
                    //清空数据
                    $("#work_am").form("reset");
                } else if (data1.resultCode == "0") {
                    $.messager.alert("提示信息", "操作失败了，请联系管理员", "error");
                } else {
                    $.messager.alert("提示信息", "操作失败，请联系管理员", "error");
                }
            }
        });
    }
}

//******************************************* 电子资料 ***************************************************
function loadEleRecord() {
    //修改时在table后面添加工作经验
    $("#addAndSubmitDiv #eleRecord").append($("#eleRecordContent").show());
    $("#resTable").datagrid({
        url: basePath + "/dataaccess.json",
        queryParams: {accessId: '1315', empId: empId, infoType: refInfoType},
        onDblClickRow: function (index, row) {
            modifyEleRes();
        },
        loadFilter: function (data) {
            var filterData = [];
            var showData = {};
            for (var i = 0; i < data.rows.length; i++) {
                if (data.rows[i].fileSize != 0) {
                    filterData.push(data.rows[i]);
                }
            }
            showData.rows = filterData;
            return showData;
        }
    });
}

//格式化文件大小
function fileSizeFormatter(value) {
    if (null == value || value == '') {
        return "0 Bytes";
    }
    var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    var index = 0;
    var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2); //保留的小数位数
    return size + unitArr[index];
}

//格式化文件上传时间
function uploadTimeFormatter(value) {
    if (null == value || value == '') {
        return "";
    }
    return new Date(value).pattern("yyyy-MM-dd");
}

/**
 * 设置下载链接
 */
function downFormatter(value, row, index) {
    if (row.isPic == "1") {
        return "<a href='" + basePath + "/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;' >下载</a> | <a href='#'  style='color: blue;' onclick=lookPic(" + row.resId + ")>预览</a>";
    } else {
        return "<a href='" + basePath + "/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;' >下载</a>";
    }
}

/**
 * 预览
 */
function lookPic(id) {
    var aaa = [];
    var url = {url: '' + basePath + '/gmodule_resmanage_filedown.json?id=' + id};
    aaa.push(url);
    $("#aaa").picturePreview(aaa, "showPics");
}

/**
 * 上传电子资料
 */
function uploadEleRes() {
    //新增操作类型
    opType = 'add';
    //设置默认的项目id，分类序号
    $("#techlvl_dlg_am").dialog({
        modal: true,
        title: "电子资料管理",
        onClose: function () {
            //清空数据
            $("#techlvl_fm_am").form("reset");
        }
    });
    //验证
    validateEleRes();
    //项目名称编辑框获取焦点
    setTimeout(function () {
        $("#resDesc").textbox("textbox").focus();
    }, 300);
}

/**
 * 修改电子资料
 */
function modifyEleRes() {
    //获取选择的数据
    var rows = $("#resTable").datagrid("getSelections");
    if (rows.length != 1) {
        $.messager.alert("提示信息", "请选择要修改的数据");
    } else {
        //修改操作类型
        opType = 'modify';
        //打开对话框
        $("#techlvl_dlg_am").dialog({
            modal: true,
            title: "项目资源管理",
            onClose: function () {
                //清空数据
                $("#techlvl_fm_am").form("reset");
            }
        });
        //数据回显
        $("#techlvl_fm_am").form("load", rows[0]);
        //进行验证
        validateEleRes();
        //项目名称编辑框获取焦点
        setTimeout(function () {
            $("#resDesc").textbox("textbox").focus();
        }, 300);
    }
}

/**
 * 删除电子资料
 */
function deleteEleRes() {
    //获取修改的数据
    var rows = $("#resTable").datagrid("getSelections");
    if (rows.length != 1) {
        $.messager.alert("提示信息", "请选择要删除的数据");
    } else {
        $.messager.confirm("提示信息", "你确定要删除这条数据吗？删除后将无法恢复！", function (r) {
            if (r) {
                //删除资源
                $.ajax({
                    type: "post",
                    url: basePath + "/businesslogic.json",
                    data: {
                        resId: rows[0].resId,
                        refInfoType: refInfoType,
                        infoType: infoType,
                        infoId: empId,
                        opType: 'delete',
                        logicId: '04.03.04'
                    },
                    success: function (data) {
                        if (data.resultCode == "1") {
                            //刷新数据网格
                            $("#resTable").datagrid("reload");
                        } else {
                            $.messager.alert("错误信息", "操作失败！", "error");
                        }
                    }
                });
            }
        });
    }
}

/**
 * 新增修改保存
 */
function doSaveResource() {
    //var formData = $("#addAndSubmitForm").serializeObject();
    var form = new FormData(document.getElementById("techlvl_fm_am"));
    form.append("infoType", infoType);
    form.append("typeId", typeId);
    form.append("deptId", $("#deptIdEdit").val());
    form.append("logicId", '04.03.04');
    //数据回显
    var row = $("#showEmployeeTable").datagrid("getSelected");
    form.append("empId", row.empId);
    form.append("opType", opType);
    form.append("refInfoType", refInfoType);
    //文件上传，保存数据
    if ($("#techlvl_fm_am").form("validate")) {
        $.ajax({
            type: "post",
            url: basePath + "/businesslogic_upload.json",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.resultCode == "1") {
                    $("#resTable").datagrid("reload");
                    $('#techlvl_dlg_am').dialog('close');
                } else {
                    $.messager.alert("错误信息", "操作失败！", "error");
                }
            }
        });
    }
}

/**
 * 关闭窗口
 */
function doCloseResource() {
    $('#techlvl_dlg_am').dialog('close');
}

/**
 * 验证资源描述，不为空
 */
function validateEleRes() {
    $("#resDesc").textbox({
        required: true,
        missingMessage: "资源描述不能为空"
    });
}

/**
 * 详情
 */
function detail(index, empId) {
    var rows = $("#showEmployeeTable").datagrid("getData");
    loadDeatailDeptTree();
    loadPostDataDt(rows.rows[index].deptId);
    //将员工信息显示到dialog中;
    Common.loadDataForDOM(rows.rows[index], "#emp_detail", "span", "name");
    //头像
    $.ajax({
        type: "post",
        url: basePath + "/dataaccess.json",
        data: {empId: empId, infoType: refInfoType, accessId: '1316'},
        success: function (data) {
            if (data.resId) {
                $("#detailPhoto").attr("src", basePath + "/gmodule_resmanage_filedown.json?id=" + data.resId + "&date=" + new Date());
            } else {
                $("#detailPhoto").attr("src", "images/userLogo.jpg");
            }

        }
    });
    // 根据所选员工加载电子材料数据，再将信息显示在数据网格中
    $("#filegrid").datagrid({
        url: basePath + "/dataaccess.json",
        queryParams: {accessId: '1315', empId: empId, infoType: infoType, refInfoType: refInfoType},
    });
    //工作经验
    $("#detailWorkTable").datagrid({
        url: basePath + "/dataaccess.json",
        queryParams: {accessId: '1312', empId: empId},
    });
    //打开对话框
    $("#emp_detail").dialog({
        modal: true,
        title: "员工信息详情",
        onClose: function () {
            //清空数据
            //$("#techlvl_fm_am").form("reset");
        }
    }).dialog('open');
}

/**
 * 分配系统账号
 *
 */
function sysUser(data) {

    //系统账号页面
    $("#sysUser").load("generateSysUser.html", null, function () {
        //进行解析
        $.parser.parse(this);
        if (typeof(initPage)) {
            initPage(data.empId);
        }
    });
    //打开对话框
    $("#sysUser").dialog({
        modal: true,
        onClose: function () {

        }
    }).dialog('open');
}

/**
 *姓名输入框变化事件
 *自动填充姓名全拼
 */
function nameChange() {
    var value = $("#empNameEdit").textbox("getValue");
    var pinyin = '';
    if (value) {
        var tokens = Pinyin.parse($("#empNameEdit").textbox("getValue"));
        var lastToken;
        tokens.forEach(function (v, i) {
            if (v.type === 2) {
                pinyin += pinyin && !/\n|\s/.test(lastToken.target) ? ' ' + format(v.target) : format(v.target);
            } else {
                pinyin += (lastToken && lastToken.type === 2 ? ' ' : '') + v.target;
            }
            lastToken = v;
        });
    }

    //姓名全拼
    $("#pinyinNameFull").textbox("setValue", pinyin);

    //姓名简拼
    var pinyinList = pinyin.split(" ");
    var pinyinShort = "";
    //获取每个字首字母
    for (var i = 0; i < pinyinList.length; i++) {
        pinyinShort += pinyinList[i].charAt(0).toUpperCase();
    }

    $("#pinyinNameShort").textbox("setValue", pinyinShort);
}

/**
 *转小写
 */
function format(str) {
    if (str) {
        return str.toLowerCase();
    }
    return '';
}