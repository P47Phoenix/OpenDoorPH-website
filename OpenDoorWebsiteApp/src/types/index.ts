// Common types for the application
export interface ChurchInfo {
  name: string;
  address: string;
  serviceTime: string;
  pastor: string;
}

export interface NavigationItem {
  path: string;
  title: string;
  label: string;
}

export interface MenuLinkItem {
  text: string;
  url: string;
  external?: boolean;
}

export interface SocialLink {
  url: string;
  platform: string;
  label: string;
}

// Component Props interfaces
export interface SideBarProps {
  scheduleTitle?: string;
  scheduleItems?: string[];
  menuItems?: MenuLinkItem[];
  serviceTime?: string;
  socialLinks?: SocialLink[];
}

export interface FooterProps {
  copyrightYear?: number;
  templateCredit?: boolean;
}

export interface IframeProps {
  src: string;
  width: number | string;
  height: number | string;
  title: string;
  frameBorder?: number;
  scrolling?: string;
  marginHeight?: number;
  marginWidth?: number;
}

// Style object types
export interface MapStyleProps {
  color: string;
  textAlign: string;
}
