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
            self.proof_structure.push(stmt)
            this.checkClosure()
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
            children: children_list,
            selfevident: false
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
        const proofText = document.createElement('div')
        proofText.className = "proof-text"
        proofText.innerHTML = '<span class="proof-prefill" tabIndex="-1">Click to edit text</span>'
        const ed = new MathEditor(proofText)
        proof.appendChild(proofText)
        const remove = document.createElement('button')
        remove.className = "proof-remove-statement"
        remove.addEventListener('click',
        () => {
            proof.parentElement.removeChild(proof)
            // Remove from the proof structure
            self.removeStatement(proof_id)
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
            children.style.height = 'auto';
            children_list.push(stmt)
            self.checkClosure()
        }, false)
        self_evidence.addEventListener("click",
        () => {
            proof_object.selfevident = true;
            self.checkClosure()
            children.removeChild(add_child)
            children.removeChild(spacer)
            children.removeChild(self_evidence)
            disclosure.style.background = 'none'
            disclosure.style.cursor = 'initial'
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
            closed = closed && this._checkClosure(this.proof_structure[i])
        }
        if (this.proof_structure.length === 0) {
            closed = false
        }
        return closed;
    }
}
