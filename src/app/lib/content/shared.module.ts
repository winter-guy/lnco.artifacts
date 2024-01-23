/* eslint-disable prettier/prettier */
import { NgModule } from '@angular/core';

import { TruncatePipe } from './truncate.pipe';
import { ContenteditableValueAccessor } from '@lib/content/contenteditable.directive';
import { StripHtmlTagsDirective } from '@lib/content/striptags.directive';

@NgModule({
    declarations: [
      ContenteditableValueAccessor, 
      TruncatePipe, 
      StripHtmlTagsDirective],
    exports: [ContenteditableValueAccessor, TruncatePipe, StripHtmlTagsDirective],
})
export class SharedModule {}
