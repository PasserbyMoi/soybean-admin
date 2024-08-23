export interface ModeItem {
  title: string;
  icon: string;
  subtitle?: string;
  value?: string;
  type: CommonType.UserVerifyType;
  jumpMode?: 'link' | 'modal';
  status: boolean;
  statusString?: string;
}
