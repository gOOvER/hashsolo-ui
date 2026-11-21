import { NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

export const primeNgServices = [
    MessageService,
    ConfirmationService
]

const primeNgModules = [
    TableModule,
    ChartModule,
    ToggleSwitchModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule,
    InputTextModule,
    RippleModule
    // DropdownModule,
    // ToastModule,
    // CheckboxModule,
    // CardModule,
    // DialogModule,
    // StepsModule,
    // InputTextModule,
    // DividerModule,
    // ProgressSpinnerModule,
    // DynamicDialogModule,
    // FieldsetModule,
    // InputTextareaModule,

    // InputNumberModule,
    // ConfirmDialogModule,
    // TabViewModule,
    // MenuModule,
    // OverlayPanelModule,
    // DataViewModule,

    // TagModule,
    // StyleClassModule,
    // PanelModule,
    // SelectButtonModule,

];


@NgModule({
    providers: [
        ...primeNgServices
    ],
    imports: [
        ...primeNgModules
    ],
    exports: [
        ...primeNgModules
    ],
})
export class PrimeNGModule { }