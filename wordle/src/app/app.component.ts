import { Component, computed, inject, signal, viewChildren } from '@angular/core';
import { GuessInputComponent } from "./guess-input/guess-input.component";
import { WordleServiceService } from './wordle-service.service';
import { GuessResponse } from './types';
import { RegistrationFormComponent } from "./registration-form/registration-form.component";
import { KeyboardComponent } from './keyboard/keyboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GuessInputComponent, RegistrationFormComponent, KeyboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wordle';
  initialGuess = ["", "", "", "", ""];
  historicGuesses = ["", "", "", "", "", ""];
  historicFeedbacks = signal<GuessResponse[]>([]);
  userId = signal<string>("");
  username = signal<string>("Anonymous");
  isGameCreated = signal<boolean>(false);
  inputs = viewChildren(GuessInputComponent);
  errorMessage = signal<string>("");
  letterStates = signal<{ [key: string]: 'correct' | 'present' | 'absent' | null }>({});

  private wordleService = inject(WordleServiceService);

  getSplitFeedbackFor(attemptNumber: number) {
    if (this.historicFeedbacks()[attemptNumber]) {
      return this.historicFeedbacks()[attemptNumber].feedback.split("");
    } else {
      return ["", "", "", "", ""];
    }
  }

  async submitGuess(guess: string, idx: number) {
    var serviceResponse = await this.wordleService.submitGuess(this.userId(), guess);
    console.log(`Got this from the service: ${serviceResponse.message}`);
    this.historicFeedbacks.update((oldContents: GuessResponse[]) => [...oldContents, serviceResponse]);
    this.historicGuesses[idx] = guess;
    
    // Update letter states based on feedback
    const feedback = serviceResponse.feedback;
    const newStates = { ...this.letterStates() };
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      const state = feedback[i];
      if (state === 'G' && (!newStates[letter] || newStates[letter] !== 'correct')) {
        newStates[letter] = 'correct';
      } else if (state === 'Y' && (!newStates[letter] || newStates[letter] === 'absent')) {
        newStates[letter] = 'present';
      } else if (state === 'B' && !newStates[letter]) {
        newStates[letter] = 'absent';
      }
    }
    this.letterStates.set(newStates);

    if (idx < this.inputs().length - 1)
      this.inputs()[idx + 1].focusToFirstInput();
  }

  handleKeyPress(key: string) {
    const currentInput = this.inputs().find((input: GuessInputComponent) => !input.isComplete());
    if (!currentInput) return;

    if (key === 'Backspace') {
      currentInput.handleBackspace();
    } else if (key === 'Enter') {
      currentInput.submitGuess();
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      currentInput.handleKeyPress(key);
    }
  }

  async register(username: string) {
    this.username.set(username);
    try {
      var registerResponse = await this.wordleService.register(username);
      console.log(`This is the register response that I received: ${registerResponse.message}`);
      this.userId.set(registerResponse.id);
    } catch (err) {
      this.errorMessage.set(err as string);
    }
  }

  async createNewGame() {
    var createResponse = await this.wordleService.create(this.userId());
    if (createResponse.message) {
      this.isGameCreated.set(true);
      this.letterStates.set({});
      this.historicFeedbacks.set([]);
      this.historicGuesses = ["", "", "", "", "", ""];
    }
  }
}
