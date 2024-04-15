/* eslint-disable no-prototype-builtins */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable-line */
import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, AuthService } from '@auth0/auth0-angular';
import { needConfirmation } from '@lib/content/dialog.directive';
import { formGroupValidator } from '@lib/utils/validators/generic.validator';
import { Subscription } from 'rxjs';
import { BaseIdentityFormData } from './identity.i';
import { UserMetaFormMapper } from './usermeta.mapper';
import { NavigationEnd, Router } from '@angular/router';

const VALIDATION_MESSAGES = {
    email: {
        required: 'Please fill out this field.',
        email: 'This email is invalid',
    },
    username: {
        required: 'Please fill out this field.',
        minlength: 'The username length must be greater than or equal to 8',
        pattern: 'special symbols and numbers are not allowed.',
    },
    name: {
        required: 'Please fill out this field.',
        pattern: 'no special symbols are allowed, add single spaces in between incase',
    },
    profile: {
        required: 'Please fill out this field.',
    },
    about: {
        required: 'Please fill out this field.',
        maxlength: 'Tell is in brief, would be eassier for others too',
        minlength: 'Sounds too short, add bit more maybe',
    },
};

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
})
export class ProfileComponent {
    details_form!: FormGroup;
    app_metadata_form!: FormGroup;
    user!: User;
    isLoading!: boolean;

    error_messages = VALIDATION_MESSAGES;

    public subscriptions = {
        userData$: <Subscription>{},
        isLoading: <Subscription>{},
    };

    constructor(
        public auth: AuthService,
        @Inject(DOCUMENT) private doc: Document,
        public bareDialog: Dialog,
        private _formBuilder: FormBuilder,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
            }
        });
        this.details_form = this._formBuilder.group(
            {
                username: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
                name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)]],
                profile: ['', Validators.required],
                email: ['', [Validators.email]],
                about: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
            },
            { validators: formGroupValidator(VALIDATION_MESSAGES) },
        );

        this.app_metadata_form = this._formBuilder.group({
            comments: ['', [Validators.required]],
            follows: ['', Validators.required],
            broadcast: ['', Validators.required],
            push_notification: ['', Validators.required],
        });

        this.auth.user$.subscribe((userinfo) => {
            if (userinfo && userinfo.sub) {
                this.user = userinfo;
            }
        });

        // this.store.dispatch(UserIO.getUserMetaData());
        // this.subscriptions.userData$ = this.store.pipe(select(getUserData)).subscribe((res) => {
        //     if (res) {
        //         this.details_form.patchValue(UserMetaFormMapper.mapResponseToBDForm(res));
        //         this.details_form.disable();
        //     }
        // });

        // this.store.select(isLoading).subscribe((res) => {
        //     this.isLoading = res.isLoading;
        // });
    }

    logout() {
        this.auth.logout();
    }

    @needConfirmation({
        message: "you're about to save these changes.",
        label: 'done',
        disableCloseBtn: true,
    })
    disableElement() {
        if (this.details_form.invalid) {
            this.invalidFields();
            return;
        }

        this.details_form.disable();
        this.submitForm();
    }

    @needConfirmation({
        message: 'something uncertain. please review the details provided',
        label: 'watch',
        disableCloseBtn: true,
    })
    invalidFields() {
        const formControls = this.details_form.controls;

        if (this.details_form.errors)
            Object.keys(this.details_form.controls).forEach((controlname) => {
                const formControl = formControls[controlname];

                if (this.details_form.errors && !this.details_form.errors.hasOwnProperty(controlname) && false) {
                    this.details_form.controls[controlname].disable();
                }
            });
    }

    @needConfirmation({
        message: 'Do you want to edit profile details?',
        label: 'edit',
        disableCloseBtn: true,
    })
    enableElement() {
        this.details_form.enable(); // Enables the form control and the contenteditable element
    }

    isFormEnabled() {
        if (this.details_form.disabled) {
            this.enableElement();
            return;
        }

        this.disableElement();
    }

    submitForm() {
        const formData: BaseIdentityFormData = this.details_form.value;

        if (this.user.sub) {
            const userdata = UserMetaFormMapper.mapBasicDetailsForm(formData, this.user.sub);
            // this.store.dispatch(UserIO.updateUserMetaData({ userdata }));

            console.log(userdata);
            //call the store dispatch for service call
            // subscribe to restore the values to ui for sync
            // routing navigation if needed
        }
    }
}
