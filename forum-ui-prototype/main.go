//go:generate gopherjs build -m

package main

import (
	"bytes"
	"crypto/sha512"
	"fmt"
	"html/template"
	"math/rand"
	"strings"
	"unicode"
	"unicode/utf16"
	"unicode/utf8"

	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"

	"github.com/BenLubar/df2014/namegen"
	"github.com/BenLubar/hellstew/emoji"
	"github.com/gopherjs/gopherjs/js"
	"honnef.co/go/js/dom"
)

var speakWord = func() *namegen.Word {
	for _, w := range namegen.Words {
		if w.ID == "SPEAK" {
			return w
		}
	}
	panic("unreachable")
}()

type Topic struct {
	ID    int64
	Name  string
	Posts []*Post
}

type Post struct {
	ID     int64
	Author *User
	Body   template.HTML
}

type User struct {
	ID     int64
	Name   string
	Avatar string
	lang   func(*namegen.Word) string
}

func main() {
	doc := dom.GetWindow().Document()

	tmpl := template.New(``)
	for _, el := range doc.QuerySelectorAll("script[id^=\"tmpl-\"]") {
		template.Must(tmpl.New(strings.TrimPrefix(el.ID(), "tmpl-")).Parse(el.TextContent()))
	}

	topic := makeTopic()

	var buf bytes.Buffer
	err := tmpl.ExecuteTemplate(&buf, "topic-page", topic)
	if err != nil {
		panic(err)
	}
	doc.QuerySelector("body").SetInnerHTML(buf.String())

	post := doc.QuerySelector("#post-29 > .post-content")
	post.SetAttribute("contenteditable", "true")
	var timeout int
	isCleaner := false
	setTimeout := func() {
		dom.GetWindow().ClearTimeout(timeout)
		innerHTML := post.InnerHTML()
		hash := sha512.Sum512([]byte(innerHTML))
		sepAnchor := fmt.Sprintf("[[ANCHOR:%02x]]", hash)
		sepFocus := fmt.Sprintf("[[FOCUS:%02x]]", hash)
		sel := js.Global.Call("getSelection")
		anchorNode := dom.WrapNode(sel.Get("anchorNode"))
		anchorOff := sel.Get("anchorOffset").Int()
		focusNode := dom.WrapNode(sel.Get("focusNode"))
		focusOff := sel.Get("focusOffset").Int()
		innerHTML = string(selectionHTML(nil, post, post.ChildNodes(), sepAnchor, sepFocus, anchorNode, anchorOff, focusNode, focusOff))
		timeout = dom.GetWindow().SetTimeout(func() {
			isCleaner = true
			innerHTML = CleanPostContent(innerHTML)
			innerHTML = strings.Replace(innerHTML, sepAnchor, "<a id=\"editor_anchor\"></a>", 1)
			innerHTML = strings.Replace(innerHTML, sepFocus, "<a id=\"editor_focus\"></a>", 1)
			post.SetInnerHTML(innerHTML)
			anchor := post.QuerySelector("#editor_anchor")
			focus := post.QuerySelector("#editor_focus")
			if anchor != nil && focus != nil {
				sel := js.Global.Call("getSelection")
				sel.Call("removeAllRanges")
				r := doc.Underlying().Call("createRange")
				r.Call("setStart", anchor.Underlying(), 0)
				r.Call("setEnd", focus.Underlying(), 0)
				sel.Call("addRange", r)
			}
			if anchor != nil {
				anchor.ParentElement().RemoveChild(anchor)
			}
			if focus != nil {
				focus.ParentElement().RemoveChild(focus)
			}
			timeout = 0
		}, 100)
	}
	obs := NewMutationObserver(func(records []MutationRecord, obs MutationObserver) {
		if isCleaner {
			isCleaner = false
			return
		}
		setTimeout()
	})
	options := MutationObserverInit{Object: js.Global.Get("Object").New()}
	options.ChildList = true
	options.Attributes = true
	options.CharacterData = true
	options.Subtree = true
	obs.Observe(post, options)
	doc.AddEventListener("selectionchange", false, func(e dom.Event) {
		if timeout != 0 {
			setTimeout()
		}
	})
	post.Underlying().Call("scrollIntoViewIfNeeded")
}

var langs = []func(*namegen.Word) string{
	func(w *namegen.Word) string { return w.Translation.Dwarf },
	func(w *namegen.Word) string { return w.Translation.Human },
	func(w *namegen.Word) string { return w.Translation.Goblin },
	func(w *namegen.Word) string { return w.Translation.Elf },
}

func makeTopic() *Topic {
	r := rand.New(rand.NewSource(0))

	users := make([]*User, r.Intn(10)+5)
	for i := range users {
		first, front, rear := namegen.GenerateNameParts(r)
		lang := langs[r.Intn(len(langs))]
		name := ucfirst(lang(first))
		if rand.Intn(5) != 0 {
			name += " " + ucfirst(lang(front)) + lang(rear)
		}
		users[i] = &User{
			ID:   int64(i) + 1,
			Name: name,
			lang: lang,
		}
	}

	topicTitle := ""

	posts := make([]*Post, r.Intn(30)+20)
	for i := range posts {
		u := users[r.Intn(len(users))]

		if i == 0 {
			topicTitle = makeTitle(r, u.lang)
		}

		posts[i] = makePost(r, int64(i)+1, u, topicTitle, users, posts[:i])
	}

	return &Topic{
		ID:    1,
		Name:  topicTitle,
		Posts: posts,
	}
}

func ucfirst(s string) string {
	r, size := utf8.DecodeRuneInString(s)
	return string(unicode.ToUpper(r)) + s[size:]
}

func makeTitle(r *rand.Rand, lang func(*namegen.Word) string) string {
	var buf []byte

	words := r.Intn(8) + 2
	for i := 0; i < words; i++ {
		if i != 0 {
			buf = append(buf, ' ')
		}
		compound := r.Intn(2) + 1
		for j := 0; j < compound; j++ {
			word := lang(namegen.Words[r.Intn(len(namegen.Words))])
			if j == 0 && (i == 0 || r.Intn(25) == 0) {
				word = ucfirst(word)
			}
			buf = append(buf, word...)
		}
	}
	return string(buf)
}

func makePost(r *rand.Rand, id int64, u *User, title string, users []*User, posts []*Post) *Post {
	nodes := make([]*html.Node, r.Intn(5)+1)
	for i := range nodes {
		switch r.Intn(10) {
		case 0:
			nodes[i] = &html.Node{
				Type:     html.ElementNode,
				Data:     "ul",
				DataAtom: atom.Ul,
			}
			children := r.Intn(5) + 1
			for j := 0; j < children; j++ {
				li := &html.Node{
					Type:     html.ElementNode,
					Data:     "li",
					DataAtom: atom.Li,
				}
				makeText(li, r, u, users)
				nodes[i].AppendChild(li)
			}
		case 1:
			nodes[i] = &html.Node{
				Type:     html.ElementNode,
				Data:     "blockquote",
				DataAtom: atom.Blockquote,
			}
			if len(posts) == 0 || r.Intn(10) == 0 {
				p := &html.Node{
					Type:     html.ElementNode,
					Data:     "p",
					DataAtom: atom.P,
				}
				sentences := r.Intn(3) + 1
				for j := 0; j < sentences; j++ {
					makeText(p, r, u, users)
				}
				nodes[i].AppendChild(p)
			} else {
				nodes[i].Attr = append(nodes[i].Attr, html.Attribute{
					Key: "class",
					Val: "quote",
				})
				quoted := posts[r.Intn(len(posts))]
				makeQuote(nodes[i], r, u, title, quoted)
			}
		default:
			nodes[i] = &html.Node{
				Type:     html.ElementNode,
				Data:     "p",
				DataAtom: atom.P,
			}
			sentences := r.Intn(7) + 1
			for j := 0; j < sentences; j++ {
				if r.Intn(5) == 0 {
					nodes[i].AppendChild(makeMention(users[r.Intn(len(users))]))
					nodes[i].AppendChild(&html.Node{
						Type: html.TextNode,
						Data: " ",
					})
				}
				makeText(nodes[i], r, u, users)
			}
		}
	}

	nodes = emoji.Replace(nodes...)

	var buf bytes.Buffer
	for _, n := range nodes {
		err := html.Render(&buf, n)
		if err != nil {
			panic(err)
		}
	}

	return &Post{
		ID:     id,
		Author: u,
		Body:   template.HTML(buf.String()),
	}
}

func makeMention(u *User) *html.Node {
	a := &html.Node{
		Type:     html.ElementNode,
		Data:     "a",
		DataAtom: atom.A,
		Attr: []html.Attribute{
			{
				Key: "class",
				Val: "mention",
			},
		},
	}
	a.AppendChild(&html.Node{
		Type: html.TextNode,
		Data: "@" + strings.Replace(u.Name, " ", "-", -1),
	})
	return a
}

var punct = []string{
	". ",
	". ",
	"! ",
	"? ",
	" ",
}

var emote = []string{
	":smiling: ",
	":frowning: ",
	":cry: ",
	":popcorn: ",
	":poop: ",
}

func makeText(node *html.Node, r *rand.Rand, u *User, users []*User) {
	node.AppendChild(&html.Node{
		Type: html.TextNode,
		Data: makeTitle(r, u.lang) + punct[r.Intn(len(punct))],
	})
	if r.Intn(10) == 0 {
		node.AppendChild(&html.Node{
			Type: html.TextNode,
			Data: emote[r.Intn(len(emote))],
		})
	}
}

func makeQuote(node *html.Node, r *rand.Rand, u *User, title string, quoted *Post) {
	header := &html.Node{
		Type:     html.ElementNode,
		Data:     "header",
		DataAtom: atom.Header,
	}
	header.AppendChild(makeMention(quoted.Author))
	header.AppendChild(&html.Node{
		Type: html.TextNode,
		Data: " " + u.lang(speakWord) + " ",
	})
	header.AppendChild(&html.Node{
		Type:     html.ElementNode,
		Data:     "a",
		DataAtom: atom.A,
		Attr: []html.Attribute{
			{
				Key: "href",
				Val: fmt.Sprintf("#post-%d", quoted.ID),
			},
		},
	})
	header.LastChild.AppendChild(&html.Node{
		Type: html.TextNode,
		Data: title,
	})
	header.AppendChild(&html.Node{
		Type: html.TextNode,
		Data: ":",
	})
	node.AppendChild(header)

	nodes, err := html.ParseFragment(strings.NewReader(string(quoted.Body)), node)
	if err != nil {
		panic(err)
	}

	for _, n := range nodes {
		nodes = appendAllNodes(nodes, n)
	}

	n := nodes[r.Intn(len(nodes))]
	n.Parent, n.PrevSibling, n.NextSibling = nil, nil, nil
	node.AppendChild(n)
}

func appendAllNodes(nodes []*html.Node, n *html.Node) []*html.Node {
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		nodes = append(nodes, n)
		nodes = appendAllNodes(nodes, c)
	}

	return nodes
}

func selectionHTML(buf []byte, parent dom.Element, nodes []dom.Node, as, fs string, an dom.Node, ao int, fn dom.Node, fo int) []byte {
	for i, n := range nodes {
		if an.IsEqualNode(parent) && ao == i {
			buf = append(buf, as...)
		}
		if fn.IsEqualNode(parent) && fo == i {
			buf = append(buf, fs...)
		}
		if _, ok := n.(*dom.Text); ok {
			t := n.TextContent()
			if n.IsEqualNode(an) {
				jsstr := utf16.Encode([]rune(t))
				if n.IsEqualNode(fn) {
					if ao < fo {
						buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[:ao])))...)
						buf = append(buf, as...)
						buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[ao:fo])))...)
						buf = append(buf, fs...)
						buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[fo:])))...)
					} else {
						buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[:fo])))...)
						buf = append(buf, fs...)
						buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[fo:ao])))...)
						buf = append(buf, as...)
						buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[ao:])))...)
					}
				} else {
					buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[:ao])))...)
					buf = append(buf, as...)
					buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[ao:])))...)

				}
			} else if n.IsEqualNode(fn) {
				jsstr := utf16.Encode([]rune(t))
				buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[:fo])))...)
				buf = append(buf, fs...)
				buf = append(buf, html.EscapeString(string(utf16.Decode(jsstr[fo:])))...)
			} else {
				buf = append(buf, html.EscapeString(t)...)
			}
			continue
		}

		el := n.(dom.Element)

		if !el.Contains(an) && !el.Contains(fn) {
			buf = append(buf, el.OuterHTML()...)
			continue
		}

		h := el.OuterHTML()
		buf = append(buf, h[:strings.IndexByte(h, '>')+1]...)
		buf = selectionHTML(buf, el, el.ChildNodes(), as, fs, an, ao, fn, fo)
		buf = append(buf, h[strings.LastIndexByte(h, '<'):]...)
	}
	if an.IsEqualNode(parent) && ao == len(nodes) {
		buf = append(buf, as...)
	}
	if fn.IsEqualNode(parent) && fo == len(nodes) {
		buf = append(buf, fs...)
	}

	return buf
}
