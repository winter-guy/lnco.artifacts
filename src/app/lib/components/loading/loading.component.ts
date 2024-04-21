/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

@Component({
    selector: 'loading',
    standalone: true,
    imports: [],
    templateUrl: './loading.component.html',
    styles: `
    ::ng-deep .cdk-dialog-container {
      @apply ring-0 outline-none
  }`,
})
export class LoadingComponent {}
