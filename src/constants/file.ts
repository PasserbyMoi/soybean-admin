import type { MenuOption } from 'naive-ui';
import SvgIcon from '@/components/custom/svg-icon.vue';

/** 文件分类 */
export const FileTypeList: MenuOption[] = [
  {
    key: 'list',
    label: '文件类型',
    icon: () => h(SvgIcon, { localIcon: 'apps' }),
    children: [
      { label: '全部', key: '0', icon: () => h(SvgIcon, { localIcon: 'menu-file' }) },
      { label: '图片', key: '2', icon: () => h(SvgIcon, { localIcon: 'file-image-color' }) },
      { label: '文档', key: '3', icon: () => h(SvgIcon, { localIcon: 'file-txt' }) },
      { label: '视频', key: '4', icon: () => h(SvgIcon, { localIcon: 'file-video-color' }) },
      { label: '音频', key: '5', icon: () => h(SvgIcon, { localIcon: 'file-music' }) },
      { label: '其他', key: '1', icon: () => h(SvgIcon, { localIcon: 'file-other' }) }
    ]
  }
];

export interface FileExtendNameIconMap {
  [key: string]: string;
}

/** 文件类型图标 Map 映射 */
export const FileIcon: FileExtendNameIconMap = {
  mp3: 'file-music',
  mp4: 'file-video-color',
  webm: 'file-video-color',
  pdf: 'file-pdf-color',
  dir: 'file-dir',
  ppt: 'file-ppt',
  doc: 'file-wps',
  docx: 'file-wps',
  csv: 'file-excel',
  xls: 'file-excel',
  xlsx: 'file-excel',
  txt: 'file-txt',
  rar: 'file-rar',
  zip: 'file-zip',
  html: 'file-html',
  css: 'file-css',
  js: 'file-js',
  other: 'file-other' // 未知文件
};

/** 图片类型 */
export const ImageTypes = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'webp',
  'ico',
  'psd',
  'tiff',
  'dwg',
  'jxr',
  'apng',
  'xcf'
];

export const TextTypes = ['txt', 'md', 'csv'];

/** WPS、Office文件类型 */
export const OfficeTypes = ['pdf', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx'];

/** Video 文件类型 */
export const VideoTypes = ['mp4', 'avi', 'mkv', 'flv', 'webm', 'wmv', 'm4v', 'mov', 'mpg', 'rmvb', '3gp'];

/** Sound 文件类型 */
export const MusicTypes = ['mp3', 'flac', 'wav', 'ogg', 'midi', 'm4a', 'aac', 'amr', 'ac3', 'aiff'];

export function isPrePdf(ext: string) {
  return ext.toLowerCase() === 'pdf';
}

export function isText(ext: string) {
  return TextTypes.includes(ext.toLowerCase());
}

export function isImage(ext: string) {
  return ImageTypes.includes(ext.toLowerCase());
}

export function isOffice(ext: string) {
  return OfficeTypes.includes(ext.toLowerCase());
}

export function isVideo(ext: string) {
  return VideoTypes.includes(ext.toLowerCase());
}

export function isMusic(ext: string) {
  return MusicTypes.includes(ext.toLowerCase());
}
