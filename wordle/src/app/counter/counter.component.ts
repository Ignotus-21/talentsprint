import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
  count = signal(0);
  
  partyEmojis (num: number) : string {
    var out = "";
    for (var i = 0; i < num; i++) {
      out += "🎉";
    }
    return out;
  }

  increment(): void {
    this.count.set(this.count() + 1);
  }
}
