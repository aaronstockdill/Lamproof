"use strict"

class ProofEditor
{
    constructor (element) {
        const self = this
        this.proofbox = element
        this.proof_structure = []

        const add_child = document.createElement("button")
        add_child.className = "proof-add-statement"
        add_child.innerText = "Add statement"
        add_child.addEventListener("click",
        () => {
            const stmt = self.createNewStatement(self.proofbox)
            self.proof_structure.push(stmt)
        }, false)
        this.proofbox.appendChild(add_child)
    }

    createNewStatement (parentNode) {
        const self = this
        const proof = document.createElement("div")
        proof.className = "proof-statement"
        const disclosure = document.createElement("button")
        disclosure.className = "proof-disclosure"
        disclosure.addEventListener('click', function () {
            const is_showing = this.classList.contains('open')
            const children = this.parentElement.getElementsByClassName('proof-children')[0]
            if (is_showing) {
                this.classList.remove('open')
                children.style.height = '0px'
            } else {
                this.classList.add('open')
                children.style.height = 'auto';
            }
        }, false);
        disclosure.innerText = "Reveal children"
        proof.appendChild(disclosure)
        const proofText = document.createElement('div')
        proofText.className = "proof-text"
        proofText.setAttribute("contenteditable", "true")
        proofText.innerHTML = '<span class="proof-prefill" tabIndex="-1">Click to edit text</span>'
        const me = new MathEditor(proofText)
        proof.appendChild(proofText)
        const children = document.createElement("div")
        children.className = "proof-children"
        const add_child = document.createElement("button")
        add_child.className = "proof-add-statement"
        add_child.innerText = "Add statement"
        const children_list = []
        add_child.addEventListener("click",
        () => {
            const stmt = self.createNewStatement(children)
            children.style.height = 'auto';
            children_list.push(stmt)
        }, false)
        children.appendChild(add_child)
        proof.appendChild(children)
        const sentinel = parentNode.lastChild
        parentNode.insertBefore(proof, sentinel)

        const proof_object = {
            DOM: proof,
            children: children_list
        }
        return proof_object
    }
}
