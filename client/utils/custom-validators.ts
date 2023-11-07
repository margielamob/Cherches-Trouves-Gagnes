/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function userNameValidator(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return userService.isUserNameAvailable(control.value).pipe(map((isAvailable) => (isAvailable ? null : { userNameTaken: true })));
    };
}
