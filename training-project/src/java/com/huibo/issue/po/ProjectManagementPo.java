package com.huibo.issue.po;

import java.util.List;

/**
 * <p>title:缺陷管理系统-ProjectManagementPo</p>
 * 
 * <p>Description:缺陷项目管理的Po</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public class ProjectManagementPo {
	
	/**
	 * 	项目编号
	 */
	private String projectId ;
	
	/**
	 * 	项目名称
	 */
	private String projectName ;
	
	/**
	 * 	项目简介
	 */
	private String projectIntro ;
	
	/**
	 * 	项目描述
	 */
	private String projectDsc ;
	
	/**
	 * 	上级项目编号
	 */
	private String topProjectId ;
	
	/**
	 * 	上级项目名称
	 */
	private String topProjectName ;
	
	/**
	 * 	当前状态
	 */
	private String projectState ;
	
	/**
	 * 	当前状态描述
	 */
	public String dictCode ;
	
	/**
	 * 	创建人编号
	 */
	private String createBy ;
	
	/**
	 * 	创建人姓名
	 */
	private String createByName ;
	
	/**
	 * 	创建时间
	 */
	private String createTime ;
	
	/**
	 * 	修改人编号
	 */
	private String modifyBy ;
	
	/**
	 * 	修改人姓名
	 */
	private String modifyByName ;
	
	/**
	 * 	修改时间
	 */
	private String modifyTime ;
	
	/**
	 * 	自定义子节点
	 */
	private List<ProjectManagementPo> children ;
	
	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectIntro() {
		return projectIntro;
	}

	public void setProjectIntro(String projectIntro) {
		this.projectIntro = projectIntro;
	}

	public String getProjectDsc() {
		return projectDsc;
	}

	public void setProjectDsc(String projectDsc) {
		this.projectDsc = projectDsc;
	}

	public String getTopProjectId() {
		return topProjectId;
	}

	public void setTopProjectId(String topProjectId) {
		this.topProjectId = topProjectId;
	}

	public String getTopProjectName() {
		return topProjectName;
	}

	public void setTopProjectName(String topProjectName) {
		this.topProjectName = topProjectName;
	}

	public String getProjectState() {
		return projectState;
	}

	public void setProjectState(String projectState) {
		this.projectState = projectState;
	}

	public String getDictCode() {
		return dictCode;
	}

	public void setDictCode(String dictCode) {
		this.dictCode = dictCode;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getCreateByName() {
		return createByName;
	}

	public void setCreateByName(String createByName) {
		this.createByName = createByName;
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

	public String getModifyByName() {
		return modifyByName;
	}

	public void setModifyByName(String modifyByName) {
		this.modifyByName = modifyByName;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	public List<ProjectManagementPo> getChildren() {
		return children;
	}

	public void setChildren(List<ProjectManagementPo> children) {
		this.children = children;
	}

	@Override
	public String toString() {
		return "ProjectManagementPo [projectId=" + projectId + ", projectName=" + projectName + ", projectIntro="
				+ projectIntro + ", projectDsc=" + projectDsc + ", topProjectId=" + topProjectId + ", topProjectName="
				+ topProjectName + ", projectState=" + projectState + ", dictCode=" + dictCode + ", createBy="
				+ createBy + ", createByName=" + createByName + ", createTime=" + createTime + ", modifyBy=" + modifyBy
				+ ", modifyByName=" + modifyByName + ", modifyTime=" + modifyTime + ", children=" + children
				+ ", getProjectId()=" + getProjectId() + ", getProjectName()=" + getProjectName()
				+ ", getProjectIntro()=" + getProjectIntro() + ", getProjectDsc()=" + getProjectDsc()
				+ ", getTopProjectId()=" + getTopProjectId() + ", getTopProjectName()=" + getTopProjectName()
				+ ", getProjectState()=" + getProjectState() + ", getDictCode()=" + getDictCode() + ", getCreateBy()="
				+ getCreateBy() + ", getCreateByName()=" + getCreateByName() + ", getCreateTime()=" + getCreateTime()
				+ ", getModifyBy()=" + getModifyBy() + ", getModifyByName()=" + getModifyByName() + ", getModifyTime()="
				+ getModifyTime() + ", getChildren()=" + getChildren() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + ", toString()=" + super.toString() + "]";
	}

	
	
}
