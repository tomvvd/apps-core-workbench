import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual, cloneDeep, indexOf } from 'lodash';
import { FieldClassArray } from '../../_object/FieldClassArray';
import { FieldClass } from '../../_object/FieldClass';

@Component({
    selector: 'app-field-content',
    templateUrl: './field-content.component.html',
    styleUrls: ['./field-content.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FieldContentComponent implements OnInit {

    @Input() fields: FieldClass[];
    @Input() types: any;
    @Input() actual_class: any;
    @Input() actual_field: FieldClass;
    @Output() updateField = new EventEmitter<{}>();
    public synchronised:boolean|undefined;
    public values: any = {};
    public selected_type: string
    public actual_field_index:number;
    public list_of_type: any;
    public properties: any = {}
    public hasChanged: boolean = false;
    public basic_properties: any = {
//        "usage": true,
        "description": true,
        "readonly": false,
        "required": false,
        "unique": false,
        "multilang": false,
        "foreign_object": true,
        "foreign_field": true,
        "rel_table": true,
        "rel_local_key": true,
        "rel_foreign_key": true
    };

    private default_type_usage: any = {
        "boolean": "number/boolean",
        "integer": "number/integer.decimal",
        "float": "number/real:10.2",
        "string": "text/plain.short",
        "text": "text/plain.small",
        "date": "date/plain",
        "time": 'time/plain',
        "datetime": "date/time",
        "binary": "binary"
    };

    constructor(
        private snackBar: MatSnackBar
    ) { }

    async ngOnInit() {
        if(this.fields !== undefined){
            this.actual_field_index = this.fields.indexOf(this.actual_field)
            this.values = this.fields[this.actual_field_index].current_scheme;
        }
        this.selected_type = this.values['type'];
        this.list_of_type = <any>Object.keys(this.types).sort();
        // #memo - prevent toggling hasChanged without user action
        /*
        if(!this.values["usage"]) {
            this.values['usage'] = this.default_type_usage[this.selected_type];
            this.hasChanged = true;
        }
        */
    }

    public ngOnChanges() {
        this.actual_field_index = this.fields.indexOf(this.actual_field)
        console.log(this.fields[this.actual_field_index].isNew)
        this.synchronised = this.fields[this.actual_field_index].synchronised
        this.values = this.fields[this.actual_field_index].current_scheme;
        console.log(this.values)
        this.selected_type = this.values['type'];
        this.properties = this.types[this.selected_type];
        this.hasChanged = !this.fields[this.actual_field_index].checkSync()
        // If the field doesn't have a usage property, just add one based on the type
        // Can't do that in the children component, will be in a ngOnChanges and can't emit the new usage in a ngOnChanges
        // #memo - this mark the content as modified while user hasn't changed anything
        /*
        if(!this.values["usage"] && this.values.type != 'one2many' && this.values.type != 'many2one' && this.values.type != 'many2many' && this.values.type != 'alias') {
            if (this.values.type == "computed") {
                if(this.values["result_type"]) {
                    this.values['usage'] = this.default_type_usage[this.values.result_type];
                }
            }
            else {
                this.values['usage'] = this.default_type_usage[this.selected_type];
            }
            this.hasChanged = true;
        }
        */
    }

    /**
     * Change the type of the selected field.
     *
     * @param selectedType type which is selected
     */
    public onSelectedTypeChange(selectedType: string) {
        this.selected_type = selectedType;
        this.values = { "type": selectedType };
        if(selectedType != "computed") {
            this.values['usage'] = this.default_type_usage[selectedType];
        }
        this.properties = this.types[this.selected_type];
        this.hasChanged = !this.fields[this.actual_field_index].checkSync();
    }

    /**
     * Return the type of the given property.
     *
     * @param property name of the property
     * @returns the type of the property
     */
    public getType(property: any) {
        return this.properties[property].type;
    }

    /**
     * Return the value of the given property.
     *
     * @param property name of the property
     * @returns the value of the property
     */
    public getValue(property: any) {
        return this.values[property];
    }

    /**
     * Functions that checks if all the required property are filled for the field.
     *
     * @returns true if all the required property are filled
     */
    public checkRequired(): boolean {
        let result = true;
        Object.keys(this.basic_properties).forEach(element => {
            if (this.basic_properties[element] && this.properties[element] && !this.values[element]) {
                result = false;
            }
        });
        return result;
    }

    /**
     * Function that cancel all the changes that are currently on the field.
     */
    public cancelChange() {
        this.values = this.fields[this.actual_field_index].sync_scheme
        this.selected_type = this.values.type;
        this.properties = this.types[this.selected_type];
        this.hasChanged = !this.fields[this.actual_field_index].checkSync();
    }

    /**
     * Save all the changes that are currently on the field by preventing the parent component.
     */
    public saveChange() {
        this.updateField.emit(this.values);
        this.hasChanged = false;
    }

    /**
     * Update a property with a new value, if the value is null delete it from the field.
     *
     * @param event contains the property name and the new value for it
     */
    public updatePropertiesWithValue(event: { property: string, new_value: any }) {
        if (event.new_value === undefined) {
            let new_field = cloneDeep(this.values);
            delete new_field[event.property];
            this.values = new_field;
        }
        else {
            let new_field = cloneDeep(this.values);
            new_field[event.property] = cloneDeep(event.new_value);
            this.values = new_field;
        }

        this.fields[this.fields.indexOf(this.actual_field)].current_scheme = this.values
        this.hasChanged = !this.fields[this.actual_field_index].checkSync()
    }

    /**
     * Update the description.
     *
     * @param value of the new description
     */
    public updateDescription(value: string) {
        if (value == '') {
            this.updatePropertiesWithValue({ property: "description", new_value: undefined });
        } else {
            this.updatePropertiesWithValue({ property: "description", new_value: value });
        }
    }

    /**
     * Return the description of the actual field.
     *
     * @returns the description
     */
    public getDescription() {
        return this.values['description'] ? this.values['description'] : "";
    }

    /**
     * Return the description of the given property.
     *
     * @param property the property of the description
     * @returns the description of the property
     */
    public getPropertyDescription(property: any) {
        return this.types[this.selected_type][property].description;
    }

    /**
     * Return the advance properties of actual field.
     *
     * @returns the advance properties
     */
    public getAdvanceProperty() {
        let advanceProperty: any = {};
        for (const property in this.properties) {
            if (!this.basic_properties.hasOwnProperty(property)) {
                advanceProperty[property] = this.values[property];
            }
        }
        return advanceProperty;
    }
}
