//form表单弹窗属性
var options = {
    width: 800,
    height: 500,
    title: '分配系统帐号',
    buttons: '#sc_form'
};

/**
 * 初始化form表单
 */
function initPage() {
    //从任务信息中取出业务主键作为员工id，查询员工信息
    var empId = _taskData.businessKey;
    var infoType = '1002';//员工电子资料

    //通过业务主键查询员工信息
    $.post(basePath + "/dataaccess.json", {
        empId: empId,
        infoType: infoType,
        accessId: '1316'
    }, function (data) {
        $("#detailPhoto").attr("src", basePath + "/gmodule_resmanage_filedown.json?id=" + data.resId + "");
    });

    // 加载角色列表
    $.post(basePath + "/dataaccess.json", {
        accessId: "9301"
    }, function (data) {
        var roles = data.rows;
        if (roles != null) {
            var $td = $("#sysUserRoles");

            for (var i in roles) {
                var role = roles[i];
                $td.append('<label style="width: 25%; display: inline-block;"><input type="checkbox" name="roleIds" value="' + role.roleId + '" />' + role.roleName + '</label>');
            }
        } else {
            $("#roles").html("<span color='red'>角色信息加载失败</span>");
        }
    });

    $.post(basePath + "/dataaccess.json", {
        empId: empId,
        accessId: '1318'
    }, function (data) {
        data.deptNameStr = data.deptId;

        //加载工作岗位
        $.post(basePath + "/dataaccess.json", {
            deptId: data.deptId,
            accessId: '1113'
        }, function (result) {
            var postNames = [];

            $.each(result.rows, function () {
                postNames.push(this.postName);
            });

            data.postName = postNames.join(',');

            //将员工信息显示到dialog中;
            Common.loadDataForDOM(data, "#formParse", "span", "name");
        });
    });
}

/**
 * 完成帐号分配，结束流程
 */
function submit() {
    $.messager.confirm("确认", '是否根据输入内容生成系统帐号并结束流程？', function (r) {
        if (r) {
            var postData = $('#deForm').serializeObject();

            if ($.isArray(postData.roleIds)) {
                postData.roleIds = postData.roleIds.join(',');
            }

            $.ajax({
                type: "post",
                url: basePath + "/businesslogic.json",
                data: $.extend({
                    empId: _taskData.businessKey,
                    taskId: _taskData.id,
                    procInstId: _taskData.procInstId,
                    logicId: '03.01.04'
                }, postData),
                success: function (data) {
                    if (data.resultCode == 1) {
                        //操作成功
                        $.messager.alert("提示信息", "处理完成！", "info");
                        refresh();
                    } else {
                        $.messager.alert("错误信息", "处理失败！", "error");
                    }
                }
            });
        }
        ;
    });
}
