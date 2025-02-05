import { HtmlElement } from "cx/widgets";
import { removeCommonIndent } from "./removeCommonIndent";

import { addLanguage, highlight } from "illuminate-js";
import { jsx } from "illuminate-js/lib/languages/jsx";
addLanguage("jsx", jsx);
addLanguage("scss", jsx);

function lazyHighlight(text, lang) {
   var cache;
   return () => {
      if (typeof cache == "undefined") {
         var withoutIndent = removeCommonIndent(text);
         cache = highlight(withoutIndent, lang);
      }
      return cache;
   };
}

export class CodeSnippet extends HtmlElement {
   render(context, instance, key) {
      let { data } = instance,
         fiddleLink;

      if (this.fiddle) {
         fiddleLink = (
            <a
               href={`https://fiddle.cxjs.io/?f=${this.fiddle}`}
               className={this.CSS.element(this.baseClass, "link")}
               target="_blank"
            >
               <i className="fa fa-external-link"></i>
               Cx Fiddle
            </a>
         );
      }

      return (
         <div key={key} className={data.classNames}>
            <pre className={`language-${this.lang}`}>{this.renderChildren(context, instance)}</pre>
            {fiddleLink}
         </div>
      );
   }

   add(text) {
      if (typeof text != "string") return super.add(...arguments);

      super.add({
         type: HtmlElement,
         innerHtml: lazyHighlight(text, this.lang),
         tag: "code",
         class: `language-${this.lang}`,
      });
   }
}

CodeSnippet.prototype.plainText = true;
CodeSnippet.prototype.tag = "pre";
CodeSnippet.prototype.lang = "jsx";
CodeSnippet.prototype.baseClass = "codesnippet";
CodeSnippet.prototype.CSS = "dx";
