import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css'
})
export class RegistrationFormComponent {

  username = signal<string>("");
  nameSubmitted = output<string>();

  submitUsername() {
    this.nameSubmitted.emit(this.username());
  }

}
