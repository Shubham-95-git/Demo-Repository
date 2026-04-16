public class LeaveController {

        @AuraEnabled
        public static String applyLeave(Leave_Request__c req) {
        // 1. Validate dates
        if(req.Start_Date__c > req.End_Date__c){
            throw new AuraHandledException('Start date cannot be after end date');
        }
    
        Integer days = req.End_Date__c.daysBetween(req.Start_Date__c) + 1;
    
        // 2. Fetch Leave Balance(Changes done in Branch1)
        Leave_Balance__c lb = [
            SELECT Id, Available_Leaves__c, Used_Leaves__c
            FROM Leave_Balance__c
            WHERE Employee__c = :UserInfo.getUserId()
            AND Leave_Type__c = :req.Leave_Type__c
            LIMIT 1
        ];
    
        // 3. Validate balance
        if(lb.Available_Leaves__c < days){
            throw new AuraHandledException('Insufficient leave balance');
        }
    
        // 4. Set values
        req.Employee__c = UserInfo.getUserId();
        req.Number_of_Days__c = days;
        req.Status__c = 'Pending';
    
        insert req;
    
        return 'Success';
	}
    @AuraEnabled(cacheable=true)
	public static List<Leave_Request__c> getMyLeaves() {
        return [
            SELECT Id, Leave_Type__c, Start_Date__c, End_Date__c, Status__c
            FROM Leave_Request__c
            WHERE Employee__c = :UserInfo.getUserId()
            ORDER BY CreatedDate DESC
        ];
	}
    @AuraEnabled(cacheable=true)
	public static List<Leave_Balance__c> getLeaveBalance() {
        return [
            SELECT Leave_Type__c, Total_Leaves__c, Used_Leaves__c, Available_Leaves__c
            FROM Leave_Balance__c
            WHERE Employee__c = :UserInfo.getUserId()
        ];
	}
}