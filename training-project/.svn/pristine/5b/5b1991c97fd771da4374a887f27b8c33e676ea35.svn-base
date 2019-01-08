package com.huibo.issue.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.frame.util.CommonFunction;
import com.bn.javax.dao.Page;
import com.huibo.issue.bo.ProjectRoleBo;
import com.huibo.issue.dao.ProjectRoleDao;
import com.huibo.issue.po.ProjectRole;

/**
* <p>Title: 缺陷管理 - ProjectRoleService </p>
*
* <p>Description:业务逻辑层的service</p>
*
* <p>Copyright: Copyright HBRC(c) 2018</p>
*
* <p>Company: 汇博人才</p>
*
* @author 王杰  
* @version 1.0
*/
@Service
public class ProjectRoleService {
	
	@Autowired
	private ProjectRoleDao projectRoleDao;

	/**
	 * 新增
	 * @param bo
	 * @return
	 */
	public Map<String, Object> addProjectRole(ProjectRoleBo bo) {
		// TODO Auto-generated method stub
		int resultCode = 0;

		Map<String, Object> map = new HashMap<String, Object>();

		bo.setCreateBy(CommonFunction.getUserFromSession().getUserId());
		bo.setModifyBy(CommonFunction.getUserFromSession().getUserId());
		
		// 获取角色编号+角色姓名+可操作状态的字符串并传入对应的实体属性中
		String str = bo.getDataStr();
		String[] arr = str.split(",");
		bo.setRoleCode(arr[0]);
		bo.setRoleName(arr[1]);
		//添加角色信息
		projectRoleDao.addProjectRole(bo);
		
		// 循环遍历数组调用Dao层方法循环向数据库角色状态关联表中添加数据
		for (int i = 2; i < arr.length; i++) {
			bo.setIssueCode(arr[i]);
			projectRoleDao.addProjectRoleRel(bo);
		}

		resultCode = 1;
		map.put("resultCode", resultCode);

		return map;
	}

	/**
	 * 分页查询
	 * @param bo
	 * @return
	 */
	public Map<String, Object> queryProjectRole(ProjectRoleBo bo) {
		// TODO Auto-generated method stub
				Map<String,Object> map = new HashMap<String,Object>();
				Page page = new Page(bo);
				List<ProjectRole> list = new ArrayList<ProjectRole>();
				list = projectRoleDao.queryProjectRole(page);
				map.put("rows", list);
				map.put("total", page.getTotalRecord());
				return map;
	}

	/**
	 * 删除
	 * @param roleCodes
	 * @return
	 */
	public Map<String, Object> romoveProjectRoleById(String roleCodes) {
		// TODO Auto-generated method stub
		int resultCode = 0;
		Map<String, Object> map = new HashMap<String, Object>();
		projectRoleDao.romoveProjectRoleById(roleCodes);
		resultCode = 1;
		map.put("resultCode", resultCode);
		return map;
	}

	/**
	 * 验证不重复
	 * @param bo
	 * @return
	 */
	public Map<String, Object> validateRole(ProjectRoleBo bo) {
		// TODO Auto-generated method stub
		int resultCode = 0;
		Map<String, Object> map = new HashMap<String, Object>();
		Integer count = projectRoleDao.validateRole(bo);
	
		if(count == 0) {
			resultCode = 1;
		}
		map.put("resultCode", resultCode);
		return map;
	}

	/**
	 * 禁用启用转换
	 * @param bo
	 * @return
	 */
	public Map<String, Object> switchRo(ProjectRoleBo bo) {
		// TODO Auto-generated method stub
		Map<String, Object> map = new HashMap<String, Object>();
		int row = 0;
		projectRoleDao.switchRo(bo);
		row = 1;
		map.put("result", row);
		
		return map;
	}

	/**
	 * 修改角色信息
	 * @param bo
	 * @return
	 */
	public Map<String, Object> modifyProjectRole(ProjectRoleBo bo) {
		// TODO Auto-generated method stub
		int row = 0;
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		bo.setCreateBy(CommonFunction.getUserFromSession().getUserId());
		bo.setModifyBy(CommonFunction.getUserFromSession().getUserId());
		
		// 获取角色编号+角色姓名+可操作状态的字符串并传入对应的实体属性中
		String str = bo.getDataStr();
		String[] arr = str.split(",");
		bo.setRoleCode(arr[0]);
		bo.setRoleName(arr[1]);
		
		// 删除角色相关信息后再增加
		projectRoleDao.romoveProjectRoleRelById(bo.getRoleCode());
		
		// 添加角色信息
		projectRoleDao.modifyProjectRole(bo);
		
		// 循环遍历数组调用DAO层方法循环向数据库角色状态关联表中添加数据
		for (int i = 2; i < arr.length; i++) {
			
			bo.setIssueCode(arr[i]);
			projectRoleDao.updateRoleStateRel(bo);
		}
		
		row = 1;
		map.put("result",row);
		
		return map;
	}

	/**
	 * 单条查询
	 * @param roleCode
	 * @return
	 */
	public Map<String, Object> queryProjectRoleById(String roleCode) {
		// TODO Auto-generated method stub
		Map<String,Object> map = new HashMap<String,Object>();
		List<ProjectRole> list = projectRoleDao.queryProjectRoleById(roleCode);
		map.put("result",list);
		return map;
	}


}
