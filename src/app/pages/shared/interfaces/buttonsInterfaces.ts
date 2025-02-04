export interface IButton {
    label: string;
    icon?: string;
    action: (element: any) => void;
    color?: string;
    customClass?: string;
    iconColor?: string;
}
