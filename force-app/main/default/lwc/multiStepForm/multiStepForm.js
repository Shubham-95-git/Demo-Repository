import { LightningElement, api } from 'lwc';
import createContact from '@salesforce/apex/ContactController.CreateContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class MultiStepForm extends LightningElement {


    currentStep = '1';
    isLoading = false;
    formData = {
        FirstName:'',
        LastName:'',
        Email:'',
        Phone:'',
        MailingStreet:'',
        MailingCity:'',
        MailingState:'',
        MailingPostalCode:'',
        MailingCountry:''
    };


    get showStepOne(){
        return this.currentStep === '1';
    }

    get showStepTwo(){
        return this.currentStep === '2';
    }

    get showStepThree(){
        return this.currentStep === '3';
    }

    handleNext(event){
        console.log('PARENT - Event detail:',JSON.stringify(event.detail));

        this.formData = {
            ...this.formData,
            ...event.detail
        };
       
        if(this.currentStep === '1'){
            this.currentStep='2';
        }
        else if(this.currentStep === '2'){
            this.currentStep='3';
        }

    }

    handlePrevious(){

        if(this.currentStep === '2'){
            this.currentStep='1';
        }
        else if(this.currentStep === '3'){
            this.currentStep='2';
        }
    }

    handleSubmit(event){

        this.formData = {
            ...this.formData,
            ...event.detail
        };

        this.isLoading=true;

        createContact({conObj:this.formData})

        .then(result=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Success',
                    message:'Contact Created '+result,
                    variant:'success'
                })
            );

            this.currentStep='1';

        })
        .catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error',
                    message:error.body.message,
                    variant:'error'
                })
            );
        })
        .finally(()=>{
            this.isLoading=false;
        });
    }
}