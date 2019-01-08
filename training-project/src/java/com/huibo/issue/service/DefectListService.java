package com.huibo.issue.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bn.frame.util.CommonFunction;
import com.bn.javax.dao.Page;
import com.huibo.issue.bo.IssueBaseInfoBo;
import com.huibo.issue.dao.DefectListDao;
import com.huibo.issue.po.ProjectManagementPo;
import com.huibo.issue.po.IssueAttachPo;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssuePriorityPo;
/**
* <p>Title: 缺陷管理系统 - DefectListService</p>
*
* <p>Description:缺陷列表的Service</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
@Service
public class DefectListService {

	@Autowired
	private DefectListDao defectListDao;
	/**
	 * 加载数据网格
	 * @return
	 */
	public Map<String, Object> getDefectList(IssueBaseInfoBo IssueBaseInfoBo) {
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(IssueBaseInfoBo);
		map.put("rows", defectListDao.getDefectList(IssueBaseInfoBo));
		map.put("total",page.getTotalRecord());
		return map;
	}
	/**
	 * 查看详情
	 * @param issueId
	 * @return
	 */
	public Map<String, Object> examine(IssueBaseInfoPo issueId) {
		issueId.setCreateBy(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rows", defectListDao.examine(issueId));
		return map;
	}
	
	/**
	 * 操作删除
	 * @param issueId
	 * @return
	 */
	public Map<String,Object> removeForbidden(IssueBaseInfoPo issueId) {
		issueId.setCreateBy(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		return new HashMap<String,Object>() {
			{
				put("rows",defectListDao.removeForbidden(issueId));
			}
		};
	}
	
	/**
	 * 搜索
	 * @param issueBaseInfoBo
	 * @return
	 */
	public Map<String, Object> getDefectListOne(IssueBaseInfoPo issueBaseInfoBo) {
		issueBaseInfoBo.setCurrentLoggedInUser(CommonFunction.getUserFromSession().getUserId());
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(issueBaseInfoBo);
		List<IssueBaseInfoPo> list = defectListDao.getDefectListOne(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		return map;
	}
	
	/**
	 * 增加新增任务
	 * @param baseInfoPo
	 * @return
	 */
	public Integer addPostAssignment(IssueBaseInfoPo baseInfoPo,MultipartFile file) {
		baseInfoPo.setCreateBy(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		baseInfoPo.setModifyBy(CommonFunction.getUserFromSession().getUserId());	//注入修改人
		baseInfoPo.setIssueState("1001");		//注入状态：新建
		
		if(file != null && file.getSize() > 0) {
			IssueAttachPo issueAttachPo = new IssueAttachPo();
			issueAttachPo.setAttachId(baseInfoPo.getIssueId());		//注入附件序号
			issueAttachPo.setAttachFile(file.getOriginalFilename());		//注入附件文件名
			issueAttachPo.setIssueId(baseInfoPo.getIssueId());		//注入附件缺陷序号
			issueAttachPo.setCreateBy(CommonFunction.getUserFromSession().getUserId());		//注入附件创建人
			issueAttachPo.setModifyBy(CommonFunction.getUserFromSession().getUserId());		//注入附件修改人
			issueAttachPo.setFileSize(String.valueOf(file.getSize()));		//注入附件大小
			issueAttachPo.setMimeType(file.getContentType());		//注入附件类型
			
			String ifImg = file.getOriginalFilename();
			int indexOf = ifImg.indexOf(".");
			String picture = ifImg.substring(indexOf+1,ifImg.length());		//从附件文件名中提取文件的类型
			if(picture.equals("jpg") || picture.equals("png")) {		//判断文件类型是否为图片，如果是就注入1，否则注入0
				issueAttachPo.setIsPic("1");
			}else {
				issueAttachPo.setIsPic("0");
			}
			defectListDao.addIssueAttachPo(issueAttachPo);
			try {
				file.transferTo(new File("d://upload//resource2//"+issueAttachPo.getIssueId()+issueAttachPo.getAttachFile()));
			} catch (IllegalStateException e) {
				
				e.printStackTrace();
			} catch (IOException e) {
				
				e.printStackTrace();
			}
		}
		return defectListDao.addPostAssignment(baseInfoPo);	
	}
	
	/**
	 * 修改
	 * @param baseInfoPo
	 * @param file
	 * @return
	 */
	public Object modification(IssueBaseInfoPo baseInfoPo, MultipartFile file) {
		baseInfoPo.setModifyBy(CommonFunction.getUserFromSession().getUserId());	//注入修改人
		baseInfoPo.setIssueState("1001");		//注入状态：新建
		if(file != null && file.getSize()>0) {
			defectListDao.delIssueAttachPo(baseInfoPo);		//删除附件
			IssueAttachPo issueAttachPo = new IssueAttachPo();
			issueAttachPo.setAttachId(baseInfoPo.getIssueId());		//注入附件序号
			issueAttachPo.setAttachFile(file.getOriginalFilename());		//注入附件文件名
			issueAttachPo.setIssueId(baseInfoPo.getIssueId());		//注入附件缺陷序号
			issueAttachPo.setCreateBy(CommonFunction.getUserFromSession().getUserId());		//注入附件创建人
			issueAttachPo.setModifyBy(CommonFunction.getUserFromSession().getUserId());		//注入附件修改人
			issueAttachPo.setFileSize(String.valueOf(file.getSize()));		//注入附件大小
			issueAttachPo.setMimeType(file.getContentType());		//注入附件类型
			issueAttachPo.setCreateBy(CommonFunction.getUserFromSession().getUserId());	//注入创建人
			
			String ifImg = file.getOriginalFilename();
			int indexOf = ifImg.indexOf(".");
			String picture = ifImg.substring(indexOf+1,ifImg.length());		//从附件文件名中提取文件的类型
			if(picture.equals("jpg") || picture.equals("png")) {		//判断文件类型是否为图片，如果是就注入1，否则注入0
				issueAttachPo.setIsPic("1");
			}else {
				issueAttachPo.setIsPic("0");
			}
			defectListDao.addIssueAttachPo(issueAttachPo);
			try {
				file.transferTo(new File("d://upload//resource2//"+issueAttachPo.getIssueId()+issueAttachPo.getAttachFile()));
			} catch (IllegalStateException e) {
				
				e.printStackTrace();
			} catch (IOException e) {
				
				e.printStackTrace();
			}
			
		}
		return defectListDao.modification(baseInfoPo);
	}
	
	/**
	 * 新增缺陷编号非重复验证
	 */
	public Map<String, Object> notRepeat(IssueBaseInfoPo po) {
		int code = 0 ;
		Map<String,Object> map = new HashMap<String,Object>();
		Integer count = defectListDao.notRepeat(po);
		if(count == 0) {
			code = 1;
		}
		System.out.println("count:"+count);
		map.put("resultCode", code);
		return map;
	}
	/**
	 * 加载新增和修改任务中项目下拉列表
	 * @return
	 */
	public Map<String,Object> getProject() {
		return new HashMap<String,Object>(){
			{
				put("rows",defectListDao.getProject());
			}
		};
	}
	
	/**
	 * 查询状态
	 * @return
	 */
	public Map<String, Object> getState() {
		return new HashMap<String,Object>(){
			{
				put("rows",defectListDao.getState());
			}
		};
	}
	
	/**
	 * 加载新增和修改任务中缺陷下拉列表
	 * @return
	 */
	public Map<String, Object> drawback() {
		return new HashMap<String,Object>(){
			{
				put("rows",defectListDao.drawback());
			}
		};
	}
	
	/**
	 * 判断是否为创建者本人的操作
	 * @param issueId
	 * @return
	 */
	public Map<String,Object> removeForbiddenOne(IssueBaseInfoPo issueId) {
		issueId.setCurrentLoggedInUser(CommonFunction.getUserFromSession().getUserId());		//注入创建人
		Map<String,Object> map = new HashMap<String,Object>();
		Integer count = defectListDao.removeForbiddenOne(issueId);
		System.out.println(count);
		map.put("result", count);
		return map;
	}
	
	/**
	 * 查询项目
	 */
	public Map<String, Object> getProjectOne(IssueBaseInfoPo po) {
		Page page = new Page(po);
		return new HashMap<String,Object>(){
			{
				put("rows",defectListDao.getProjectOne(page));
				put("total",page.getTotalRecord());
			}
		};
	}
	
	/**
	 * 查询缺陷
	 */
	public Map<String, Object> drawbackOne(IssueBaseInfoPo po) {
		Page page = new Page(po);
		return new HashMap<String,Object>(){
			{
				put("rows",defectListDao.drawbackOne(page));
				put("total",page.getTotalRecord());
			}
		};
	}
	
	/**
	 * 新增和修改任务中的查询项目中的查询
	 */
	public Map<String, Object> queryProject(IssueBaseInfoPo issueBaseInfoBo) {
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(issueBaseInfoBo);
		List<IssueBaseInfoPo> list = defectListDao.queryProject(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		return map;
	}
	
	/**
	 * 新增和修改任务中的查询缺陷中的查询
	 */
	public Map<String, Object> queryDefect(IssueBaseInfoPo issueBaseInfoBo) {
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(issueBaseInfoBo);
		List<IssueBaseInfoPo> list = defectListDao.queryDefect(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		return map;
	}
}