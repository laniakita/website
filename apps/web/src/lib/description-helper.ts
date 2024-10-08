export const descriptionHelper = (rawStr: string | undefined, postSlug?: string | undefined, justDescr?: boolean) => {
  if (!rawStr) return;

  const findDescr = rawStr.split('\n').map((strPara) => {
    const paraFound = strPara.split(' ')[0];
    // negatively matches digits, upper/lowercase letters, whitespaces, colons, and accented latin chars.
    // this results in matching everything else, i.e. headers, block quotes, etc.
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && !/[^a-zA-Z\d\s:\u00C0-\u00FF]/.test(paraFound!)) {
      return strPara;
    }
    return undefined;
  }) as string[];

  const foundDescr = findDescr.filter((el) => el)[0]?.split(' ');

  if (!foundDescr || foundDescr.length <= 1) return;

  const endInjection = foundDescr[foundDescr.length - 1]?.split('.');

  if (!endInjection || endInjection.length <= 1) return;

  const inject = endInjection.toSpliced(-1, 1, `... <nobr>[\`READ_MORE =>\`](${postSlug ?? 'blog'})</nobr>`);
  const injected = inject.join('');

  if (!injected) return;

  foundDescr.splice(-1, 1, injected).join(' ');

  return justDescr ? findDescr.filter((el) => el)[0] : foundDescr.join(' ');
};
