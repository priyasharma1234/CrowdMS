import { FormFocusDirective } from './input-form-focus.directive';
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { HideDirective } from './hide.directive'
import { inputMaskAadharDirective } from './int-aadhar-mask.directive';
import { AbstractDebounceDirective } from './debounce/abstract-debounce.directive';
import { SrchDbounceDirective } from './debounce/srch-dbounce.directive';
import { InputLimitDirective } from './input-limit.directive';
import { InvalidDirectiveDirective } from './invalid-directive.directive';
// import { SearchBoxDirective } from '@shared/components/pytCustTbl/pyt_SearchBox/search-box.directive';
import { InputRestrictionDirective } from './InputRestriction/input-restriction.directive';
import { UppercaseDirective } from './uppercase/uppercase.directive';
import { FocusToNextInputDirective } from './focus-to-next-input.directive';
// import { CustomTooltipDirective } from '@features/customCDK/customTooltip/custom-tooltip.directive';
import { ShowHidePasswordDirective } from './show-hide-password.directive';
import { RestricteAutocompleteDirective } from './restricteAutoComplete/restricte-autocomplete.directive';
import { RestrictCopyPasteDirective } from './restrict-copy-paste.directive';
import { PasswordStrengthDirective } from './password-strength.directive';
import { ShowNullResultPipe } from '../../shared/show-null-result.pipe';

@NgModule({
  declarations: [
    // HideDirective,
    // FormFocusDirective,
    // inputMaskAadharDirective,
    // AbstractDebounceDirective,
    // ShowNullResultPipe,
    // SrchDbounceDirective,
    // InputLimitDirective,
    // InvalidDirectiveDirective,
    // // SearchBoxDirective,
    // InputRestrictionDirective,
    // UppercaseDirective,
    // FocusToNextInputDirective,
    // // CustomTooltipDirective,
    // ShowHidePasswordDirective,
    // RestricteAutocompleteDirective,
    // RestrictCopyPasteDirective,
    // PasswordStrengthDirective,
  ],
  imports: [CommonModule],
  exports: [
    // HideDirective,
    // FormFocusDirective,
    // inputMaskAadharDirective,
    // AbstractDebounceDirective,
    // ShowNullResultPipe,
    // SrchDbounceDirective,
    // InputLimitDirective,
    // InvalidDirectiveDirective,
    // // SearchBoxDirective,
    // InputRestrictionDirective,
    // UppercaseDirective,
    // FocusToNextInputDirective,
    // // CustomTooltipDirective,
    // ShowHidePasswordDirective,
    // RestricteAutocompleteDirective,
    // RestrictCopyPasteDirective,
    // PasswordStrengthDirective
  ],
  providers: [],
})
export class CoreDirectivesModule { }
