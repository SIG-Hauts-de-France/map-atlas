import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'link-menu',
  templateUrl: './link-menu.component.html',
  styleUrls: ['./link-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkMenuComponent { }