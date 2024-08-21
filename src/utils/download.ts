/**
 * 根据文件url获取文件名
 *
 * @param url 文件url
 */
function getFileName(url: string) {
  const num = url.lastIndexOf('/') + 1;
  let fileName = url.substring(num);
  // 把参数和文件名分割开
  fileName = decodeURI(fileName.split('?')[0]);
  return fileName;
}

/**
 * 根据文件地址下载文件
 *
 * @param {any} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName
}: {
  url: string;
  target?: '_self' | '_blank';
  fileName?: string;
}): Promise<boolean> {
  // 是否同源
  const isSameHost = new URL(url).host === location.host;
  return new Promise<boolean>(resolve => {
    if (isSameHost) {
      const link = document.createElement('a');
      link.href = url;
      link.target = target;

      if (link.download !== undefined) {
        link.download = fileName || getFileName(url);
      }

      if (document.createEvent) {
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return resolve(true);
      }

      if (!url.includes('?')) {
        url += '?download';
      }

      window.open(url, target);
      return resolve(true);
    }
    const elink = document.createElement('a');
    elink.href = url;
    elink.target = '_self';
    elink.download = fileName as string;
    elink.style.display = 'none';
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  });
}
