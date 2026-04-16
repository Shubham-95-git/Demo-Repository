import { LightningElement, track } from 'lwc';
import applyLeave from '@salesforce/apex/LeaveController.applyLeave';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ApplyLeave extends LightningElement {

    @track leaveType;
    @track startDate;
    @track endDate;
    @track reason;
    @track isLoading = false;


    today;

    connectedCallback() {
        const now = new Date();
        this.today = now.toISOString().split('T')[0];
    }

    // Leave options
    leaveOptions = [
        { label: 'Sick', value: 'Sick' },
        { label: 'Casual', value: 'Casual' },
        { label: 'Paid', value: 'Paid' }
    ];

    // Handle input change
    handleChange(event) {
        const field = event.target.label;

        if(field === 'Leave Type') {
            this.leaveType = event.detail.value;
        } else if(field === 'Start Date') {
            this.startDate = event.target.value;
        } else if(field === 'End Date') {
            this.endDate = event.target.value;
        } else if(field === 'Reason') {
            this.reason = event.target.value;
        }
    }

    // Submit leave
    handleSubmit() {

        // Basic validation
        if(!this.leaveType || !this.startDate || !this.endDate) {
            this.showToast('Error', 'Please fill all required fields', 'error');
            return;
        }

        this.isLoading = true;

        const leaveRecord = {
            Leave_Type__c: this.leaveType,
            Start_Date__c: this.startDate,
            End_Date__c: this.endDate,
            Reason__c: this.reason
        };

        applyLeave({ req: leaveRecord })
            .then(result => {
                this.showToast('Success', result, 'success');
                this.resetForm();
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    // Reset form
    resetForm() {
        this.leaveType = null;
        this.startDate = null;
        this.endDate = null;
        this.reason = null;
    }

    // Toast message
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