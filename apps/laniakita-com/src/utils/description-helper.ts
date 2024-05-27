import matter from 'gray-matter';

const descriptionHelper = (rawStr: string | undefined) => {
  if (!rawStr) return;
  const postDescContent = matter(rawStr).content;

  const findDescr = postDescContent.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara;
    }
    return undefined;
  });
  return findDescr;
};

export default descriptionHelper
