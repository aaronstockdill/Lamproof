# Lamproof
Writing Lamport-style 21st Century proofs, the easy way.

## Why does this exist?
First off, please read [Lamport's own words](http://lamport.azurewebsites.net/pubs/proof.pdf) on the matter.

I like the idea of writing Lamport style proofs, and although I can do this on paper, or in LaTeX, or whatever, this just seems easier! Lamport himself notes repeatedly throughout his introduction to Lamport-style proofs that a hypertext approach is much easier to use than a static listing because it allows the reader to dig sufficiently deep for themselves to be convinced.

## What can it do?
Lamproof itself is very, very simple. It is essentially an editable, collapsable list that has support for MathJax and checks that all the tree branches close in a true statement. But at the end of the day, that is surprisingly sufficient!

Lamproof saves its files as `.proof` documents, which are plain text files that have a particular layout it knows how to read (plus the single control character, `<<True>>`).

## What will it be able to do in the future?
While Lamproof is pretty much ready to go for day-to-day use, there are a few niceties that I would like to add.

1. Lamproof should be able to export to a simple LaTeX fragment so you can easily insert the resulting proof into a paper. After all, that's probably why you are writing the proof! This is not an immediately necessary feature, because many mathematicians are still attached to their prose-style proofs, and will wish to translate the Lamport proof accordingly.
2. Lamproof should also export to an HTML fragment. After all, a Lamport proof is most useful if you can collapse and reveal the pieces you need to see, so why not enable exactly this feature? Having the ability to add a proof to a website either as supplementary material for a paper, or just because you wish your readers to understand your proof better, would be useful. Again, this feature is not necessary to functionailty, so is in the todo list!

## Licence
Copyright 2017 Aaron Stockdill

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
