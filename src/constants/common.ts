import { $t } from '@/locales';
import { transformRecordToOption } from '@/utils/common';

export const yesOrNoRecord: Record<CommonType.YesOrNo, App.I18n.I18nKey> = {
  Y: 'common.yesOrNo.yes',
  N: 'common.yesOrNo.no',
  U: 'common.unkonw'
};
export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord);

export const yesOrNoNumRecord: Record<CommonType.YesOrNoNum, App.I18n.I18nKey> = {
  0: 'common.yesOrNo.no',
  1: 'common.yesOrNo.yes',
  2: 'common.unkonw'
};
export const yesOrNoNumOptions = transformRecordToOption(yesOrNoNumRecord);

export const enableRecord: Record<CommonType.EnableStatus, App.I18n.I18nKey> = {
  0: 'common.enable.disabled',
  1: 'common.enable.enabled',
  2: 'common.unkonw'
};
export const enableOptions = transformRecordToOption(enableRecord);

export const enableNextRecord: Record<CommonType.EnableStatus, App.I18n.I18nKey> = {
  1: 'common.enable.enabled',
  2: 'common.enable.disabled',
  0: 'common.unkonw'
};
export const enableNextOptions = transformRecordToOption(enableNextRecord);

export const booleanOptions = [
  {
    label: $t('common.yesOrNo.no'),
    value: 'true'
  },
  {
    label: $t('common.yesOrNo.no'),
    value: 'false'
  }
];
