import { allCategories, allTags } from 'content-collections';

interface CatTag {
  url: string;
  title: string;
}

export const catTagData = ({ cats, tags }: { cats?: CatTag[] | undefined; tags?: CatTag[] | undefined }) => {
  const categories = cats
    ? cats.map((cat) => {
        const category = allCategories.find((categoryX) => categoryX.url === cat.url);

        return category;
      })
    : [];

  const tagsArr = tags
    ? tags.map((tagIdx) => {
        const tag = allTags.find((tagX) => tagX.url === tagIdx.url);

        return tag;
      })
    : [];

  const comboArr = [
    ...categories.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0),
    ...tagsArr.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0),
  ];

  return comboArr;
};
