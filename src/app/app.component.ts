import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {filter} from 'rxjs/operators';

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
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  searchControl = new FormControl('');
  groupControl = new FormGroup({});
  intermediate: any = {};
  selectControl = new FormControl();
  pokemonGroups: PokemonGroup[] = [
    {
      id: 'grass',
      name: 'Grass',
      pokemon: [
        {parentId: 'grass', value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
        {parentId: 'grass', value: 'oddish-1', viewValue: 'Oddish'},
        {parentId: 'grass', value: 'bellsprout-2', viewValue: 'Bellsprout'}
      ]
    },
    {
      id: 'water',
      name: 'Water',
      pokemon: [
        {parentId: 'water', value: 'squirtle-3', viewValue: 'Squirtle'},
        {parentId: 'water', value: 'psyduck-4', viewValue: 'Psyduck'},
        {parentId: 'water', value: 'horsea-5', viewValue: 'Horsea'}
      ]
    },
    {
      id: 'fire',
      name: 'Fire',
      disabled: true,
      pokemon: [
        {parentId: 'fire', value: 'charmander-6', viewValue: 'Charmander'},
        {parentId: 'fire', value: 'vulpix-7', viewValue: 'Vulpix'},
        {parentId: 'fire', value: 'flareon-8', viewValue: 'Flareon'}
      ]
    },
    {
      id: 'psychic',
      name: 'Psychic',
      pokemon: [
        {parentId: 'psychic', value: 'mew-9', viewValue: 'Mew'},
        {parentId: 'psychic', value: 'mewtwo-10', viewValue: 'Mewtwo'}
      ]
    }
  ];

  filteredOptions: any[];

  ngOnInit() {
    this.pokemonGroups.map((group) => {
      this.groupControl.addControl(group.id, new FormControl());
      this.intermediate[group.id] = false;
    });

    this.filteredOptions = [...this.pokemonGroups];

    this.searchControl.valueChanges.subscribe((nextValue) => {
      if (!!nextValue) {
        this.filteredOptions = [...this.pokemonGroups].map((group) => ({
          ...group,
          pokemon: group.pokemon.filter((pokemon) =>
            pokemon.viewValue.toLowerCase().indexOf(nextValue.toLowerCase()) !== -1)
        }));
        this.filteredOptions = [...this.filteredOptions].filter(group => group.pokemon.length > 0);
      } else {
        this.filteredOptions = [...this.pokemonGroups];
      }
    });

    this.selectControl.valueChanges.subscribe(nextSelection => {
      if (!!nextSelection) {
        this.pokemonGroups.map((group) => {
          this.intermediate[group.id] = false;
        });
        nextSelection.map((pokemon) => {
          this.intermediate[pokemon.parentId] = true;
        });
      }
    });

    this.groupControl.valueChanges.pipe(
      filter(() => !!this.selectControl.value)
    ).subscribe(nextSelection => {
      this.selectControl.setValue(this.selectControl.value.filter((pokemon) =>
        nextSelection[pokemon.parentId]));
    });
  }
}
