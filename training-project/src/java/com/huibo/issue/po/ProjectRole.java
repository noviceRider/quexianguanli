package com.huibo.issue.po;

import com.bn.javax.po.BasePo;

/**
* <p>Title: 缺陷管理 - ProjectRole </p>
*
* <p>Description:项目角色的实体类PO</p>
*
* <p>Copyright: Copyright HBRC(c) 2018</p>
*
* <p>Company: 汇博人才</p>
*
* @author 王杰  
* @version 1.0
*/
public class ProjectRole extends BasePo {

	/**
	 * 角色编号
	 */
	private String roleCode;
	
	/**
	 * 角色名称
	 */
	private String roleName;
	
	/**
	 * 当前状态
	 */
	private String moduleState;
	
	/**
	 * 创建人
	 */
	private String createBy;
	
	/**
	 * 创建时间
	 */
	private String createTime;
	
	/**
	 * 修改人
	 */
	private String modifyBy;
	
	/**
	 * 修改时间
	 */
	private String modifyTime;

	/**
	 * 状态描述
	 */
	private String stateDesc;
	
	/**
	 * 状态编号
	 */
	private String stateCode;
	
	/**
	 * 缺陷状态表
	 */
	private String roleStateRel;

	public ProjectRole() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ProjectRole(String roleCode, String roleName, String moduleState, String createBy, String createTime,
			String modifyBy, String modifyTime, String stateDesc, String stateCode, String roleStateRel) {
		super();
		this.roleCode = roleCode;
		this.roleName = roleName;
		this.moduleState = moduleState;
		this.createBy = createBy;
		this.createTime = createTime;
		this.modifyBy = modifyBy;
		this.modifyTime = modifyTime;
		this.stateDesc = stateDesc;
		this.stateCode = stateCode;
		this.roleStateRel = roleStateRel;
	}

	@Override
	public String toString() {
		return "ProjectRole [roleCode=" + roleCode + ", roleName=" + roleName + ", moduleState=" + moduleState
				+ ", createBy=" + createBy + ", createTime=" + createTime + ", modifyBy=" + modifyBy + ", modifyTime="
				+ modifyTime + ", stateDesc=" + stateDesc + ", stateCode=" + stateCode + ", roleStateRel="
				+ roleStateRel + "]";
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getModuleState() {
		return moduleState;
	}

	public void setModuleState(String moduleState) {
		this.moduleState = moduleState;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getModifyBy() {
		return modifyBy;
	}

	public void setModifyBy(String modifyBy) {
		this.modifyBy = modifyBy;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	public String getStateDesc() {
		return stateDesc;
	}

	public void setStateDesc(String stateDesc) {
		this.stateDesc = stateDesc;
	}

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public String getRoleStateRel() {
		return roleStateRel;
	}

	public void setRoleStateRel(String roleStateRel) {
		this.roleStateRel = roleStateRel;
	}

}
