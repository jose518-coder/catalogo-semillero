import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './confirmar-dialog.component.html'
})
export class ConfirmarDialogComponent {
  private dialogRef = inject(
    MatDialogRef<ConfirmarDialogComponent>
  );
  readonly data = inject(MAT_DIALOG_DATA);
  cancelar(): void {
    this.dialogRef.close(false);
  }
  confirmar(): void {
    this.dialogRef.close(true);
  }
}