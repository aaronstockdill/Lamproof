"use strict"

function proofTeX(steps_list, indent) {
    var text = ""
    if (steps_list.length <= 0) return text;
    text += indent + "\\begin{enumerate}[label={\\arabic*.}]\n"
    for (var i = 0; i < steps_list.length; i++) {
        const item = steps_list[i]
        text += indent + "\\item " + item.editor.getPlainText() + '\n'
        text += proofTeX(item.children, indent + '\t')
    }
    text += indent + "\\end{enumerate}\n"
    return text
}

function asTeX (theorem, proof) {
    var exprt = ""
    exprt += "% \\usepackage{amsthm}\n"
    exprt += "% \\usepackage{enumitem}\n"
    exprt += "% \\newtheorem{theorem}{Theorem}\n\n"
    exprt += "\\begin{theorem}\n"
    exprt += theorem.getPlainText() + "\n"
    exprt += "\\end{theorem}\n"
    exprt += "\\begin{proof}~\\\\\n"
    exprt += proofTeX(proof.proof_structure, '')
    exprt += "\\end{proof}\n"
    return exprt
}





function asHTML(theorem, proof) {
    var exprt = ""
    exprt += "<script>\n"
    exprt += JSON.stringify(proof.proof_structure)
    exprt += "<//script>"
    return exprt
}
