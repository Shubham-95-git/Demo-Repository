public class ContactController {

	@AuraEnabled
	public static Id CreateContact(Contact conObj) {
		
		insert conObj;

		return conObj.Id;

	}

	@AuraEnabled
	public static List<Contact> getContacts(String recordId, String searchVal){

		if(String.isEmpty(searchVal)){
			return new List<Contact>();
		}

		String search = '%'+ searchVal + '%';

		return[Select Id, FirstName, LastName, Email, Phone from Contact Where AccountId =: recordId AND Name LIKE : search];
	}
}