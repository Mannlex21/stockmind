import { Component, input } from '@angular/core';
import { LucideBuilding, LucideCircleCheck, LucideShoppingBag } from '@lucide/angular';

@Component({
  selector: 'app-warehouse-kpis',
  standalone: true,
  imports: [LucideBuilding, LucideCircleCheck, LucideShoppingBag],
  templateUrl: './warehouse-kpis.html',
})
export class WarehouseKpisComponent {
  readonly total = input.required<number>();
  readonly active = input.required<number>();
  readonly pos = input.required<number>();
}
