export type ISidebarItem = {
    name: string;
    active?: boolean;
    icon?: string;
    href?: string;
    subject?: string;
    routerLink?: string;
    permission?: string;
    callback?: () => void;
    children?: ISidebarItem[];
}
