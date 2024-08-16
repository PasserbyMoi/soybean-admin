import { $t } from '@/locales';
import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '0': 'page.manage.common.status.disable',
  '1': 'page.manage.common.status.enable',
  '2': 'page.manage.common.status.unknow'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '0': 'common.gender.female',
  '1': 'common.gender.male',
  '2': 'common.gender.unknow'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.type.directory',
  '2': 'page.manage.menu.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

export const tableSelectionColumns: NaiveUI.TableColumn<any> = {
  type: 'selection',
  align: 'center',
  width: 60
};

export const tableIndexColumns: NaiveUI.TableColumn<any> = {
  key: 'index',
  title: $t('common.index'),
  align: 'center',
  width: 60
};
