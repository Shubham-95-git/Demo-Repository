import { LightningElement, track, api } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone'},
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                {
                    label: 'Edit',
                    name: 'edit'
                },
                {
                    label: 'Delete',
                    name: 'delete'
                }
            ]
        }
    }
];

export default class ShowContactsInDataTable extends NavigationMixin(LightningElement) {

    @api recordId;
    columns = COLUMNS;
    @track searchTerm = '';
    @track contacts = [];
    @track isSearching = false;
    timeoutId;
    callCount = 0;
    isModal = false;
    selectedId;


    handleSearchChange(event) {

        this.searchTerm = event.target.value;

        console.log('Search ',this.searchTerm);

        if (!this.searchTerm || !this.searchTerm.trim()) {
            clearTimeout(this.timeoutId); // Cancel the pending debounce timer
            this.contacts = [];
            this.isSearching = false;
            return; // Exit early; no need to trigger debouncedSearch
        }

        this.isSearching = true;

        this.debouncedSearch();
    }

    debouncedSearch() {

        // Cancel previous timer
        window.clearTimeout(this.timeoutId);


        // Create new timer
        this.timeoutId = window.setTimeout(() => {

            console.log('Apex Call Triggered:', this.searchTerm);

            this.performSearch();

        }, 400);
    }

    performSearch() {

        getContacts({recordId: this.recordId, searchVal: this.searchTerm ? this.searchTerm.trim() : ''})
        .then(result => {
            this.callCount++;
            console.log('Apex Count:', this.callCount);
            console.log('Data:', result);

            this.contacts = result;
        })
        .catch(error => {

            console.error('Error:', error);

            this.contacts = [];

        })
        .finally(() => {

            this.isSearching = false;

        });
    }
    handleRowAction(event){

        console.log('Full Event:', JSON.stringify(event));
        const actionName = event.detail.action.name;
        const row = event.detail.row.Id;

        console.log('Action ',actionName);
        console.log('Row ',row);

        switch(actionName){

            case 'edit':
                this.selectedId = row;
                this.isModal = true;
                //this.editContact(row);
                break;

            case 'delete':
                this.deleteContact(row);
                break;
        }
    }

    handleSuccess(event) {
        this.showToast('Success','Contact updated successfully','success');
        console.log('Updated Contact Id:',event.detail.id);
        this.closeModal();
        this.performSearch();
    }

    /*editContact(contactId){
        this.isModal = true;
    }*/

    deleteContact(contactId){

        deleteRecord(contactId)
            .then(() => {
                    this.contacts = this.contacts.filter(
                    contact => contact.Id !== contactId
                );
                this.showToast('Success','Contact deleted successfully','success');
                // Refresh datatable
                //this.performSearch();
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
        }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({title, message, variant}));
    }
    
    closeModal(){
        this.isModal = false;
    }
}