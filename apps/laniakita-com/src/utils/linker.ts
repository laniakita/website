const linker = (idStr: string, slugStr: string, config: string) => {
  const newStr = idStr.split('-').shift();
  const blogLink = `${config}/${newStr}/${slugStr}`;
  return blogLink;
};

export default linker