package com.huibo.issue.dao;

import java.util.List;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.MemberBo;
import com.huibo.issue.bo.UserBo;
import com.huibo.issue.po.MemberPo;
import com.huibo.issue.po.UserPo;
/**
 * <p>title:缺陷管理系统-MemberDao</p>
 * 
 * <p>Description:缺陷成员管理的dao</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public interface MemberDao {
	//查询
	public List<MemberPo> getMember(MemberBo bo);

	//新增显示角色下拉框
	public List<MemberPo> getRole(MemberBo bo);

	//添加角色
	public Integer addRole(MemberBo bo);

	//新增显示可选的姓名表格
	public List<UserPo> getUser(Page page);

	//删除角色
	public Integer removeRole(String[] delIds);

	//根据角色编号，项目查可选的员工
	public List<UserPo> getMemberUser(UserBo bo);

	//根据角色编号，项目查所有的员工
	public List<UserPo> getUserByRoleCode(UserBo bo);

	//删除员工
	public Integer deleteMemberUser(UserBo bo);
}