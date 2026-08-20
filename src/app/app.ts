import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { LoanCalculator } from './components/loan-calculator/loan-calculator';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, LoanCalculator],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('LoanCalculator.Client');
}
