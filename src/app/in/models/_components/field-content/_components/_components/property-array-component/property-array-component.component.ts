import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { FieldClass } from 'src/app/in/models/_object/FieldClass';

@Component({
    selector: 'app-property-array-component',
    templateUrl: './property-array-component.component.html',
    styleUrls: ['./property-array-component.component.scss']
})
export class PropertyArrayComponentComponent implements OnInit {

    @Input() value: any;
    @Input() name: any;
    @Input() description: any;
    @Input() fields: any;
    @Output() valueChange = new EventEmitter<[]>();
    public tempValue: string[] = [];
    public inputValue = '';
    public myControl: FormControl = new FormControl('');;
    public fieldsNotIn: any;
    private initialized = false;

    constructor(private elementRef : ElementRef ) { }

    ngOnInit(): void {
        this.value ? this.tempValue = [...this.value]: this.tempValue = [];
        this.initialized = true;
        this.fieldsNotIn = this.getFields();
    }

    public ngOnChanges() {
        if(this.initialized) {
            this.value ? this.tempValue = [...this.value]: this.tempValue = [];
            this.fieldsNotIn = this.getFields();
        }
    }

    public ngAfterViewInit() {
    }

    public updateValue() {
        this.valueChange.emit(<any> [...this.tempValue]);
    }

    public addValue(value:FieldClass) {
        if (value && value.name.trim() !== '') {
            this.tempValue.push(value.name);
            this.myControl.setValue('');
        }

        this.updateValue();
    }

    public removeValue(element:string) {
        const index = this.tempValue.indexOf(element);
        if (index >= 0) {
            this.tempValue.splice(index, 1);
        }

        this.updateValue();
    }

    public getFields() {
        return this.fields.filter((field:FieldClass) => !this.tempValue.includes(field.name) && field.current_scheme['type'] === 'computed');
    }
}
