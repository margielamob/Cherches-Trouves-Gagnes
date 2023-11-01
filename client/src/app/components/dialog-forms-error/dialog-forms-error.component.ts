import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-forms-error',
    templateUrl: './dialog-forms-error.component.html',
    styleUrls: ['./dialog-forms-error.component.scss'],
})
export class DialogFormsErrorComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { formTitle: string; errorMessages: string[] }) {}
}
