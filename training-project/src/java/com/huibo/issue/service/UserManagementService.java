package com.huibo.issue.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.UserManagementBo;
import com.huibo.issue.dao.UserManagementDao;
import com.huibo.issue.po.UserDeptPo;
import com.huibo.issue.po.UserManagementPo;
import com.huibo.issue.po.UserRolePo;
import com.huibo.issue.po.UserSexPo;

/**
* <p>Title: 缺陷跟踪管理系统 - BusinesslogicService</p>
*
* <p>Description:服务层管理的service</p>
*
* <p>Copyright: Copyright hbkj(c) 2018</p>
*
* <p>Company: 重庆汇博科技股份有限公司</p>
*
* @author 揭振宇
* @version 1.0
*/
@Service
public class UserManagementService {

	/**
	* 业务层类：主要处理业务逻辑的类，里面封装好方法给控制器调用
	* 
	*/	
	@Autowired
	//注入的Dao对象可以通过Dao接口与数据库进行数据交互
	private UserManagementDao userManagementDao;

	/**
	 * 查询全部的用户信息，返回list集合对象
	 * @param page
	 * @return
	 */
	public List<UserManagementPo> getAllUsers(Page page) {
		return userManagementDao.getAllUsers(page);
	}

	/**
	 * 查询全部的部门，返回list集合对象
	 * @return
	 */
	public List<UserDeptPo> searchDept() {
		return userManagementDao.searchDept();
	}

	/**
	 * 查询全部的性别信息，返回list集合对象
	 * @return
	 */
	public List<UserSexPo> searchSex() {
		return userManagementDao.searchSex();
	}

	/**
	 * 查询全部的角色信息，返回list集合对象
	 * @return
	 */
	public List<UserRolePo> searchRole() {
		return userManagementDao.searchRole();
	}

	/**
	 * 查询给定编号的用户信息，返回一个用户Po对象
	 * @param userManagementBo
	 * @return
	 */
	public UserManagementPo getUserById(UserManagementBo userManagementBo) {
		return userManagementDao.getUserById(userManagementBo);
	}
	
	/************************************分割线以上是查询语句业务以下是操作语句业务****************************************/

	/**
	 * 删除给定编号的用户信息
	 * @param delIds
	 * @return
	 */
	public Integer delUserType(String[] delIds) {
		userManagementDao.delUserType(delIds);
		return 1;//返回1则证明方法已经执行完毕所以可以直接返回一个1给前端判断是否删除成功
	}
	
	/**
	 * 提交增加的数据，并且在数据库中添加一条记录
	 * @param bo
	 * @return
	 */
	public Integer addUser(UserManagementBo bo) {
		
		UserRolePo role = new UserRolePo();//构造一个用户角色对象
		//通过bo里面的属性给角色对象构造对象
		role.setRole(bo.getRole());
		role.setRoleId(bo.getRoleId());
		userManagementDao.addUser(bo);
		
		return 1;//返回1则证明方法已经执行完毕所以可以直接返回一个1给前端判断是否删除成功
	}

	/**
	 * 把后台修改的数据提交并且重新更新数据库
	 * @param bo
	 * @return
	 */
	public Integer modifyUser(UserManagementBo bo) {
		userManagementDao.modifyUser(bo);//修改得到的的用户信息，无返回，参数为用户基础信息的bo
		return 1;
	}

	/**
	 * 表单验证，验证是否重复
	 * @param bo
	 * @return
	 */
	public Integer validatePriorityCode(UserManagementBo bo) {
		return userManagementDao.validatePriorityCode(bo);
	}
}