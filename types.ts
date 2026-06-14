
export type GroupCategory = 'Casual' | 'Professional' | 'Party' | 'Academic' | 'Tech';

export interface Participant {
  id: string;
  name: string;
}

export interface IcebreakerResponse {
  question: string;
  funFactPrompt?: string;
}
