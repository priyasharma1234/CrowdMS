import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SpreadIntoArrayPipe } from '@core/pipes/spread-into-array/spread-into-array.pipe'
import { CeilingPipe } from './ceiling/ceiling.pipe'
import { MaskContactNumberPipe } from './masking/mask-contact-no.pipe'
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FilterPipe } from './filter/filter.pipe';
import { ShringAmountPipe } from './shringAmount/shring-amount.pipe';
import { ReplacePipe } from './replace.pipe';
import { GetFirstLetterPipe } from './getFirstLetter/get-first-letter.pipe';
import { RemoveEspecialSymbolPipe } from './remove-especial-symbol.pipe';
import { NumberToWordPipe } from './number-to-word.pipe'
import { InrPipe } from './inr.pipe';
import { NumberUnderscorePipe } from './number-underscore.pipe'

@NgModule({
  declarations: [SpreadIntoArrayPipe, CeilingPipe, MaskContactNumberPipe,
    SafeHtmlPipe, FilterPipe, ShringAmountPipe, ReplacePipe, GetFirstLetterPipe, RemoveEspecialSymbolPipe, NumberToWordPipe,InrPipe, NumberUnderscorePipe],
  imports: [CommonModule],
    exports: [SpreadIntoArrayPipe, CeilingPipe, MaskContactNumberPipe, SafeHtmlPipe,
        FilterPipe, ShringAmountPipe, ReplacePipe, GetFirstLetterPipe, RemoveEspecialSymbolPipe,
         NumberToWordPipe,InrPipe,NumberUnderscorePipe
        ],
  providers: [],
})
export class PipesModule { }
