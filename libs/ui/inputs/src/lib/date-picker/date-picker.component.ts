import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { ButtonComponent } from '../button/button.component'
import { MatInputModule } from '@angular/material/input'
import { provideMomentDateAdapter } from '@angular/material-moment-adapter'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig,
} from '@ng-icons/core'
import { iconoirCalendar } from '@ng-icons/iconoir'

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
}
@Component({
  selector: 'gn-ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatNativeDateModule,
    MatDatepickerModule,
    ButtonComponent,
    NgIconComponent,
    MatInputModule,
  ],
  providers: [
    provideIcons({ iconoirCalendar }),
    provideNgIconsConfig({
      size: '1.5rem',
    }),
    provideMomentDateAdapter(MY_DATE_FORMATS),
  ],
})
export class DatePickerComponent {
  @Input() date: Date
  @Output() dateChange = new EventEmitter<Date>()
}
