import { escape } from 'lodash';

export interface MinPageData {
  title: string;
  url: string;
}

export const shareUnderChar = (minPageData: MinPageData | undefined, isBsky?: boolean, debug?: boolean) => {
  if (!minPageData) return;
  // bsky truncates URLs to 46 chars? (https://www.reddit.com/r/BlueskySocial/comments/1he9ljo/comment/m250brt/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
  // twitter truncates to 23 chars (https://developer.x.com/en/docs/counting-characters);
  // mastodon truncates to 23 chars too (https://docs.joinmastodon.org/api/guidelines/#links)
  const urlLen = isBsky ? 46 : 23;
  const titleLen = minPageData?.title.length;

  // the "+1" is the space between the title and url

  if (urlLen + titleLen + 1 > 300 || debug) {
    // concat title to fit url (-3 is to account for the "...")
    // todo verify math
    const titleSlice = minPageData?.title.slice(0, titleLen - urlLen - 3).split('');
    titleSlice?.push('...');
    const titleTrunc = titleSlice.join('');
    //console.log(titleTrunc)
    return escape(`${titleTrunc} ${minPageData?.url}`);
  }
  return `${encodeURIComponent(minPageData?.title)} ${encodeURIComponent(minPageData?.url)}`;
};
