package com.huibo.issue.dao;

import java.util.List;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.UserManagementBo;
import com.huibo.issue.po.UserDeptPo;
import com.huibo.issue.po.UserManagementPo;
import com.huibo.issue.po.UserRolePo;
import com.huibo.issue.po.UserSexPo;


/**
* <p>Title: 缺陷跟踪管理系统 - BusinesslogicService</p>
*
* <p>Description:持久层管理的接口</p>
*
* <p>Copyright: Copyright hbkj(c) 2018</p>
*
* <p>Company: 重庆汇博科技股份有限公司</p>
*
* @author 揭振宇
* @version 1.0
*/
public interface UserManagementDao {
	
	//查询所有的用户
	public List<UserManagementPo> getAllUsers(Page page);
	
	//通过编号查询用户
	public UserManagementPo getUserById(UserManagementBo userManagementBo);
	
	//查询所有用户部门
	public List<UserDeptPo> searchDept();
	
	//查询所有用户性别
	public List<UserSexPo> searchSex();
	
	//查询所有用户角色
	public List<UserRolePo> searchRole();
	
/************************************分割线以上是查询语句业务以下是操作语句业务****************************************/
	
	//通过编号数组来删除用户信息
	public void delUserType(String[] delIds);
	
	//增加用户基础信息
	public void addUser(UserManagementBo bo);
	
	//修改用户基础信息
	public void modifyUser(UserManagementBo bo);
	
	//表单验证
	public Integer validatePriorityCode(UserManagementBo bo);
}