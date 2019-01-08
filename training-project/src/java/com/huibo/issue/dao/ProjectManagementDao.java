package com.huibo.issue.dao;

import java.util.List;

import com.huibo.issue.po.ProjectManagementPo;

/**
 * <p>title:缺陷管理系统-ProjectManagementDao</p>
 * 
 * <p>Description:缺陷项目管理的dao</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public interface ProjectManagementDao {

	//显示有效项目
	public List<ProjectManagementPo> getProjects(String pId);

	//显示无效项目
	public List<ProjectManagementPo> getProjects1(String pId);
	
	//增加
	public Integer addProject(ProjectManagementPo po);

	//单条查询
	public ProjectManagementPo queryProjectById(String projectId);

	//修改
	public Integer updateProject(ProjectManagementPo po);

	//禁用、启用
	public Integer conversion(ProjectManagementPo po);

	//表单验证
	public Integer validatePriorityCode(ProjectManagementPo po);
}
