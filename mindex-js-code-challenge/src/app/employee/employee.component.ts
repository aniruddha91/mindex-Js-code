import { DialogComponent } from './../dialog/dialog.component';
import { EmployeeService } from './../employee.service';
import { flatMap } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {Employee} from '../employee';
import { Observable, from } from 'rxjs';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
  @Input() employee: Employee;
  @Output() editCompensation = new EventEmitter<number>();
  @Output() deleteEmployeeRecord = new EventEmitter<{
    employee: Employee;
    report: Employee;
  }>();
  totalReports: number;
  employees: Employee[] = [];
  reportList: Employee[] = [];
  constructor(private employeeService: EmployeeService, private employeeList: EmployeeListComponent, private dialog: MatDialog) {
  }
  ngOnInit(){
    
    this.employees = this.employeeList.employees;
    // recursive approach to get direct reports commented in order to handle the number of reports when report gets deleted 
    // this.findtotalReports(this.employee);
    this.getEmpReports(this.employees);
    this.totalReports = this.employee.reports ? this.employee.reports.length : 0
    }
    // get reports list for displaying them under employees having reports
    getEmpReports(employees){
      employees.forEach((employee: Employee) => {
        if(!!employee.directReports){
          employee.directReports.forEach((r: any) => {
            this.reportList.push(...employees.filter((e : {id: any}) => e.id == r ));
          });
          this.getReports(employee, employees);
          employee.reports = Array.from(new Set(this.reportList));
          this.reportList = [];
        }
      });
    }
    findtotalReports(employee: Employee){
      if(this.employee && employee.directReports){
        this.totalReports += employee.directReports.length;
        from(employee.directReports).pipe(
          flatMap(id => <Observable<Employee>>
          this.employeeService.get(id))).subscribe(nextEmployee => this.findtotalReports(nextEmployee));
      }
    }
    //Recrsively calling to fetch all reports
    getReports(emp: Employee, employees: Employee[]) {
      if (!emp.directReports || emp.directReports.length === 0) {
        return;
      }
      if(!!emp){
        emp.directReports.forEach((report: number) => {
          const em = employees.filter(e => e.id === report);
          this.reportList.push(...em);
          this.getReports(em[0],employees);
        })
      }
    }
    // delete record depending on whether its a direct or indirect reportee
    deleteEmployee(employee: Employee, report: Employee){
      if (employee.directReports.includes(report.id)) {
        const empIndx = employee.directReports.indexOf(report.id);
        employee.directReports.splice(empIndx, 1);
        this.deleteEmployeeRecord.emit({ employee, report });
      }else {
        this.deleteIndirectReportees(report);
      }
    }
    deleteIndirectReportees(report){
      this.employees.forEach(employee => {
        if (employee.directReports.includes(report.id)) {
          const indirectIndex = employee.directReports.indexOf(report.id);
          employee.directReports.splice(indirectIndex, 1);
          this.deleteEmployeeRecord.emit({ employee, report });
        }
      })
    }
    // Dialog box control for update and delete depending on the action sent
    openDialogBox(emp: any, report: any, action: string):void{
      console.log("opening dialog");
      const openModal = this.dialog.open(DialogComponent,{
        data: { ...report, modalAction: action}
      });
      openModal.afterClosed().subscribe(result => {
        if (result.isDeleted === "deleted") {
          delete result.modalAction;
          delete result.isDeleted;
          this.deleteEmployee(emp, report);
          setTimeout(() => this.dialog.closeAll(), 2000);
        }
        if (result.isEdited === "edited") {
          delete result.modalAction;
          delete result.isEdited;
          this.editCompensation.emit(result);
          setTimeout(() => this.dialog.closeAll(), 2000);
        }
      });
    }
  }

