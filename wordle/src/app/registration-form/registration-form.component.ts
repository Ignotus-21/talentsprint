import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css'
})
export class RegistrationFormComponent {

  username = signal<string>("");
  nameSubmitted = output<string>();

  submitUsername() {
    if (this.username().trim().length >= 2) {
      this.nameSubmitted.emit(this.username().trim());
    }
  }

}
