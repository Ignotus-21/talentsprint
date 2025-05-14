import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent {
  @Output() keyPress = new EventEmitter<string>();
  @Input() letterStates: { [key: string]: 'correct' | 'present' | 'absent' | null } = {};

  rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  onKeyClick(key: string) {
    this.keyPress.emit(key);
  }

  getKeyClass(key: string): string {
    if (key === 'Enter' || key === 'Backspace') {
      return 'special-key';
    }
    const state = this.letterStates[key];
    if (!state) return 'key';
    return `key ${state}`;
  }
} 