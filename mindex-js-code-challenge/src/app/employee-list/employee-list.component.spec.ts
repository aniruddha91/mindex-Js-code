import {async, TestBed, ComponentFixture} from '@angular/core/testing';
import {Component, Input} from '@angular/core';

import {EmployeeListComponent} from './employee-list.component';
import {EmployeeService} from '../employee.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs/internal/observable/of';
import { Employee } from '../employee';

@Component({selector: 'app-employee', template: ''})
class EmployeeComponent {
  @Input('employee') employee: any;
}

@Component({selector: 'mat-grid-list', template: ''})
class GridListComponent {
}

@Component({selector: 'mat-grid-tile', template: ''})
class GridTileComponent {
}

@Component({ selector: "app-my-dialog", template: "" })
class MyDialogComponent {}
const matDialogSpy = jasmine.createSpyObj("MatDialog", ["open","close","afterClosed"]);
const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);
const employees = [
  {
    id: 1,
    firstName: "Brian",
    lastName: "McGee",
    position: "CEO",
    directReports: [2, 3],
    compensation: 100
  },
  {
    id: 2,
    firstName: "Homer",
    lastName: "Thompson",
    position: "Dev Manager",
    directReports: [4],
    compensation: 100
  },
  {
    id: 3,
    firstName: "Rock",
    lastName: "Strongo",
    position: "Lead Tester",
    directReports: [],
    compensation: 100
  },
  {
    id: 4,
    firstName: "Max",
    lastName: "Power",
    position: "Junior Software Engineer",
    directReports: [],
    compensation: 100
  }
];

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeListComponent,
        EmployeeComponent,
        GridListComponent,
        GridTileComponent
      ],
      providers: [
        {provide: EmployeeService, useValue: employeeServiceSpy},
        { provide: MatDialog, useValue: matDialogSpy }
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));
  
  it("should get All employees and call getAll service on init", async(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    const getAllSpy = employeeServiceSpy.getAll.and.returnValue(of(employees));
    fixture.detectChanges();
    expect(getAllSpy.calls.any()).toBe(
      true,
      "function getEmployees did not get called"
    );
  }));
});
