"use strict"

class MathEditor
{
    constructor (element) {
        this.theorem_text = element
        this.text_default = this.theorem_text.innerHTML.trim()
        this.disable_activation = false
        this.switched = false
        const self = this

        this.theorem_text.addEventListener('keydown',
        () => {
            // self._unSyntaxHighlight()
            // self._syntaxHighlight()
        }, true)

        this.theorem_text.addEventListener('click',
        (ev) => {
            if (self.disable_activation !== false) {
                self.disable_activation.focus()
                ev.stopImmediatePropagation();
                ev.preventDefault()
                return;
            }
            self.switched = true
            this.theorem_text.setAttribute("contenteditable", "true")
            self.theorem_text.classList.add('focussed')
            if (self.theorem_text.innerHTML.trim() === self.text_default) {
                self.theorem_text.innerHTML = ""
            }
            self._asPlainText()
            self._syntaxHighlight()
            self.theorem_text.focus()
        }, false)

        this.theorem_text.addEventListener('focusout',
        (ev) => {
            if (self.switched === false || self.disable_activation) {
                ev.stopImmediatePropagation();
                ev.preventDefault()
                return;
            }
            self.switched = false
            this.theorem_text.setAttribute("contenteditable", "false")
            self.theorem_text.classList.remove('focussed')
            self._unSyntaxHighlight()
            const empty_box = false
                || self.theorem_text.innerHTML === "<div></div>"
                || self.theorem_text.innerHTML === ""
                || self.theorem_text.innerHTML === "<br>"
            if (empty_box) {
                self.theorem_text.innerHTML = self.text_default
            }
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, self.theorem_text])
        }, false)
    }

    disable () {
        this.disable_activation = true
    }

    enable () {
        this.disable_activation = false
    }

    _asPlainText () {
        var maths = MathJax.Hub.getAllJax(this.theorem_text)
        var maths_holders = [].slice.call(this.theorem_text.getElementsByClassName("MathJax_Preview"))
        for (var i = 0; i < maths.length; i++) {
            MathJax.Hub.Queue(["Remove", maths[i]])
            const wraps = (maths[i].root.display == "block") ? "$$" : "$";
            const original = document.createTextNode(wraps + maths[i].originalText + wraps)
            const parent = maths_holders[i].parentElement
            parent.replaceChild(original, maths_holders[i])
        }
        var junk = [].slice.call(
            this.theorem_text.getElementsByClassName("MathJax_SVG")).concat( [].slice.call(this.theorem_text.getElementsByTagName("script"))).concat([].slice.call(
                this.theorem_text.getElementsByClassName("MathJax_SVG_Display")))
        for (var i = 0; i < junk.length; i++) {
            junk[i].parentElement.removeChild(junk[i])
        }
        return this.theorem_text.innerHTML
    }

    _syntaxHighlight () {
        const code = this.theorem_text.innerHTML
        this.theorem_text.innerHTML = code.replace(/(\$\$?[^\$]+\$\$?)/g, "<span class='latex-code outer'>$1</span>")
        // Now actually highlight...
        const codeblocks = [].slice.call(this.theorem_text.getElementsByClassName("latex-code"))
        for (var i = 0; i < codeblocks.length; i++) {
            codeblocks[i].innerHTML = codeblocks[i].innerHTML.replace(/(\$\$?)/g, "<span class='latex-code dollars'>$1</span>")
            codeblocks[i].innerHTML = codeblocks[i].innerHTML.replace(/(\\[a-zA-Z]+)/g, "<span class='latex-code command'>$1</span>")
            codeblocks[i].innerHTML = codeblocks[i].innerHTML.replace(/(\[[^\]]+\])/g, "<span class='latex-code option'>$1</span>")
        }
    }

    _unSyntaxHighlight () {
        const codeblocks = this.theorem_text.getElementsByTagName("span")
        for (var i = codeblocks.length - 1; i >= 0; i--) {
            const chunk = codeblocks[i]
            var fragment = document.createDocumentFragment()
            while (chunk.firstChild) {
                const child = chunk.removeChild(chunk.firstChild)
                fragment.appendChild(child)
            }
            chunk.parentElement.replaceChild(fragment, chunk)
        }
    }

    getPlainText() {
        var the_html = this._asPlainText()
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.theorem_text])
        the_html = the_html.replace(this.text_default, "")
        the_html = the_html.replace(/<div>/, "\n")
        the_html = the_html.replace(/<\/div><div>/g, "\n")
        the_html = the_html.replace(/<\/div>/, "")
        return the_html.trim()
    }
}
