import { allCategories, allTags } from 'contentlayer/generated';

interface CatTag {
  slug: string;
}

export const catTagData = ({ cats, tags }: { cats?: string[] | undefined; tags?: string[] | undefined }) => {
  const categories = cats
    ? cats.map((cat) => {
        const category = allCategories.find(
          (categoryX) => categoryX._raw.flattenedPath === `categories/${(cat as unknown as CatTag).slug}`,
        );

        return category;
      })
    : [];
  const tagsArr = tags
    ? tags.map((tagIdx) => {
        const tag = allTags.find((tagX) => tagX._raw.flattenedPath === `tags/${(tagIdx as unknown as CatTag).slug}`);

        return tag;
      })
    : [];

  const comboArr = [
    ...categories.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0),
    ...tagsArr.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0),
  ];

  return comboArr;
};
