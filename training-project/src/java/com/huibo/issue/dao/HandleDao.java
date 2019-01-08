package com.huibo.issue.dao;

import java.util.List;
import java.util.Map;

import com.bn.javax.dao.Page;
import com.huibo.issue.po.IssueAttachPo;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssueWorkLogPo;
/**
* <p>Title: 缺陷管理系统 - HandleDao</p>
*
* <p>Description:缺陷处理的Dao层</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
public interface HandleDao {
	//加载数据网格
	public List<IssueBaseInfoPo> loadHandle(Page page);
	
	//搜索处理界面需要的数据
	public List<IssueBaseInfoPo> dealWith(IssueBaseInfoPo po);
	
	//新增工时记录
	public Integer handleOfPreservation(IssueWorkLogPo po);
	
	//修改状态
	public Integer modifyHandleOfPreservation(IssueWorkLogPo po);
	
	//加载附件信息
	public List<IssueAttachPo> queryAccessory(IssueAttachPo po);	
}
