package com.huibo.issue.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.MemberBo;
import com.huibo.issue.bo.UserBo;
import com.huibo.issue.dao.MemberDao;
import com.huibo.issue.po.MemberPo;
import com.huibo.issue.po.UserPo;

/**
 * <p>title:缺陷管理系统-MemberService</p>
 * 
 * <p>Description:缺陷成员管理的Service</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
@Service
public class MemberService {
	
	@Autowired
	private MemberDao memberDao ;

	/**
	 * 	查询所有的成员
	 * @param bo
	 * @return
	 */
	public List<MemberPo> getMember(MemberBo bo){
		return memberDao.getMember(bo);
	}
	
	/**
	 * 	查询该项目下还可增的角色
	 * @param po
	 * @return
	 */
	public List<MemberPo> getRole(MemberBo bo) {
		return memberDao.getRole(bo);
	}
	
	/**
	 * 	查询所有项目，角色下所有可选的角色
	 */
	public Map<String,Object> getUser(UserBo bo) {
		Map<String,Object>map = new HashMap<String, Object>();
		Page page = new Page(bo);
		List<UserPo> list = memberDao.getUser(page);
		map.put("rows", list);
		map.put("total", page.getTotalRecord());
		return map;
	}

	/**
	 * 	添加角色
	 * @param po
	 * @return
	 */
	public Integer addRole(MemberBo bo) {
		String[] arr = bo.getUserIds().split(",");
		bo.setUsIds(arr);
		Integer row = memberDao.addRole(bo);
		return row;
	}

	/**
	 * 删除角色
	 * @param delIds
	 * @return
	 */
	public Integer removeRole(String[] delIds) {
		return memberDao.removeRole(delIds);
	}
	
	/**
	 * 根据角色编号，项目查可选的员工
	 * @param bo
	 * @return
	 */
	public List<UserPo> getMemberUser(UserBo bo) {
		List<UserPo> list = memberDao.getMemberUser(bo);
		return list;
	}

	/**
	 * 根据角色编号，项目查所有的员工
	 * @param bo
	 * @return
	 */
	public List<UserPo> getUserByRoleCode(UserBo bo) {
		List<UserPo> list = memberDao.getUserByRoleCode(bo);
		return list;
	}
	
	/**
	 * 删除员工
	 * @param bo
	 * @return
	 */
	public Integer deleteMemberUser(UserBo bo) {
		String[] arr = bo.getUserIds().split(",");
		bo.setUsIds(arr);
		return memberDao.deleteMemberUser(bo);
	}
}