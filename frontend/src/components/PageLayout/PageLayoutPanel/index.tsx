import {
  DetailsContent,
  HeaderComponent,
  NavigationContentComponent,
  RootComponent,
  TopNavigationMobileComponent,
} from "./PageLayoutPanel.client";
import { ProviderComponentServer } from "./PageLayoutPanel.server";

const PageLayoutPanel = {
  Provider: ProviderComponentServer,
  Root: RootComponent,
  TopNavigationMobile: TopNavigationMobileComponent,
  NavigationContent: NavigationContentComponent,
  Details: DetailsContent,
  Header: HeaderComponent,
};

export default PageLayoutPanel;
