// ported to TS from github.com/simov/slugify
import { charMap, locales } from './data';

type Options =
  | {
      replacement?: string;
      remove?: RegExp;
      lower?: boolean;
      strict?: boolean;
      locale?: string;
      trim?: boolean;
    }
  | string;

const slugify = (string: string, options?: Options): string => {
  const replace = (string: string, options?: Options): string => {
    if (typeof string !== 'string') {
      throw new Error('slugify: string argument expected');
    }

    options = typeof options === 'string' ? { replacement: options } : options || {};

    const locale = options.locale ? locales[options.locale] : {};
    const replacement = options.replacement === undefined ? '-' : options.replacement;
    const trim = options.trim === undefined ? true : options.trim;
    let slug = string
      .normalize()
      .split('')
      // replace characters based on charMap
      .reduce(function (result, ch) {
        let appendChar = locale[ch];
        if (appendChar === undefined) appendChar = charMap[ch];
        if (appendChar === undefined) appendChar = ch;
        if (appendChar === replacement) appendChar = ' ';
        return (
          result +
          appendChar
            // remove not allowed characters
            .replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '')
        );
      }, '');

    if (options.strict) {
      slug = slug.replace(/[^A-Za-z0-9\s]/g, '');
    }

    if (trim) {
      slug = slug.trim();
    }

    // Replace spaces with replacement character, treating multiple consecutive
    // spaces as a single space.
    slug = slug.replace(/\s+/g, replacement);

    if (options.lower) {
      slug = slug.toLowerCase();
    }

    return slug;
  };

  return replace(string, options);
};

export default slugify;
