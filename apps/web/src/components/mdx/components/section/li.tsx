import { DetailedHTMLProps, HTMLAttributes } from 'react';

interface FnListItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  liActive: boolean;
}
export function FnListItem(props: FnListItemProps) {
  return <li {...props} className={`relative ${props.liActive ? 'prose-footnotes-active' : 'after:opacity-0'}`} />;
}
