import { Component } from "@angular/core";
import { DialogComponent } from "./dialog.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatIconModule, MatFormFieldModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

@Component({ selector: "mat-icon", template: "" })
class IconComponent {}

@Component({ selector: "mat-dialog-content", template: "" })
class DialogContent {}

@Component({ selector: "mat-dialog-actions", template: "" })
class DialogActions {}

@Component({ selector: "mat-form-field", template: "" })
class FormField {}

const employee = {
    id: 1,
    firstName: "Brian",
    lastName: "McGee",
    position: "CEO",
    directReports: [2, 3],
    compensation: 1
  };
const report = {
    id: 4,
    firstName: 'Max',
    lastName: 'Power',
    position: 'Junior Software Engineer',
    compensation: 1,
    directReports: []
}
  describe("DialogComponent", () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;
    let dialogSpyObject = {
      close: () => {}
    };
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [DialogComponent],
        imports: [
          MatDialogModule,
          MatIconModule,
          FormsModule,
          MatFormFieldModule
        ],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: dialogSpyObject }
        ]
      })
        .overrideModule(BrowserDynamicTestingModule, {
          set: {
            entryComponents: [DialogComponent]
          }
        })
        .compileComponents();
  
      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    
    it("should create dialog component", () => {
      expect(component).toBeTruthy();
    });
  
    it("should call delete method on clicking delete icon", async(() => {
      spyOn(component, "deleteEmployee");
      component.deleteEmployee(employee, "deleted");
      expect(component.deleteEmployee).toHaveBeenCalled();
    }));
  
    it("should close dialog box when isEdited is set", () => {
      const emp = {
        id: 1,
        firstName: "Brian",
        lastName: "McGee",
        position: "CEO",
        directReports: [2, 3],
        compensation: 1,
        isEdited: "edited"
      };
      const editedCompletespy = spyOn(component.dialogRef, "close").and.callThrough();
      component.editCompensation(employee, 1, "edited");
      expect(editedCompletespy).toHaveBeenCalledWith(emp);
    });
  
    it("should close dialog after deleting record", () => {
      const rep = {
        id: 4,
        firstName: 'Max',
        lastName: 'Power',
        position: 'Junior Software Engineer',
        directReports: [],
        compensation: 1,    
        isDeleted: "deleted"
      };
      const deletedspy = spyOn(component.dialogRef, "close").and.callThrough();
      component.deleteEmployee(report, "deleted");
      expect(deletedspy).toHaveBeenCalledWith(rep);
    });
  });