package com.huibo.issue.po;

import java.util.List;

import com.bn.javax.po.BasePo;
/**
 * <p>title:缺陷管理系统-IssueBaseInfoPo</p>
 * 
 * <p>Description:缺陷基本信息的po</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 彭忠义
 * @version 1.0
 */
public class IssueBaseInfoPo extends BasePo {
	
	/**
	 * 缺陷序号
	 */
	private	Integer	   issueId;
	
	/**
	 * 项目编号
	 */
	private	String	   projectId;
	
	/**
	 * 项目名称
	 */
	private	String	   projectName;
	
	/**
	 * 上级缺陷编号
	 */
	private	Integer	   parentIssueId;
	
	/**
	 * 上级缺陷名称
	 */
	private	String	   parentIssueName;
	
	/**
	 * 缺陷名称
	 */
	private	String	   issueName;
	
	/**
	 * 缺陷分类名称
	 */
	private String     typeDesc;
	/**
	 * 缺陷描述
	 */
	private	String	   issueDesc;
	
	/**
	 * 指派人编号
	 */
	private	String	   assignee;
	
	/**
	 * 指派人名字
	 */
	private String 	   assigneeName;
	
	/**
	 * 缺陷分类
	 */
	private	String	   issueType;
	
	/**
	 * 严重程度
	 */
	private	String	   issueSeverityName;
	
	/**
	 * 严重程度编号
	 */
	private String 	   issueSeverity;
	
	/**
	 * 优先级
	 */
	private	String	   issuePriorityName;
	
	/**
	 * 优先级编号
	 */
	private	String	   issuePriority;
	
	/**
	 * 预计开始日期
	 */
	private	String	   planStartTime;
	
	/**
	 * 预计结束日期
	 */
	private	String	   planEndTime;
	
	/**
	 * 实际开始时间
	 */
	private	String	   actStartTime;
	
	/**
	 * 实际结束时间
	 */
	private	String	   actEndTime;
	
	/**
	 * 预计工时数
	 */
	private	Double	   planWorkHours;
	
	/**
	 * 实际工时数
	 */
	private	Double	   actWorkHours;
	
	/**
	 * 分配时间
	 */
	private	String	   assignedTime;
	
	/**
	 * 完成要求
	 */
	private	String	   doneCondition;
	
	/**
	 * 完成百分比
	 */
	private	Float	   doneRatio;
	
	/**
	 * 缺陷状态
	 */
	private	String	   issueState;
	
	/**
	 * 缺陷状态名称
	 */
	private	String	   issueStateName;
	
	/**
	 * 创建编号
	 */
	private	String	   createBy;
	
	/**
	 * 创建人名字
	 */
	private String 	   createByName;
	
	/**
	 * 创建时间
	 */
	private	String	   createTime;
	
	/**
	 * 修改人
	 */
	private	String	   modifyBy;
	
	/**
	 * 修改时间
	 */
	private	String	   modifyTime;
	
	/**
	 * 自定义子节点
	 * @return
	 */
	private List<IssueBaseInfoPo> children;
	
	/**
	 * 资源表文件名
	 * @return
	 */
	private Integer attachId;
	
	/**
	 * 角色
	 * @return
	 */
	private String currentLoggedInUser;
	
	/**
	 * 评论内容
	 * @return
	 */
	private String comment;
	
	/**
	 * 技术
	 * @return
	 */
	private Integer count;
	
	/**
	 * 统计工时
	 * @return
	 */
	private Double countWork;
	
	/**
	 * 搜索登记时间1
	 * @return
	 */
	public String startTime;
	
	/**
	 * 搜索登记时间2
	 * @return
	 */
	public String endTime;
	
	/**
	 * 页面登记时间
	 */
	public String workTime;
	
	public List<IssueBaseInfoPo> getChildren() {
		return children;
	}
	public void setChildren(List<IssueBaseInfoPo> children) {
		this.children = children;
	}
	public Integer getIssueId() {
		return issueId;
	}
	public void setIssueId(Integer issueId) {
		this.issueId = issueId;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public Integer getParentIssueId() {
		return parentIssueId;
	}
	public void setParentIssueId(Integer parentIssueId) {
		this.parentIssueId = parentIssueId;
	}
	public String getIssueName() {
		return issueName;
	}
	public void setIssueName(String issueName) {
		this.issueName = issueName;
	}
	public String getIssueDesc() {
		return issueDesc;
	}
	public void setIssueDesc(String issueDesc) {
		this.issueDesc = issueDesc;
	}
	public String getAssignee() {
		return assignee;
	}
	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}
	public String getIssueType() {
		return issueType;
	}
	public void setIssueType(String issueType) {
		this.issueType = issueType;
	}
	public String getIssueSeverity() {
		return issueSeverity;
	}
	public void setIssueSeverity(String issueSeverity) {
		this.issueSeverity = issueSeverity;
	}
	public String getIssuePriority() {
		return issuePriority;
	}
	public void setIssuePriority(String issuePriority) {
		this.issuePriority = issuePriority;
	}
	public String getPlanStartTime() {
		return planStartTime;
	}
	public void setPlanStartTime(String planStartTime) {
		this.planStartTime = planStartTime;
	}
	public String getPlanEndTime() {
		return planEndTime;
	}
	public void setPlanEndTime(String planEndTime) {
		this.planEndTime = planEndTime;
	}
	public String getActStartTime() {
		return actStartTime;
	}
	public void setActStartTime(String actStartTime) {
		this.actStartTime = actStartTime;
	}
	public String getActEndTime() {
		return actEndTime;
	}
	public void setActEndTime(String actEndTime) {
		this.actEndTime = actEndTime;
	}
	public Double getPlanWorkHours() {
		return planWorkHours;
	}
	public void setPlanWorkHours(Double planWorkHours) {
		this.planWorkHours = planWorkHours;
	}
	public Double getActWorkHours() {
		return actWorkHours;
	}
	public void setActWorkHours(Double actWorkHours) {
		this.actWorkHours = actWorkHours;
	}
	public String getAssignedTime() {
		return assignedTime;
	}
	public void setAssignedTime(String assignedTime) {
		this.assignedTime = assignedTime;
	}
	public String getDoneCondition() {
		return doneCondition;
	}
	public void setDoneCondition(String doneCondition) {
		this.doneCondition = doneCondition;
	}
	public Float getDoneRatio() {
		return doneRatio;
	}
	public void setDoneRatio(Float doneRatio) {
		this.doneRatio = doneRatio;
	}
	public String getIssueState() {
		return issueState;
	}
	public void setIssueState(String issueState) {
		this.issueState = issueState;
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
	
	public String getTypeDesc() {
		return typeDesc;
	}
	public void setTypeDesc(String typeDesc) {
		this.typeDesc = typeDesc;
	}
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	
	public String getIssueStateName() {
		return issueStateName;
	}
	public void setIssueStateName(String issueStateName) {
		this.issueStateName = issueStateName;
	}
	public String getIssueSeverityName() {
		return issueSeverityName;
	}
	public void setIssueSeverityName(String issueSeverityName) {
		this.issueSeverityName = issueSeverityName;
	}
	public String getIssuePriorityName() {
		return issuePriorityName;
	}
	public void setIssuePriorityName(String issuePriorityName) {
		this.issuePriorityName = issuePriorityName;
	}
	
	
	public String getCurrentLoggedInUser() {
		return currentLoggedInUser;
	}
	public void setCurrentLoggedInUser(String currentLoggedInUser) {
		this.currentLoggedInUser = currentLoggedInUser;
	}
	
	public String getAssigneeName() {
		return assigneeName;
	}
	public void setAssigneeName(String assigneeName) {
		this.assigneeName = assigneeName;
	}
	public String getCreateByName() {
		return createByName;
	}
	public void setCreateByName(String createByName) {
		this.createByName = createByName;
	}
	public Integer getAttachId() {
		return attachId;
	}
	public void setAttachId(Integer attachId) {
		this.attachId = attachId;
	}
	
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	
	public String getParentIssueName() {
		return parentIssueName;
	}
	public void setParentIssueName(String parentIssueName) {
		this.parentIssueName = parentIssueName;
	}
	
	public Double getCountWork() {
		return countWork;
	}
	public void setCountWork(Double countWork) {
		this.countWork = countWork;
	}
	
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getWorkTime() {
		return workTime;
	}
	public void setWorkTime(String workTime) {
		this.workTime = workTime;
	}
	@Override
	public String toString() {
		return "IssueBaseInfoPo [issueId=" + issueId + ", projectId=" + projectId + ", projectName=" + projectName
				+ ", parentIssueId=" + parentIssueId + ", issueName=" + issueName + ", typeDesc=" + typeDesc
				+ ", issueDesc=" + issueDesc + ", assignee=" + assignee + ", assigneeName=" + assigneeName
				+ ", issueType=" + issueType + ", issueSeverityName=" + issueSeverityName + ", issueSeverity="
				+ issueSeverity + ", issuePriorityName=" + issuePriorityName + ", issuePriority=" + issuePriority
				+ ", planStartTime=" + planStartTime + ", planEndTime=" + planEndTime + ", actStartTime=" + actStartTime
				+ ", actEndTime=" + actEndTime + ", planWorkHours=" + planWorkHours + ", actWorkHours=" + actWorkHours
				+ ", assignedTime=" + assignedTime + ", doneCondition=" + doneCondition + ", doneRatio=" + doneRatio
				+ ", issueState=" + issueState + ", issueStateName=" + issueStateName + ", createBy=" + createBy
				+ ", createByName=" + createByName + ", createTime=" + createTime + ", modifyBy=" + modifyBy
				+ ", modifyTime=" + modifyTime + ", children=" + children + ", attachId=" + attachId
				+ ", currentLoggedInUser=" + currentLoggedInUser + "]";
	}
	
	
	
	
	
}
