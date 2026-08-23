import { LightningElement, api } from 'lwc';

export default class StepOne extends LightningElement {

    @api formData;

    contact = {};

    connectedCallback() {

        this.contact = {
            FirstName: this.formData?.FirstName || '',
            LastName: this.formData?.LastName || '',
            Email: this.formData?.Email || '',
            Phone: this.formData?.Phone || ''
        };
    }

    handleChange(event) {

        const fieldName = event.target.dataset.field;
        console.log('STEP 1 - Field:', fieldName);

        const value = event.target.value;        
        console.log('STEP 1 - Value:', value);

        this.contact = {
            ...this.contact,
            [fieldName]: value
        };

        console.log('STEP 1 - Contact Object:', JSON.stringify(this.contact));
    }

    next() {

        console.log('STEP 1 - Next button clicked');

        console.log('STEP 1 - Data being sent to parent:',JSON.stringify(this.contact));

        const isValid = [...this.template.querySelectorAll('lightning-input')].every(input => input.reportValidity());

        if(!isValid){
            return;
        }

        this.dispatchEvent(
            new CustomEvent('next', {
                detail: this.contact
            })
        );

        console.log('STEP 1 - next event dispatched');
    }
}