import { Component, ElementRef, input, output, Input, Signal, viewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guess-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './guess-input.component.html',
  styleUrl: './guess-input.component.css'
})
export class GuessInputComponent implements AfterViewInit {
  @Input() showKeyboard: boolean = false;
  @Input() autofocus: boolean = false;

  feedbacks = input<string[]>(["", "", "", "", ""]);

  wordInputted = output<string>();

  guessLetters = [signal(""), signal(""), signal(""), signal(""), signal("")];
  disabledInTypeScript = false;
  form: Signal<ElementRef | undefined> = viewChild('test');
  @ViewChildren('guessInput') guessInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // Virtual keyboard
  row1: string[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  row2: string[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  row3: string[] = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  activeIndex: number = 0;

  ngAfterViewInit() {
    if (this.autofocus) {
      setTimeout(() => this.focusToInput(0), 0);
    }
  }

  focusToInput(idx: number) {
    const inputs = this.guessInputs?.toArray();
    if (inputs && inputs[idx]) {
      inputs[idx].nativeElement.focus();
    }
  }

  focusToFirstInput() {
    this.focusToInput(0);
  }

  focusToNextInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const inputs = this.guessInputs?.toArray();
    const idx = inputs?.findIndex(input => input.nativeElement === elem);
    if (inputs && idx !== undefined && idx >= 0 && idx < inputs.length - 1) {
      inputs[idx + 1].nativeElement.focus();
    }
  }

  decideClassFromFeedback(idx: number) {
    return {
      'R': 'red',
      'Y': 'yellow',
      'G': 'green',
      '': ''
    }[this.feedbacks()[idx]];
  }

  handleKeyPress(key: string): void {
    if (key === 'ENTER') {
      this.submitGuess();
      return;
    }

    if (key === '⌫') {
      if (this.activeIndex > 0) {
        this.activeIndex--;
        this.guessLetters[this.activeIndex].set('');
        this.focusToInput(this.activeIndex);
      }
      return;
    }

    if (this.activeIndex < this.guessLetters.length) {
      this.guessLetters[this.activeIndex].set(key);
      this.focusToInput(this.activeIndex);
      this.activeIndex++;
    }
  }

  submitGuess(): void {
    this.wordInputted.emit(this.guessLetters.map(sig => sig()).join(""));
    this.disabledInTypeScript = true;
    this.activeIndex = 0;
  }
}