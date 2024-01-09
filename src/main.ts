import { ApplicationContext } from 'src/ApplicationContext';
import { AssetLoadingPage } from "src/states/AssetLoadingPage";

import '../assets/stylesheets/base.scss';

const application = new ApplicationContext();
application.pageManager.set(new AssetLoadingPage());
