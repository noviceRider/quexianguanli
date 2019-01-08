package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.bn.frame.util.CommonFunction;
import com.huibo.issue.bo.IssueBaseInfoBo;
import com.huibo.issue.po.IssueAttachPo;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.service.DefectListService;

/**
* <p>Title: 缺陷管理系统 - DefectListController</p>
*
* <p>Description:缺陷列表的Controller</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
@Controller
public class DefectListController {
	
	@Autowired
	private DefectListService defectListService;
	
	/**
	 * 加载数据网格
	 */
	@RequestMapping("/getDefectList.json")
	public Map<String, Object> getDefectList(IssueBaseInfoBo issueBaseInfoBo){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.getDefectList(issueBaseInfoBo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 搜索
	 */
	@RequestMapping("/getDefectListOne")
	public Map<String,Object> getDefectListOne(IssueBaseInfoPo issueBaseInfoBo){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.getDefectListOne(issueBaseInfoBo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 新增和修改任务中的查询项目中的查询
	 */
	@RequestMapping("/queryProject")
	public Map<String,Object> queryProject(IssueBaseInfoPo issueBaseInfoBo){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.queryProject(issueBaseInfoBo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 新增和修改任务中的查询缺陷中的查询
	 */
	@RequestMapping("/queryDefect")
	public Map<String,Object> queryDefect(IssueBaseInfoPo issueBaseInfoBo){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.queryDefect(issueBaseInfoBo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 新增增加任务
	 */
	@RequestMapping("/addPostAssignment")
	public Map<String,Object> addPostAssignment(IssueBaseInfoPo baseInfoPo,MultipartFile file){
		Map<String, Object> map = new HashMap<>();
		try {
			map.put("rows",defectListService.addPostAssignment(baseInfoPo,file));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 修改
	 */
	@RequestMapping("modification")
	public Map<String,Object> modification(IssueBaseInfoPo baseInfoPo,MultipartFile file){
		System.out.println(baseInfoPo.getProjectName());
		Map<String, Object> map = new HashMap<>();
		try {
			map.put("rows",defectListService.modification(baseInfoPo,file));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 查看任务详情信息
	 * @return
	 */
	@RequestMapping("/examine.json")
	public Map<String, Object> examine(IssueBaseInfoPo issueId){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.examine(issueId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 操作删除
	 */
	@RequestMapping("/removeForbidden")
	public Map<String,Object> removeForbidden(IssueBaseInfoPo issueId){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.removeForbidden(issueId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 新增缺陷编号非重复验证
	 */
	@RequestMapping("/notRepeat")
	public Map<String,Object> notRepeat(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.notRepeat(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 加载新增和修改任务中项目下拉列表
	 */
	@RequestMapping("/getProject")
	public Map<String,Object> getProject(){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.getProject();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 查询项目
	 */
	@RequestMapping("/getProjectOne")
	public Map<String,Object> getProjectOne(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.getProjectOne(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 查询状态
	 */
	@RequestMapping("/getState")
	public Map<String,Object> getState(){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.getState();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 加载新增和修改任务中缺陷下拉列表
	 */
	@RequestMapping("/drawback")
	public Map<String,Object> drawback(){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.drawback();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 查询缺陷
	 */
	@RequestMapping("/drawbackOne")
	public Map<String,Object> drawbackOne(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.drawbackOne(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 判断是否为创建者本人操作
	 */
	@RequestMapping("/removeForbiddenOne")
	public Map<String,Object> removeForbiddenOne(IssueBaseInfoPo issueId){
		Map<String, Object> map = new HashMap<>();
		try {
			map = defectListService.removeForbiddenOne(issueId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	
}