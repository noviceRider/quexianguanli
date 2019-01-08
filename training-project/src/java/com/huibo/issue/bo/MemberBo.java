package com.huibo.issue.bo;

import java.util.Arrays;

import com.huibo.issue.po.MemberPo;
/**
 * <p>title:缺陷管理系统-MemberBo</p>
 * 
 * <p>Description:成员管理的bo</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public class MemberBo extends MemberPo {

	
	
	/**
	 * 	项目编号
	 */
	private String pId ;


	/**
	 * 
	 */
	private String userIds ;

	/**
	 * 
	 * @return
	 */
	private String roleCode ;
	
	/**
	 * 
	 * @return
	 */
	
	public String[] usIds ;

	public String getpId() {
		return pId;
	}

	public void setpId(String pId) {
		this.pId = pId;
	}

	public String getUserIds() {
		return userIds;
	}

	public void setUserIds(String userIds) {
		this.userIds = userIds;
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String[] getUsIds() {
		return usIds;
	}

	public void setUsIds(String[] usIds) {
		this.usIds = usIds;
	}

	@Override
	public String toString() {
		return "MemberBo [pId=" + pId + ", userIds=" + userIds + ", roleCode=" + roleCode + ", usIds="
				+ Arrays.toString(usIds) + "]";
	}
	
}
