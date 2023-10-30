import { NgModule } from '@angular/core';

import { MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedLibModule } from 'sb-shared-lib';
import { ControllerInfoComponent } from './controller-info.component';
import { ResponseComponentSubmit } from '../response/response.component';
import { PropertyDomainModule } from 'src/app/in/property-domain-component/property-domain.module';
import { TypeInputModule } from 'src/app/in/type-input/type-input.module';

@NgModule({
    imports: [
        SharedLibModule,
        MatTableModule,
        MatStepperModule,
        MatTabsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        PropertyDomainModule,
        TypeInputModule
    ],
    declarations: [
        ControllerInfoComponent,
        ResponseComponentSubmit,
    ],
    exports: [
        ControllerInfoComponent,
    ]
})
export class ControllerInfoModule { }
