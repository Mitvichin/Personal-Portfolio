import { APP_CONTAINER_ID } from '../../utils/constants';

export const addAppContainerDiv = () => {
  beforeEach(() => {
    const root = document.createElement('div');
    root.id = 'root';
    const appContainer = document.createElement('div');
    appContainer.id = APP_CONTAINER_ID;
    root.appendChild(appContainer);
    document.body.appendChild(root);
  });

  afterEach(() => {
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
      rootDiv.remove();
    }
  });
};
