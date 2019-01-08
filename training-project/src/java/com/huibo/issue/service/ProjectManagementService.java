package com.huibo.issue.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.frame.util.CommonFunction;
import com.huibo.issue.dao.ProjectManagementDao;
import com.huibo.issue.po.ProjectManagementPo;
/**
 * <p>title:缺陷管理系统-ProjectManagementService</p>
 * 
 * <p>Description:缺陷项目管理的Service</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
@Service
public class ProjectManagementService {
	@Autowired
	private  ProjectManagementDao projectManagementDao ;

	/**
	 * 显示有效项目
	 * @param pId
	 * @return
	 */
	public List<ProjectManagementPo> getProjects(String pId) {
		pId = pId == null ? "-1":pId;
		List<ProjectManagementPo> list = projectManagementDao.getProjects(pId);
		for (ProjectManagementPo po : list) {
			if (projectManagementDao.getProjects(pId) != null) {
				po.setChildren(getProjects(po.getProjectId()));
			}
		}
		return list;
	}

	/**
	 * 显示无效项目
	 * @param pId
	 * @return
	 */
	public List<ProjectManagementPo> getProjects1(String pId) {
		pId = pId == null ? "-1":pId;
		List<ProjectManagementPo> list = projectManagementDao.getProjects1(pId);
		for (ProjectManagementPo po : list) {
			if (projectManagementDao.getProjects(pId) != null) {
				po.setChildren(getProjects1(po.getProjectId()));
			}
		}
		return list;
	}
	
	/**
	 * 增加
	 * @param po
	 * @return
	 */
	public Integer addProject(ProjectManagementPo po) {
		po.setProjectState("01");
		po.setCreateBy(CommonFunction.getUserFromSession().getUserId());
		po.setModifyBy(CommonFunction.getUserFromSession().getUserId());
		Integer row = projectManagementDao.addProject(po);
		return row;
	}

	/**
	 * 单条查询
	 * @param projectId
	 * @return
	 */
	public ProjectManagementPo queryProjectById(String projectId) {
		return projectManagementDao.queryProjectById(projectId);
	}

	/**
	 * 修改
	 * @param po
	 * @return
	 */
	public Integer updateProject(ProjectManagementPo po) {
		po.setModifyBy(CommonFunction.getUserFromSession().getUserId());
		return projectManagementDao.updateProject(po);
	}

	/**
	 * 禁用、启用
	 * @param po
	 * @return
	 */
	public Integer conversion(ProjectManagementPo po) {
		return projectManagementDao.conversion(po);
	}


	/**
	 * 	表单验证
	 * @param po
	 * @return
	 */
	public Integer validatePriorityCode(ProjectManagementPo po) {
		return projectManagementDao.validatePriorityCode(po);
	}
}