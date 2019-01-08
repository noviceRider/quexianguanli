package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bn.javax.dao.Page;
import com.bsst.ezwork.javax.util.General;
import com.huibo.issue.bo.IssueTypeBo;
import com.huibo.issue.bo.UserManagementBo;
import com.huibo.issue.po.UserDeptPo;
import com.huibo.issue.po.UserManagementPo;
import com.huibo.issue.po.UserRolePo;
import com.huibo.issue.po.UserSexPo;
import com.huibo.issue.service.DefectClassificationService;
import com.huibo.issue.service.UserManagementService;
/**
* <p>Title: 缺陷跟踪管理系统 - BusinesslogicService</p>
*
* <p>Description:用户管理的控制层</p>
*
* <p>Copyright: Copyright hbkj(c) 2018</p>
*
* <p>Company: 重庆汇博科技股份有限公司</p>
*
* @author 揭振宇
* @version 1.0
*/
@Controller
public class UserManagementController {
		
	/**
	* 注入一个业务层对象
	* 实际的操作都放在业务层封装好的方法里面
	* 控制器处理对应请求分发业务处理控制器
	*/	
	@Autowired
	private UserManagementService userManagementService;
	
				/**
				 * 页面加载的请求你：查询所有的表格数据并且组装成一个list集合在放入map集合发送给前端等待加载
				 * @param userManagementBo
				 * @return
				 */
				@RequestMapping("/UserManager.json")
				public Map<String,Object> getAllUsers(UserManagementBo userManagementBo) {
					Map<String, Object> result = null;
					try {
						Page page = new Page(userManagementBo);
						result = new HashMap<String,Object>();
						result.put("rows", userManagementService.getAllUsers(page));
						result.put("total", page.getTotalRecord());
					} catch (Exception e) {
						e.printStackTrace();
					}
					return result;		
				}
				
				/**
				 * 根据传过来的编号来条件查询然后返回前端显示修改的数据
				 * @param bo
				 * @return
				 */
				@RequestMapping("/showUser.json")
				public Map<String,Object> showUser(UserManagementBo bo){
					Map<String, Object> result = null;
					try {
						result = new HashMap<String,Object>();
						UserManagementPo  po = userManagementService.getUserById(bo);
						result.put("result",po);
					} catch (Exception e) {
						e.printStackTrace();
					}
					return result;
				}
	
				/**
				 * 查询部门表，得到部门信息加载进前端的下拉框里面
				 * @return
				 */
				@RequestMapping("/searchDept.json")
				public  Map<String,Object> searchDept(){
					Map<String, Object> result = null;
					try {
						result = new HashMap<String,Object>();
						result.put("result", userManagementService.searchDept());
					} catch (Exception e) {
						e.printStackTrace();
					}
					return result;
				}
				
				/**
				 * 查询性别表，加载进前端的下拉框
				 * @return
				 */
				@RequestMapping("/searchSex.json")
				public  Map<String,Object> searchSex(){
					Map<String, Object> result = null;
					try {
						result = new HashMap<String,Object>();
						result.put("result", userManagementService.searchSex());
					} catch (Exception e) {
						e.printStackTrace();
					}
					return result;
				}
				
				/**
				 * 查询角色表，加载进前端下拉框
				 * @return
				 */
				@RequestMapping("/searchRole.json")
				public  Map<String,Object> searchRole(){
					Map<String, Object> result = null;
					try {
						result = new HashMap<String,Object>();
						result.put("result", userManagementService.searchRole());
					} catch (Exception e) {
						e.printStackTrace();
					}
					return result;
				}
				
				/**
				 * 表单验证，验证是否重复
				 * @param bo
				 * @return
				 */
				@RequestMapping("/zvalidateState.json")
				public  Map<String, Object> validatePriorityCode(UserManagementBo bo){
					System.out.println("bo:"+bo);
					int code = 0 ;
					Map<String,Object> map = new HashMap<String,Object>();
					Integer count = userManagementService.validatePriorityCode(bo);
					if(count == 0) {
						code = 1;
					}
					map.put("resultCode", code);
					return map;
				}

				
/************************************分割线以上是查询语句控制器以下是操作语句控制器****************************************/
				
				
			/**
			 * 根据唯一字段：用户编号来删除用户
			 * @param delIds
			 * @return
			 */
			@RequestMapping("/DelUserByCode.json")
			public Map<String,Object> delUserType(@RequestParam("delIds[]") String[] delIds) {
				Map<String, Object> result = null;
				try {
					result = new HashMap<String,Object>();
					result.put("result", userManagementService.delUserType(delIds));
				} catch (Exception e) {
					e.printStackTrace();
				}
				return result;//返回IssueTypePo对象		
			}
			
			/**
			 * 提交增加的数据，并且在数据库中添加一条记录
			 * @param bo
			 * @return
			 */
			@RequestMapping("/addUser.json")
			public Map<String,Object> addUser(UserManagementBo bo){
				bo.setPassword(General.getEncryptString(bo.getPassword()));
				System.out.println(General.getEncryptString(bo.getPassword()));
				Map<String, Object> result = null;
				try {
					System.out.println(bo);
					result = new HashMap<String,Object>();
					result.put("result",userManagementService.addUser(bo));
					System.out.println(result);
				} catch (Exception e) {
					e.printStackTrace();
				}
				return result;
			}
			
			/**
			 * 把后台修改的数据提交并且重新更新数据库
			 * @param bo
			 * @return
			 */
			@RequestMapping("/modifyUser.json")
			public Map<String,Object> modifyUser(UserManagementBo bo){
				bo.setPassword(General.getEncryptString(bo.getPassword()));
				System.out.println(bo.getDeptId());
				Map<String, Object> result = null;
				try {
					System.out.println(bo);
					result = new HashMap<String,Object>();			
					result.put("result",userManagementService.modifyUser(bo));
				} catch (Exception e) {
					e.printStackTrace();
				}
				return result;
			}
}