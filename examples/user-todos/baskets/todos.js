export const key = 'todos';

export const defaultState = {
  data: null,
  loading: false,
};

const TODOS = {
  1: [{ title: 'Buy veggies' }, { title: 'Wash bicycle' }],
  2: [{ title: 'Do the dishes' }],
};

export const actions = {
  load: uid => async produce => {
    produce(draft => {
      draft.loading = true;
      draft.data = null; // reset
    });
    // simulate async call
    await new Promise(r => setTimeout(r, 1000));
    produce(draft => {
      draft.loading = false;
      draft.data = TODOS[uid];
    });
  },
};
