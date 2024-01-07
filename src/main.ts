import { ApplicationContext } from 'src/ApplicationContext';
import { AssetLoadingState } from "./states/AssetLoadingState";

import '../assets/stylesheets/base.scss';

const application = new ApplicationContext();
application.stateManager.setState(new AssetLoadingState());
