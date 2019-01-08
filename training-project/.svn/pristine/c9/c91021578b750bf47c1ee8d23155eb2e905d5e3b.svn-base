package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huibo.issue.bo.ProjectRoleBo;
import com.huibo.issue.service.ProjectRoleService;

/**
 * <p>
 * Title: 缺陷管理 - ProjectRoleController
 * </p>
 *
 * <p>
 * Description:控制器 - ProjectRole
 * </p>
 *
 * <p>
 * Copyright: Copyright HBRC(c) 2018
 * </p>
 *
 * <p>
 * Company: 汇博人才
 * </p>
 *
 * @author 王杰
 * @version 1.0
 */
@Controller
public class ProjectRoleController {

	@Autowired
	private ProjectRoleService projectRoleService;

	/**
	 * 新增
	 * @param bo
	 * @return
	 */
	@RequestMapping("/addProjectRole")
	public Map<String, Object> addProjectRole(ProjectRoleBo bo) {
		
		Map<String, Object> map = null;
		try {
			map = projectRoleService.addProjectRole(bo);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 删除
	 * 
	 * @param bo
	 * @return
	 */
	@RequestMapping("/removeProjectRoleById")
	public Map<String, Object> romoveProjectRoleById(String roleCodes) {

		Map<String, Object> map = null;
		try {
			map = projectRoleService.romoveProjectRoleById(roleCodes);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 修改
	 * @param bo
	 * @return
	 */
	@RequestMapping("/modifyProjectRole")
	public Map<String, Object> modifyProjectRole(ProjectRoleBo bo){
	
			Map<String, Object> map = null;
		try {
			map = projectRoleService.modifyProjectRole(bo);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 按条件查询
	 * @param bo
	 * @return
	 */
	@RequestMapping("/queryProjectRole")
	public Map<String, Object> queryProjectRole(ProjectRoleBo bo) {
		Map<String, Object> map = null;
		try {
			map = new HashMap<String, Object>();

			map = projectRoleService.queryProjectRole(bo);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return map;
	}

	/**
	 * 单条查询
	 */
	@RequestMapping("/queryProjectRoleById")
	public Map<String, Object> queryProjectRoleById(String roleCode) {
		
		Map<String, Object> map = null;
		try {
			map = projectRoleService.queryProjectRoleById(roleCode);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return map;
	}
	
	/**
	 * 禁用、启用
	 */
	@RequestMapping("/switchRo")
	public Map<String, Object> switchRo(ProjectRoleBo bo){
		
		return new HashMap<String, Object>(){
			{
				put("result",projectRoleService.switchRo(bo));
			}
		};
		
	}
	
	/**
	 * 验证
	 */
	@RequestMapping("/validateRole")
	public Map<String, Object> validateState(ProjectRoleBo bo){
	
		Map<String, Object> map = null;
		try {
			map = projectRoleService.validateRole(bo);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
		
	}
	
}
