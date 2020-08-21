import {Pokemon} from './pokemon.interface';

export interface PokemonGroup {
  id: string;
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}
