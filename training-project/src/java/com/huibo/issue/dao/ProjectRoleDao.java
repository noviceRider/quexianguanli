package com.huibo.issue.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.ProjectRoleBo;
import com.huibo.issue.po.ProjectRole;

/**
* <p>Title: 缺陷状态 - ProjectRoleDao</p>
*
* <p>Description:接口 - ProjectRole</p>
*
* <p>Copyright: Copyright HBRC(c) 2018</p>

* <p>Company: 汇博人才</p>
*
* @author 王杰  
* @version 1.0
*/
public interface ProjectRoleDao {

	/**
	 * 新增
	 * @param bo
	 */
	public void addProjectRole(ProjectRoleBo bo);
	
	
	/**
	 * 分页查询
	 * @param page
	 * @return
	 */
	public List<ProjectRole> queryProjectRole(Page page);


	/**
	 * 角色状态关联表中增加数据
	 * @param infoIssueRoleBo
	 */
	public void addProjectRoleRel(ProjectRoleBo bo);


	/**
	 * 删除
	 * @param roleCodes
	 */
	public void romoveProjectRoleById( @Param("roleCodes")  String roleCodes);


	/**
	 * 验证不重复
	 * @param bo
	 * @return
	 */
	public Integer validateRole(ProjectRoleBo bo);


	/**
	 * 禁用、启用转换
	 * @param bo
	 */
	public void switchRo(ProjectRoleBo bo);


	/**
	 * 单条查询
	 * @param roleCode
	 * @return
	 */
	public List<ProjectRole> queryProjectRoleById(String roleCode);


	/**
	 * 修改关联表数据
	 * @param bo
	 */
	public void updateRoleStateRel(ProjectRoleBo bo);


	/**
	 * 修改
	 * @param bo
	 */
	public void modifyProjectRole(ProjectRoleBo bo);

	/**
	 * 删除关联表
	 * @param roleCode
	 */
	public void romoveProjectRoleRelById(String roleCode);

}
