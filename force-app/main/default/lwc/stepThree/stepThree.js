import { LightningElement, api } from 'lwc';

export default class StepThree extends LightningElement {


    @api formData;

    submit() {
        this.dispatchEvent(
            new CustomEvent('submitform', {
                detail: this.formData
            })
        );
    }

    previous() {
        this.dispatchEvent(
            new CustomEvent('previous')
        );
    }
}