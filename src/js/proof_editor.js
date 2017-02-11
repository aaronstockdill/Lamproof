"use strict"

class ProofEditor
{
    constructor (element) {
        const self = this
        this.proofbox = element
        this.proof_structure = []
        this.__proofId = 1

        const add_child = document.createElement("button")
        add_child.className = "proof-add-statement"
        add_child.innerText = "Add statement"
        add_child.addEventListener("click",
        () => {
            const stmt = self.createNewStatement(self.proofbox)
            stmt.depth = 0
            self.proof_structure.push(stmt)
            this.checkClosure()
            this.updateNumbering()
        }, false)
        this.proofbox.appendChild(add_child)
    }

    _newProofId () {
        const the_id = this.__proofId;
        this.__proofId++
        return the_id
    }

    createNewStatement (parentNode) {
        const self = this
        const proof_id = this._newProofId()
        const children_list = []
        const proof = document.createElement("div")
        const proof_object = {
            DOM: proof,
            id: proof_id,
            depth: -1,
            number: -1,
            children: children_list,
            selfevident: false,
            editor: null
        }
        proof.className = "proof-statement"
        proof.id = "proof-statement-" + proof_id
        const disclosure = document.createElement("button")
        disclosure.className = "proof-disclosure"
        disclosure.addEventListener('click',
        () => {
            const is_showing = disclosure.classList.contains('open')
            const children = disclosure.parentElement.getElementsByClassName('proof-children')[0]
            if (is_showing) {
                disclosure.classList.remove('open')
                children.style.height = '0'
            } else {
                disclosure.classList.add('open')
                children.style.height = 'auto';
            }
        }, false);
        disclosure.innerText = "Reveal children"
        proof.appendChild(disclosure)
        const proofNumbering = document.createElement('span')
        proofNumbering.className = "proof-numbering"
        proof.appendChild(proofNumbering)
        const proofText = document.createElement('div')
        proofText.className = "proof-text"
        proofText.innerHTML = '<span class="proof-prefill" tabIndex="-1">Click to edit text</span>'
        const ed = new MathEditor(proofText)
        proof_object.editor = ed
        proof.appendChild(proofText)
        const remove = document.createElement('button')
        remove.className = "proof-remove-statement"
        remove.addEventListener('click',
        () => {
            proof.parentElement.removeChild(proof)
            // Remove from the proof structure
            self.removeStatement(proof_id)
            this.updateNumbering()
            self.checkClosure()
        }, false)
        proof.appendChild(remove)
        const close_indicator = document.createElement('span')
        close_indicator.className = "proof-closure open"
        proof.appendChild(close_indicator)
        const children = document.createElement("div")
        children.className = "proof-children"
        const spacer = document.createElement('i')
        spacer.className = "proof-mini-or"
        spacer.innerHTML = "or"
        const add_child = document.createElement("button")
        add_child.className = "proof-add-statement"
        add_child.innerText = "Add statement"
        const self_evidence = document.createElement("button")
        self_evidence.className = "proof-self-evidence"
        self_evidence.innerText = "Statement is true"
        self_evidence.was_removed = false
        add_child.addEventListener("click",
        () => {
            const kids = children.childNodes
            if (!self_evidence.was_removed) {
                children.removeChild(self_evidence)
                children.removeChild(spacer)
                self_evidence.was_removed = true
            }
            const stmt = self.createNewStatement(children)
            stmt.depth = proof_object.depth + 1
            children.style.height = 'auto'
            children_list.push(stmt)
            self.checkClosure()
            self.updateNumbering()
        }, false)
        self_evidence.addEventListener("click",
        () => {
            proof_object.selfevident = true;
            children.removeChild(add_child)
            children.removeChild(spacer)
            children.removeChild(self_evidence)
            disclosure.style.background = 'none'
            disclosure.style.cursor = 'initial'
            self.checkClosure()
            ed.disable()
        }, false)
        children.appendChild(add_child)
        children.appendChild(spacer)
        children.appendChild(self_evidence)
        proof.appendChild(children)
        const sentinel = parentNode.lastElementChild
        parentNode.insertBefore(proof, sentinel)
        disclosure.click()
        return proof_object
    }

    _removeStatement (proof_id, search) {
        if (search === undefined) {
            return false
        }
        for (var i = 0; i < search.length; i++) {
            if (search[i].id === proof_id) {
                search.splice(i, 1)
                return true;
            } else {
                const removed = this._removeStatement(proof_id, search[i].children)
                if (removed) {
                    return true;
                }
            }
        }
        return false
    }

    removeStatement (proof_id) {
        var search = this.proof_structure
        return this._removeStatement(proof_id, search)
    }

    _updateNumbering (stmt_list) {
        for (var i = 0; i < stmt_list.length; i++) {
            const number = (i + 1) + '.'
            stmt_list[i].DOM.getElementsByClassName('proof-numbering')[0].innerHTML = number
            stmt_list[i].number = i + 1
            this._updateNumbering(stmt_list[i].children)
        }
    }

    updateNumbering () {
        this._updateNumbering(this.proof_structure)
    }

    _checkClosure (proof) {
        var closed = true
        for (var i = 0; i < proof.children.length; i++) {
            closed = closed && this._checkClosure(proof.children[i])
        }
        if (proof.children.length === 0 && !proof.selfevident) {
            closed = false
        }
        if (closed === true) {
            // Mark the tree as closed!
            proof.DOM.getElementsByClassName('proof-closure')[0].classList.add('closed')
            proof.DOM.getElementsByClassName('proof-closure')[0].classList.remove('open')
        } else {
            proof.DOM.getElementsByClassName('proof-closure')[0].classList.add('open')
            proof.DOM.getElementsByClassName('proof-closure')[0].classList.remove('closed')
        }
        return closed;
    }

    checkClosure () {
        var closed = true
        for (var i = 0; i < this.proof_structure.length; i++) {
            closed = this._checkClosure(this.proof_structure[i]) && closed
        }
        if (this.proof_structure.length === 0) {
            closed = false
        }
        return closed;
    }

    _getStatementAsText (proof_list, indent) {
        var output = ""
        for (var i = 0; i < proof_list.length; i++) {
            const ed = proof_list[i].editor
            output += Array(indent+1).join("\t")
            output += proof_list[i].number + ". "
            output += ed.getPlainText()
            if (proof_list[i].selfevident) {
                output += " <<True>>"
            }
            output += "\n"
            output += this._getStatementAsText(proof_list[i].children, indent+1)
        }
        return output
    }

    getPlainText () {
        return this._getStatementAsText(this.proof_structure, 1)
    }

    _getStatementChildren (child_holder) {
        const children = child_holder.childNodes
        var valid_kids = []
        for (var i = 0; i < children.length; i++) {
            if (children[i].classList && children[i].classList.contains('proof-statement')) {
                valid_kids.push(children[i])
            }
        }
        return valid_kids
    }

    _buildFromStructure (list, holder) {
        const add_buttons = holder.getElementsByClassName('proof-add-statement')
        const add_button = add_buttons[add_buttons.length - 1]
        for (var i = 0; i < list.length; i++) {
            add_button.click()
            const statements = this._getStatementChildren(holder)
            const statement = statements[statements.length - 1]
            const editor_text = statement.getElementsByClassName('proof-text')[0]
            const is_true = list[i].string.endsWith(' <<True>>')
            if (is_true) {
                list[i].string = list[i].string.replace(" <<True>>", "")
                const set_truth = statement.getElementsByClassName('proof-self-evidence')[0]
                set_truth.click()
            }
            editor_text.innerHTML = list[i].string.replace(/\d+\.\s/, '')
            if (list[i].children) {
                this._buildFromStructure(list[i].children, statement.getElementsByClassName('proof-children')[0])
            }
        }
    }

    _fromText (lines, start, node_depth) {
        var children = []
        var i = start;
        while (i < lines.length) {
            if (lines[i] === "") {
                i++;
                continue;
            }
            const depth = (lines[i].match(/\t/g) || ['']).length - 1
            var item = {}
            if (depth === node_depth) {
                item.string = lines[i].replace(/\t/g, "")
                children.push(item)
                i++
            } else if (depth < node_depth) {
                break;
            } else { // depth > node_depth
                const result = this._fromText(lines, i, node_depth+1)
                item = children.pop()
                item.children = result[0]
                i = result[1]
                children.push(item)
            }
        }
        return [children, i]
    }

    fromText (text) {
        const lines = text.split("\n")
        var line_groupings = []
        const test_structure = this._fromText(lines, 0, 0)[0]
        this._buildFromStructure(test_structure, this.proofbox)
    }
}
