package com.huibo.issue.dao;

import java.util.List;


import com.bn.javax.dao.Page;
import com.huibo.issue.po.IssueTypePo;

/**
* <p>Title: 缺陷跟踪管理系统 - BusinesslogicService</p>
*
* <p>Description:持久层管理的接口</p>
*
* <p>Copyright: Copyright hbkj(c) 2018</p>
*
* <p>Company: 重庆汇博科技股份有限公司</p>
*
* @author 揭振宇
* @version 1.0
*/
public interface DefectClassificationDao {
	//调用业务层方法加载数据
	public List<IssueTypePo> getIssueType(Page page);

	public Integer getCount(Page page);

	//调用业务层方法删除
	public Integer delIssueType(String[] delIds);

	//调用业务层方法增加
	public Integer addIssueType(IssueTypePo issueTypePo);

	//调用业务方法加载要修改的数据
	public IssueTypePo searchIssueForModify(String typeCode);

	//调用业务方法修改数据
	public Integer modifyIssueClassification(IssueTypePo issueTypePo);
	public Integer modifyDictDesc(IssueTypePo issueTypePo);

	//表单验证
	public Integer validatePriorityCode(IssueTypePo po);
}
