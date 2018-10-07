export const key = 'users';

export const defaultState = {
  selected: null,
  data: null,
  loading: false,
};

const USERS = [{ id: 1, name: 'Bob' }, { id: 2, name: 'Paul' }];

export const actions = {
  load: () => async (produce, getState) => {
    if (getState().loading) return;
    produce(draft => {
      draft.loading = true;
    });
    // simulate async call
    await new Promise(r => setTimeout(r, 1000));
    produce(draft => {
      draft.loading = false;
      draft.data = USERS;
    });
  },

  select: uid => produce => {
    produce(draft => {
      draft.selected = uid;
    });
  },
};

export const selectors = {
  selected: state => ({ selected: state.selected }),
};
