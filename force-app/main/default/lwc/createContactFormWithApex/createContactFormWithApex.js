import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import CreateContact from '@salesforce/apex/ContactController.CreateContact';

export default class CreateContactFormWithApex extends NavigationMixin (LightningElement) {

    @api recordId;

    contact = {};

    handleChange(event){
        
       // this.contact[event.target.dataset.id] = event.target.value;

        const fieldName = event.target.dataset.field;
        console.log('STEP 1 - Field:', fieldName);

        const value = event.target.value;        
        console.log('STEP 1 - Value:', value);

         this.contact = {
            ...this.contact,
            [fieldName]: value
        };
        
        console.log('Contact ',JSON.stringify(this.contact));
    }

    handleClick(){

        const isValid = [...this.template.querySelectorAll('lightning-input')].every(input => input.reportValidity());

        if(!isValid){
            return;
        }

        this.contact.AccountId = this.recordId;

        CreateContact({
            conObj : this.contact
        })
        .then(result =>{
            
            this.showToast('Success', 'Contact Creates Successfully', 'success');

            const pageRef = {
                type: 'standard__recordPage',
                attributes: {
                    recordId: result,
                    objectApiName: 'Contact',
                    actionName: 'view'
                }
            };

            // Generate URL and open in new tab
            this[NavigationMixin.GenerateUrl](pageRef)
                .then(url => {
                    console.log('Generated URL:', url);
                    window.open(url, '_blank');
                });

            console.log('Contact Id : ' + result);

             this.contact = {};

            this.template.querySelectorAll('lightning-input').forEach(input => input.value = '');
        })

        .catch(error =>{
            console.log(JSON.stringify(error));

            this.showToast('Error', error.body.message, 'error');
        })
    }
     showToast(title, message, variant) {

        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}