import { DialogComponent } from './../dialog/dialog.component';
import {Component, OnInit} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }
  // method fetch list of all employees
  getEmployees(){
    this.employeeService
      .getAll()
      .pipe(
        reduce((emps, e: Employee) => {
          return emps.concat(e);
        }, []),
        map(emps => (this.employees = emps)),
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {});
  }
  // mmethod updates compensation
  editCompensation(emp: Employee){
    this.employeeService.save(emp).pipe(catchError(this.handleError.bind(this)))
    .subscribe(() => {
      const edited = true;
      this.dialog.open(DialogComponent, {
        data: { ...emp, edited }
      });

      this.getEmployees();
    });
  }
  // Method deletes employee reports
  deleteEmployeeRecord(recordObject: {
    employee: Employee;
    report: Employee;}){
      this.employeeService.save(recordObject.employee)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        const deleted = true;
        this.dialog.open(DialogComponent, {
          data: {...recordObject.report,deleted}
        })
        this.getEmployees();
      });
    }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
