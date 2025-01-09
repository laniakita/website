import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeMultiRefs() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p') {
        if (node.children.length > 1) {
          const modChildren: ElementContent[] = [];

          for (let i = node.children.length - 1; i >= 0; i--) {
            const childNode = node.children[i] as ElementContent;
            modChildren.unshift(childNode);

            const nextChildNode = node.children[i - 1]; // next is prev. cuz, we're going in reverse
            if (childNode?.type === 'element' && childNode?.tagName === 'sup' && nextChildNode?.type === 'element' && nextChildNode?.tagName === 'sup') {
              const supCommaSpacer = {
                type: 'element',
                tagName: 'sup',
                properties: {},
                children: [
                  {
                    type: 'text',
                    value: ', ',
                  }
                ]
              } satisfies ElementContent;
              modChildren.unshift(supCommaSpacer)
            }
          }

          node.children = modChildren;
        }
      }
    })
  }
}
