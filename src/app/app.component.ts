import { Component } from '@angular/core';

interface Pokemon {
  parentId: string
  value: string;
  viewValue: string;
}

interface PokemonGroup {
  id: string,
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'untitled1';
}
