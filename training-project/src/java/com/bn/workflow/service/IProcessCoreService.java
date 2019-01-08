package com.bn.workflow.service;


import java.util.List;
import java.util.Map;

import org.activiti.engine.impl.pvm.process.ActivityImpl;

/**
* <p>Title: 工作流 - IProcessCoreService</p>
*
* <p>Description:工作流核心服务接口</p>
*
* <p>Copyright: Copyright BSST(c) 2017</p>
*
* <p>Company: 重庆商软冠联信息技术发展有限公司</p>
*
* @author william
* 
* @version 1.0
*/
public interface IProcessCoreService {
	/**
	 * 中止当前流程。根据任务ID查询当前流程中结束节点，完成当前任务节点，并跳转到结束节点
	 * @param taskId 当前任务编号
	 * @throws Exception
	 */
	public void endProcess(String taskId) throws Exception;
	
	/**  
     * 转办流程，实际上是改变当前任务节点的执行人  
     *   
     * @param taskId  
     *            当前任务节点ID  
     * @param userId  
     *            被转办人Id  
     */    
    public void transferAssignee(String taskId, String userId);
    
    /**  
     * 会签操作。根据要会签的人员名单，创建多个任务，指定负责人、流程实例编号、定义编号、将当前任务设置为父级任务  
     *   
     * @param taskId  
     *            当前任务ID  
     * @param userCodes  
     *            会签人账号集合  
     * @throws Exception  
     */    
    public void jointProcess(String taskId, List<String> userIds) throws Exception;
    
    /**  
     * 取回流程 ,如果没有指定节点id，抛出异常。如果当前任务有多个并行的任务，将会全部自动完成，然后跳转到指定节点
     * 取回流程不检查当前节点是否有会签子任务
     *   
     * @param taskId  
     *            当前任务ID  
     * @param activityId  
     *            取回节点ID  
     * @throws Exception  
     */    
    public void callBackProcess(String taskId, String activityId)  throws Exception;

    /**  
     * 驳回流程。驳回和取回不同的地方在于，驳回是将当前任务对应的会签子任务全部中止后再驳回到指定节点
     *   
     * @param taskId  
     *            当前任务ID  
     * @param activityId  
     *            驳回节点ID  
     * @param variables  
     *            流程存储参数  
     * @throws Exception  
     */    
    public void backProcess(String taskId, String activityId, Map<String, Object> variables) throws Exception;
    
    /**  
     * 审批通过。当前节点如果发起了会签子任务，则会首先结束所有子任务，然后通过结束当前任务 
     *   
     * @param taskId  
     *            当前任务ID  
     * @param variables  
     *            流程存储参数  
     * @throws Exception  
     */    
    public void passProcess(String taskId, Map<String, Object> variables) throws Exception;
    
    /**  
     * 根据当前任务ID，查询可以驳回的任务节点  
     * 并行节点配置要求：<br>  
     * 必须成对出现，且要求分别配置节点ID为:XXX_start(开始)，XXX_end(结束)
     *   
     * @param taskId  
     *            当前任务ID  
     */    
    public List<ActivityImpl> findBackAvtivity(String taskId) throws Exception;
}
