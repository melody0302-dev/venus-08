export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string | number;
  path?: string;
}

export interface NavGroup {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface Region {
  id: string;
  name: string;
  provider: string;
  status: 'online' | 'maintenance';
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
  balance: string;
}
