package main

import (
	"regexp"

	"github.com/BenLubar/hellstew/emoji"
	"github.com/BenLubar/htmlcleaner"
	"golang.org/x/net/html/atom"
)

var cleanerConfig = (&htmlcleaner.Config{
	ValidateURL: htmlcleaner.SafeURLScheme,
	WrapText:    true,
}).
	GlobalAttrAtom(atom.Title).
	ElemAttrAtomMatch(atom.Blockquote, atom.Class, regexp.MustCompile(`\Aquote\z`)).
	ElemAtom(atom.P, atom.Ul, atom.Li, atom.Header, atom.Br, atom.B, atom.I, atom.Strong, atom.Em, atom.U).
	ElemAttrAtom(atom.A, atom.Href).
	ElemAttrAtomMatch(atom.Abbr, atom.Class, regexp.MustCompile(`\Aemoji\z`)).
	ElemAttrAtomMatch(atom.A, atom.Class, regexp.MustCompile(`\Amention\z`))

func CleanPostContent(body string) string {
	body = htmlcleaner.Preprocess(cleanerConfig, body)
	nodes := htmlcleaner.Parse(body)
	nodes = htmlcleaner.CleanNodes(cleanerConfig, nodes)
	nodes = emoji.Replace(nodes...)
	return htmlcleaner.Render(nodes...)
}
