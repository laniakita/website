/* esm.sh - esbuild bundle(shiki@1.3.0/theme-css-variables) esnext production */
function s(n={}){let{name:a="css-variables",variablePrefix:r="--shiki-",fontStyle:o=!0}=n,t=e=>n.variableDefaults?.[e]?`var(${r}${e}, ${n.variableDefaults[e]})`:`var(${r}${e})`,i={name:a,type:"dark",colors:{"editor.foreground":t("foreground"),"editor.background":t("background"),"terminal.ansiBlack":t("ansi-black"),"terminal.ansiRed":t("ansi-red"),"terminal.ansiGreen":t("ansi-green"),"terminal.ansiYellow":t("ansi-yellow"),"terminal.ansiBlue":t("ansi-blue"),"terminal.ansiMagenta":t("ansi-magenta"),"terminal.ansiCyan":t("ansi-cyan"),"terminal.ansiWhite":t("ansi-white"),"terminal.ansiBrightBlack":t("ansi-bright-black"),"terminal.ansiBrightRed":t("ansi-bright-red"),"terminal.ansiBrightGreen":t("ansi-bright-green"),"terminal.ansiBrightYellow":t("ansi-bright-yellow"),"terminal.ansiBrightBlue":t("ansi-bright-blue"),"terminal.ansiBrightMagenta":t("ansi-bright-magenta"),"terminal.ansiBrightCyan":t("ansi-bright-cyan"),"terminal.ansiBrightWhite":t("ansi-bright-white")},tokenColors:[{scope:["keyword.operator.accessor","meta.group.braces.round.function.arguments","meta.template.expression","markup.fenced_code meta.embedded.block"],settings:{foreground:t("foreground")}},{scope:"emphasis",settings:{fontStyle:"italic"}},{scope:["strong","markup.heading.markdown","markup.bold.markdown"],settings:{fontStyle:"bold"}},{scope:["markup.italic.markdown"],settings:{fontStyle:"italic"}},{scope:"meta.link.inline.markdown",settings:{fontStyle:"underline",foreground:t("token-link")}},{scope:["string","markup.fenced_code","markup.inline"],settings:{foreground:t("token-string")}},{scope:["comment","string.quoted.docstring.multi"],settings:{foreground:t("token-comment")}},{scope:["constant.numeric","constant.language","constant.other.placeholder","constant.character.format.placeholder","variable.language.this","variable.other.object","variable.other.class","variable.other.constant","meta.property-name","meta.property-value","support"],settings:{foreground:t("token-constant")}},{scope:["keyword","storage.modifier","storage.type","storage.control.clojure","entity.name.function.clojure","entity.name.tag.yaml","support.function.node","support.type.property-name.json","punctuation.separator.key-value","punctuation.definition.template-expression"],settings:{foreground:t("token-keyword")}},{scope:"variable.parameter.function",settings:{foreground:t("token-parameter")}},{scope:["support.function","entity.name.type","entity.other.inherited-class","meta.function-call","meta.instance.constructor","entity.other.attribute-name","entity.name.function","constant.keyword.clojure"],settings:{foreground:t("token-function")}},{scope:["entity.name.tag","string.quoted","string.regexp","string.interpolated","string.template","string.unquoted.plain.out.yaml","keyword.other.template"],settings:{foreground:t("token-string-expression")}},{scope:["punctuation.definition.arguments","punctuation.definition.dict","punctuation.separator","meta.function-call.arguments"],settings:{foreground:t("token-punctuation")}},{scope:["markup.underline.link","punctuation.definition.metadata.markdown"],settings:{foreground:t("token-link")}},{scope:["beginning.punctuation.definition.list.markdown"],settings:{foreground:t("token-string")}},{scope:["punctuation.definition.string.begin.markdown","punctuation.definition.string.end.markdown","string.other.link.title.markdown","string.other.link.description.markdown"],settings:{foreground:t("token-keyword")}}]};return o||(i.tokenColors=i.tokenColors?.map(e=>(e.settings?.fontStyle&&delete e.settings.fontStyle,e))),i}export{s as createCssVariablesTheme};
//# sourceMappingURL=theme-css-variables.js.map