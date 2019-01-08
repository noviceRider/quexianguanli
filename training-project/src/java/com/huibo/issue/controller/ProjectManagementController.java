package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huibo.issue.po.IssueSeverityPo;
import com.huibo.issue.po.ProjectManagementPo;
import com.huibo.issue.service.ProjectManagementService;

/**
 * <p>title:缺陷管理系统-projectManagementController</p>
 * 
 * <p>Description:缺陷项目管理的Controller</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
@Controller
public class ProjectManagementController {

	@Autowired
	private ProjectManagementService projectManagementService ;
	/**
	 * 	显示有效项目
	 * @param pId
	 * @return
	 */
	@RequestMapping("/getProjects")
	public Map<String,Object> getProjects(String pId){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("rows", projectManagementService.getProjects(pId));
		return map;
	}
	
	/**
	 * 	显示无效项目
	 * @param pId
	 * @return
	 */
	@RequestMapping("/getProjects1")
	public Map<String,Object> getProjects1(String pId){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("rows", projectManagementService.getProjects1(pId));
		return map;
	}
	
	/**
	 * 	增加
	 * @param po
	 * @return
	 */
	@RequestMapping("/addProject")
	public Map<String,Object>  addProject(ProjectManagementPo po) {
		System.out.println(po);
		return new HashMap<String,Object>() {
			{
				put("result",projectManagementService.addProject(po));
			}
		};
	}
	
	/**
	 * 	单条查询
	 */
	@RequestMapping("/queryProjectById")
	public Map<String,Object> queryProjectById(String projectId){
		return new HashMap<String,Object>() {
			{
				put("result",projectManagementService.queryProjectById(projectId));
			}
		};
	}
	
	/**
	 * 	修改
	 */
	@RequestMapping("/updateProject")
	public  Map<String,Object> updateProject(ProjectManagementPo po){
		return new HashMap<String,Object>() {
			{
				put("result",projectManagementService.updateProject(po));
			}
		};
	}
	
	/**
	 * 	禁用、启用
	 */
	@RequestMapping("/conversion")
	public Map<String,Object> conversion(ProjectManagementPo po) {
		return new HashMap<String,Object>(){
			{
				put("result",projectManagementService.conversion(po));
			}
		};
	}
	
	/**
	 * 	表单验证
	 * @param po
	 * @return
	 */
	@RequestMapping("/yanzheng2")
	public  Map<String, Object> validatePriorityCode(ProjectManagementPo po){
		int code = 0 ;
		Map<String,Object> map = new HashMap<String,Object>();
		Integer count = projectManagementService.validatePriorityCode(po);
		if(count == 0) {
			code = 1;
		}
		map.put("resultCode", code);
		return map;
	}
}