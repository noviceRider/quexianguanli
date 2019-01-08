package com.huibo.issue.po;

import com.bn.javax.po.BasePo;
/**
 * <p>title:缺陷管理系统-IssueAttachPo</p>
 * 
 * <p>Description:附件的po</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 彭忠义
 * @version 1.0
 */
public class IssueAttachPo extends BasePo {
	/**
	 * 	附件序号
	 */
	private Integer attachId ;
	
	/**
	 * 	附件描述
	 */
	private String attachDesc ;
	
	/**
	 * 	缺陷序号
	 */
	private Integer issueId ;
	
	/**
	 * 	文件名
	 */
	private String attachFile ;
	
	/**
	 * 	文件大小
	 */
	private String fileSize ;
	
	/**
	 * 	文件类型
	 */
	private String mimeType ;
	
	/**
	 * 	是否图片
	 */
	private String isPic ;
	
	/**
	 * 	当前状态
	 */
	private String logState ;
	
	/**
	 * 	创建人
	 */
	private String createBy ;
	
	/**
	 * 	创建时间
	 */
	private String createTime ;
	
	/**
	 * 	修改人
	 */
	private String modifyBy ;
	
	/**
	 * 	修改时间
	 */
	private String modifyTime ;

	public Integer getAttachId() {
		return attachId;
	}

	public void setAttachId(Integer attachId) {
		this.attachId = attachId;
	}

	public String getAttachDesc() {
		return attachDesc;
	}

	public void setAttachDesc(String attachDesc) {
		this.attachDesc = attachDesc;
	}

	public Integer getIssueId() {
		return issueId;
	}

	public void setIssueId(Integer issueId) {
		this.issueId = issueId;
	}

	public String getAttachFile() {
		return attachFile;
	}

	public void setAttachFile(String attachFile) {
		this.attachFile = attachFile;
	}

	public String getFileSize() {
		return fileSize;
	}

	public void setFileSize(String fileSize) {
		this.fileSize = fileSize;
	}

	public String getMimeType() {
		return mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public String getIsPic() {
		return isPic;
	}

	public void setIsPic(String isPic) {
		this.isPic = isPic;
	}

	public String getLogState() {
		return logState;
	}

	public void setLogState(String logState) {
		this.logState = logState;
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

	@Override
	public String toString() {
		return "IssueAttachPo [attachId=" + attachId + ", attachDesc=" + attachDesc + ", issueId=" + issueId
				+ ", attachFile=" + attachFile + ", fileSize=" + fileSize + ", mimeType=" + mimeType + ", isPic="
				+ isPic + ", logState=" + logState + ", createBy=" + createBy + ", createTime=" + createTime
				+ ", modifyBy=" + modifyBy + ", modifyTime=" + modifyTime + "]";
	}
	
	
}
