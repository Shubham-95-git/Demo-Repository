import { LightningElement, api } from 'lwc';
export default class StepTwo extends LightningElement {


    address = {};
    @api formData;

    connectedCallback() {
        this.address = {
            MailingStreet: this.formData?.MailingStreet || '',
            MailingCity: this.formData?.MailingCity || '',
            MailingState: this.formData?.MailingState || '',
            MailingPostalCode: this.formData?.MailingPostalCode || '',
            MailingCountry: this.formData?.MailingCountry || ''
        };
    }

    handleChange(event) {
        this.address[event.target.dataset.field] =
            event.target.value
    }

    next() {
        this.dispatchEvent(
            new CustomEvent('next', {
                detail: this.address
            })
        );
        console.log('FormData ',detail);
    }

    previous() {
        this.dispatchEvent(
            new CustomEvent('previous')
        );
    }
}