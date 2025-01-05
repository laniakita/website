export const descriptionHelper = (rawStr: string | undefined, postSlug?: string | undefined, justDescr?: boolean) => {
  if (!rawStr) return;

  const findDescr = rawStr
    .split('\n')
    .slice(0, 10)
    .map((strPara) => {
      //console.log(strPara);
      const paraFound = strPara.split(' ')[0];
      //console.log(paraFound);
      // negatively matches digits, upper/lowercase letters, whitespaces, colons, and accented latin chars.
      // this results in matching everything else, i.e. headers, block quotes, etc.
      if (paraFound) {
        if (strPara !== '' && strPara.split(' ')[0] !== 'import') {
          if (!/[^a-zA-Z\d\s:\u00C0-\u00FF]/.test(paraFound.split('')[0]!)) {
            //console.log(strPara);
            return strPara;
          } else if (/\*/.test(paraFound.split('')[0]!)) {
            //console.log(strPara);
            return strPara;
          }
        }
      }
      return undefined;
    }) as string[];

  const foundDescr = findDescr.filter((el) => el)[0]?.split(' ');

  if (!foundDescr || foundDescr.length <= 1) return;

  //console.log(foundDescr[foundDescr.length - 1])

  const endInjection = foundDescr[foundDescr.length - 1]?.split('.');

  let inject: string[] = [];
  if (endInjection && endInjection.length > 1) {
    inject = endInjection.toSpliced(-1, 1, `... <nobr>[\`READ_MORE =>\`](${postSlug ?? 'blog'})</nobr>`);
  } else if (foundDescr[foundDescr.length - 1]) {
    const altInjection = foundDescr[foundDescr.length - 1]!.split('');
    altInjection.push('.');
    inject = altInjection.toSpliced(
      -1,
      1,
      `<nobr><span style="padding-left:1ch">[\`READ_MORE =>\`](${postSlug ?? 'blog'})</span></nobr>`,
    );
  }

  const injected = inject.join('');

  if (!injected) return;

  foundDescr.splice(-1, 1, injected).join(' ');

  return justDescr ? findDescr.filter((el) => el)[0] : foundDescr.join(' ');
};
