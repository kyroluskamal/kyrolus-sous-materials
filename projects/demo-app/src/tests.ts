import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tests',
  imports: [RouterLink],
  template: `
    <button routerLink="toggle-on-scroll-directive-test">
      Toggle class on scroll test
    </button>
  `,
  styles: `
  :host {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  width: 100%;
  height: 100vh;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  button {
    padding: 12px 25px;
    border: none;
    border-radius: 25px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    text-decoration: none; // Ensure it looks like a button even if it's a link

    &:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
    }
  }
}
`,
})
export class Tests {}
