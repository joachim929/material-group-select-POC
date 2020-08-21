import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {filter, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PokemonGroup} from './interaces/pokemon-group.interface';
import {Pokemon} from './interaces/pokemon.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
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
  searchControl = new FormControl('');
  groupControl = new FormGroup({});
  intermediate: any = {};
  selectControl = new FormControl();
  alignment = new FormControl();

  filteredOptions$: Observable<PokemonGroup[]>;

  ngOnInit() {
    this.pokemonGroups.forEach((group) => {
      this.groupControl.addControl(group.id, new FormControl());
      this.intermediate[group.id] = false;
    });

    this.filteredOptions$ = this.searchControl.valueChanges.pipe(
      map((query: string) => !!query ? this.pokemonGroups
          .map((group) => ({
            ...group,
            pokemon: group.pokemon.filter((pokemon) => pokemon.viewValue.toLowerCase().indexOf(query.toLowerCase()) !== -1)
          }))
          .filter((group) => group.pokemon.length > 0) :
        [...this.pokemonGroups]
      ),
      startWith([...this.pokemonGroups])
    );

    this.selectControl.valueChanges.pipe(
      map((nextSelection) => nextSelection.reduce((acc, pokemon) => {
        acc[pokemon.parentId] = acc[pokemon.parentId] ? [...acc[pokemon.parentId], pokemon] : [pokemon];
        return acc;
      }, {})),
      filter((sortedSelection) => !!sortedSelection)
    ).subscribe((sortedSelection: { [key: string]: Pokemon[] }) => {
      this.pokemonGroups.forEach((group) => {
        if (typeof sortedSelection[group.id] !== 'undefined') {
          this.intermediate[group.id] = sortedSelection[group.id]?.length !== group.pokemon.length;
          if (sortedSelection[group.id]?.length === group.pokemon.length) {
            this.groupControl.get(group.id).setValue(true, {emitEvent: false});
          }
        } else {
          this.intermediate[group.id] = false;
          this.groupControl.get(group.id).setValue(false, {emitEvent: false});
        }
      });
    });

    this.groupControl.valueChanges.subscribe(nextSelection => {
      const test: Pokemon[] = this.pokemonGroups
        .filter((group) => !!nextSelection[group.id])
        .map((group, index) => {
          this.intermediate[group.id] = false;
          return group.pokemon;
        })
        .reduce((acc, pokemonArray) => {
          acc = [...acc, ...pokemonArray];
          return acc;
        }, []);
      this.selectControl.setValue(test, {emitEvent: false});
    });
  }
}
