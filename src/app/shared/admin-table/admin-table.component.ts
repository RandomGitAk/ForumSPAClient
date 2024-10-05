import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentPipe } from "../../pipes/content.pipe";
import { ConfirmationService } from 'primeng/api'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [CommonModule, ContentPipe, ConfirmDialogModule],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss',
  providers: [ConfirmationService]
})
export class AdminTableComponent {
  @Input() data: any[] = []; 
  @Input() columns: { field: string, header: string }[] = [];  
  @Input() showCreateButton = false; 
  @Input() showEditButton = true; 

  @Output() edit = new EventEmitter<any>(); 
  @Output() delete = new EventEmitter<any>(); 
  @Output() create = new EventEmitter<void>(); 

  constructor(private confirmationService: ConfirmationService) {} 

  onCreate() {
    this.create.emit();
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete.emit(item); 
      },
      reject: () => {
        console.log('Deletion cancelled'); 
      }
    });
  }
  
  ngOnChanges() {
  }
}
