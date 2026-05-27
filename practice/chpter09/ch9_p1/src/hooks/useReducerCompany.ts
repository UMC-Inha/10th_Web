import { useReducer } from 'react';

type State = {
  position: string;
  isUnlocked: boolean;
};

type Action =
  | { type: 'UNLOCK' }
  | { type: 'SET_POSITION'; payload: string }
  | { type: 'LOCK' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UNLOCK':
      return { ...state, isUnlocked: true };
    case 'SET_POSITION':
      if (!state.isUnlocked) return state;
      return { position: action.payload, isUnlocked: false };
    case 'LOCK':
      return { ...state, isUnlocked: false };
    default:
      return state;
  }
}

const initialState: State = {
  position: 'Software Developer',
  isUnlocked: false,
};

export function useReducerCompany() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const tryUnlock = (code: string) => {
    if (code === '카드메이커') dispatch({ type: 'UNLOCK' });
  };

  const setPosition = (position: string) => {
    dispatch({ type: 'SET_POSITION', payload: position });
  };

  return {
    position: state.position,
    isUnlocked: state.isUnlocked,
    tryUnlock,
    setPosition,
  };
}
