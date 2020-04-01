import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Employee } from "../employee";

@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.css"]
})
export class DialogComponent implements OnInit{
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {}
      ngOnInit() {}
      // method that binds data back to employee.component after updating compensation
      editCompensation(
        employee: Employee,
        compensation: Number,
        isEdited: string
      ){
        console.log("inside edit compensation")
       this.dialogRef.close({
           ...employee,
           compensation: compensation,
           isEdited
       });
      }
      // method that binds data back to employee.component after deleting record
      deleteEmployee(employee: Employee, isDeleted: string) {
        this.dialogRef.close({ ...employee, isDeleted });
      }   
}