package com.huibo.issue.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.frame.util.CommonFunction;
import com.bn.javax.dao.Page;
import com.huibo.issue.dao.HandleDao;
import com.huibo.issue.po.IssueAttachPo;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssueWorkLogPo;
/**
* <p>Title: 缺陷管理系统 - HandleService</p>
*
* <p>Description:缺陷处理的Service</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
@Service
public class HandleService {
	@Autowired
	private HandleDao handleDao;

	/**
	 * 加载数据网格
	 */
	public Map<String, Object> loadHandle(IssueBaseInfoPo po) {
		po.setCurrentLoggedInUser(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(po);
		List<IssueBaseInfoPo> list = handleDao.loadHandle(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		System.out.println(map);
		return map;
	}

	/**
	 * 搜索处理界面需要的数据
	 */
	public Map<String, Object> dealWith(IssueBaseInfoPo po) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rows", handleDao.dealWith(po));
		return map;
	}

	/**
	 * 处理界面保存
	 */
	public Integer handleOfPreservation(IssueWorkLogPo po) {
		po.setCreateBy(CommonFunction.getUserFromSession().getUserId());		//注入创建人
		po.setModifyBy(CommonFunction.getUserFromSession().getUserId());		//注入修改人
		handleDao.handleOfPreservation(po);		//新增工时记录
		return handleDao.modifyHandleOfPreservation(po);	//修改状态
	}

	/**
	 * 加载附件信息
	 */
	public List<IssueAttachPo> queryAccessory(IssueAttachPo po) {
		return handleDao.queryAccessory(po);
	}
}