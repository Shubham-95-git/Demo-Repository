import { LightningElement, track } from 'lwc';
import createContact from '@salesforce/apex/CreateContactController.createContact';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ContactCreateForm extends LightningElement {

    @track contact = {
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: ''    
    };

    handleChange(event){
        const field = event.target.dataset.field;
        this.contact = { ...this.contact, [field]: event.target.value }; // Ensure reactivity
        console.log(`Field Updated - ${field}:`, this.contact[field]); 
    }

    handleSave(){
        console.log('First Name:', this.firstName);
        console.log('Last Name:', this.lastName);
        console.log('Email:', this.email);

         createContact({con : this.contact})
         .then(result=>{
            if(result === 'Success'){
               this.showToast('Success', 'Contact created successfully!!!!', 'success');
            }
            this.clearForm();
         })
         .catch(error=>{
            console.error('Error creating contact:', error);
            this.showToast('Errorr', 'Not able to create contact!!!', 'error');
         })
    }

    clearForm(){
        this.template.querySelectorAll('lightning-input[data-field]').forEach(input => {
        input.value = null;
        });
    }

    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }

    validateForm() {
    let isValid = true;
    const inputs = this.template.querySelectorAll('lightning-input');

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });

    return isValid;
    }

    closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

}