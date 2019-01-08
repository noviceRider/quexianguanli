package com.huibo.issue.dao;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.IssueBaseInfoBo;
import com.huibo.issue.po.IssueAttachPo;
import com.huibo.issue.po.IssueBaseInfoPo;
/**
* <p>Title: 缺陷管理系统 - DefectListDao</p>
*
* <p>Description:缺陷列表的Dao层</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

public interface DefectListDao {
	//加载数据
	List<IssueBaseInfoPo> getDefectList(IssueBaseInfoBo issueBaseInfoBo);
	
	//增加新增任务
	public Integer addPostAssignment(IssueBaseInfoPo baseInfoPo);
	
	//查看任务详情信息
	public List<IssueBaseInfoPo> examine(IssueBaseInfoPo issueId);
	
	//操作删除
	public Integer removeForbidden(IssueBaseInfoPo issueId);
	
	//搜索
	public List<IssueBaseInfoPo> getDefectListOne(Page page);
	
	//新增附件
	public void addIssueAttachPo(IssueAttachPo issueAttachPo);
	//修改附件
	public void modIssueAttachPo(IssueAttachPo issueAttachPo);
	
	//修改
	public Integer modification(IssueBaseInfoPo baseInfoPo);
	
	//删除附件
	public Integer delIssueAttachPo(IssueBaseInfoPo baseInfoPo);
	
	//新增缺陷编号非重复验证
	public Integer notRepeat(IssueBaseInfoPo po);
	
	//加载新增和修改任务中项目下拉列表
	public List<String> getProject();
	
	//查询状态
	public List<String> getState();
	
	//加载新增和修改任务中缺陷下拉列表
	public List<String> drawback();
	
	//判断是否为创建人本人的操作
	public Integer removeForbiddenOne(IssueBaseInfoPo issueId);
	
	//查询项目
	public List<IssueBaseInfoPo> getProjectOne(Page page);
	
	//查询缺陷
	public List<IssueBaseInfoPo> drawbackOne(Page page);
	
	//新增和修改任务中的查询项目中的查询
	public List<IssueBaseInfoPo> queryProject(Page page);
	
	//新增和修改任务中的查询缺陷中的查询
	public List<IssueBaseInfoPo> queryDefect(Page page);
}
