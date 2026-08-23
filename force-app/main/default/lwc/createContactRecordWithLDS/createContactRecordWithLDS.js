import { LightningElement, api } from 'lwc';
import {createRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class CreateContactRecordWithLDS extends LightningElement {

    @api recordId;
    fields={};

    handleChange(event){
        this.fields[event.target.dataset.id] = event.target.value;
        console.log('Field is ',JSON.stringify(this.fields));
    }

    handleClick(){

        const isValid = [...this.template.querySelectorAll('lightning-input')].every(input => input.reportValidity());

        if(!isValid){
            return
        }

        this.fields.AccountId = this.recordId;

        console.log('Accountid ',JSON.stringify(this.fields));

        createRecord({
            apiName: 'Contact',
            fields: this.fields
        })
        .then(result =>{

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact Created Successfully',
                    variant: 'success'
                })
            );
            console.log('Record Id : ' + result.id);

            this.fields = {};

            this.template.querySelectorAll('lightning-input').forEach(input => input.value = '');
        })
        .catch(error =>{

            console.log(JSON.stringify(error));
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }
}