import {async, TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {Component} from '@angular/core';

import {EmployeeComponent} from './employee.component';
import { Employee } from '../employee';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeService } from '../employee.service';
import { MatDialogModule, MatIconModule, MatListModule, MatExpansionModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

@Component({selector: 'mat-card', template: ''})
class CardComponent {
}

@Component({selector: 'mat-card-header', template: ''})
class CardHeaderComponent {
}

@Component({selector: 'mat-card-title', template: ''})
class CardTitleComponent {
}

@Component({selector: 'mat-card-subtitle', template: ''})
class CardSubtitleComponent {
}

@Component({selector: 'mat-card-content', template: ''})
class CardContentComponent {
}

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);
const employeeListSpy = jasmine.createSpyObj("EmployeeListComponent", [
  "employees",
  "getEmployees",
  "deleteEmployeeRecord",
  "editCompensation"
]);
const employees: Employee[] = [
  {
    id: 1,
    firstName: 'Brian',
    lastName: 'McGee',
    position: 'CEO',
    directReports: [2, 3],
    compensation: 0        
  },
  {
    id: 2,
    firstName: 'Homer',
    lastName: 'Thompson',
    position: 'Dev Manager',
    directReports: [4],
    compensation: 0
  },
  {
    id: 3,
    firstName: 'Rock',
    lastName: 'Strongo',
    position: 'Lead Tester',
    directReports: [],
    compensation: 0
  },
  {
    id: 4,
    firstName: 'Max',
    lastName: 'Power',
    position: 'Junior Software Engineer',
    directReports: [],
    compensation: 0
  }
];

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let matModalSpy: any;
  let matDialogSpy: jasmine.Spy;
  let matDialogClosedSpy: jasmine.Spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardSubtitleComponent,
        CardContentComponent
      ],
      imports: [
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatExpansionModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: EmployeeListComponent, useValue: employeeListSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    component.employee = employees[0];
  }));

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it("should call getEmpReports function on init", async(() => {
    spyOn(component, "getEmpReports");
    fixture.detectChanges();
    expect(component.getEmpReports).toHaveBeenCalled();
  }));

  it("should open update pop up", fakeAsync(() => {
    matModalSpy = jasmine.createSpyObj({
      afterClosed: of({
        ...employees[0],
        compensation: 100,
        isEdited: "edited"
      }),
      close: null,
      closeAll: null
    });
    matModalSpy.componentInstance = { body: "" };
    matDialogSpy = spyOn(TestBed.get(MatDialog), "open").and.returnValue(
      matModalSpy
    );
    component.openDialogBox(employees[0], employees[0], "edited");
    expect(matDialogSpy).toHaveBeenCalled();
    expect(matModalSpy.afterClosed).toHaveBeenCalled();
    matDialogClosedSpy = spyOn(TestBed.get(MatDialog), "closeAll");
    tick(2000);
    expect(matDialogClosedSpy).toHaveBeenCalled();
  }));

  it("should open delete pop up", fakeAsync(() => {
    matModalSpy = jasmine.createSpyObj({
      afterClosed: of({ ...employees[0], isDeleted: "deleted" }),
      close: null
    });
    matModalSpy.componentInstance = { body: "" };
    matDialogSpy = spyOn(TestBed.get(MatDialog), "open").and.returnValue(
      matModalSpy
    );
    spyOn(component, "deleteEmployee");
    component.openDialogBox(employees[0], employees[1], "deleted");
    expect(matDialogSpy).toHaveBeenCalled();
    expect(matModalSpy.afterClosed).toHaveBeenCalled();
    matDialogClosedSpy = spyOn(TestBed.get(MatDialog), "closeAll");
    tick(2000);
    expect(matDialogClosedSpy).toHaveBeenCalled();
  }));
});
