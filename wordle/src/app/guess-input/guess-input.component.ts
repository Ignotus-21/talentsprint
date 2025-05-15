import { Component, ElementRef, input, output, Signal, viewChild } from '@angular/core';
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
export class GuessInputComponent {
  feedbacks = input<string[]>(["", "", "", "", ""]);
  wordInputted = output<string>();
  
  guessLetters = [signal(""), signal(""), signal(""), signal(""), signal("")];
  disabledInTypeScript = false;
  form: Signal<ElementRef | undefined> = viewChild('test');
  
  isComplete(): boolean {
    return this.guessLetters.every(letter => letter().length === 1);
  }

  handleBackspace(): void {
    const currentIndex = this.guessLetters.findIndex(letter => letter().length === 0);
    if (currentIndex > 0) {
      this.guessLetters[currentIndex - 1].set("");
      const f = this.form();
      if (f) {
        const inputs = f.nativeElement.children;
        if (inputs[currentIndex - 1] instanceof HTMLInputElement) {
          (inputs[currentIndex - 1] as HTMLInputElement).focus();
        }
      }
    }
  }

  handleKeyPress(key: string): void {
    const currentIndex = this.guessLetters.findIndex(letter => letter().length === 0);
    if (currentIndex !== -1) {
      this.guessLetters[currentIndex].set(key);
      const f = this.form();
      if (f) {
        const inputs = f.nativeElement.children;
        if (currentIndex < inputs.length - 1 && inputs[currentIndex + 1] instanceof HTMLInputElement) {
          (inputs[currentIndex + 1] as HTMLInputElement).focus();
        }
      }
    }
  }
  
  submitGuess(): void {
    this.wordInputted.emit(this.guessLetters.map(sig => sig()).join("")); 
    this.disabledInTypeScript = true;
  }

  focusToFirstInput() {
    var f = this.form();
    if (f) {
      console.log("hello");
      var firstInput = f.nativeElement.children[0] as HTMLInputElement;
      firstInput.focus();
    } 
  }
  
  focusToNextInput(event: Event) {
    var elem = event.target as HTMLElement;
    console.log(`Hello from ${elem}`);
    if (elem.nextElementSibling && elem.nextElementSibling instanceof HTMLInputElement) {
      (elem.nextElementSibling as HTMLInputElement).focus();
    }
  }

  decideClassFromFeedback(idx: number) {
    const feedback = this.feedbacks()[idx];
    const classMap: { [key: string]: string } = {
      'R': 'red',
      'Y': 'yellow',
      'G': 'green',
      '': ''
    };
    return classMap[feedback] || '';
  }
}
