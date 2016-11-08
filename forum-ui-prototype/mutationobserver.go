package main

import (
	"github.com/gopherjs/gopherjs/js"
	"honnef.co/go/js/dom"
)

type MutationObserver struct {
	*js.Object
}

func NewMutationObserver(callback func([]MutationRecord, MutationObserver)) MutationObserver {
	return MutationObserver{js.Global.Get("MutationObserver").New(func(records, observer *js.Object) {
		callback(wrapRecords(records), MutationObserver{observer})
	})}
}

func (m MutationObserver) Observe(target dom.Node, options MutationObserverInit) {
	m.Call("observe", target.Underlying(), options.Object)
}

func (m MutationObserver) Disconnect() {
	m.Call("disconnect")
}

func (m MutationObserver) TakeRecords() []MutationRecord {
	return wrapRecords(m.Call("takeRecords"))
}

type MutationObserverInit struct {
	*js.Object
	ChildList             bool     `js:"childList"`
	Attributes            bool     `js:"attributes"`
	CharacterData         bool     `js:"characterData"`
	Subtree               bool     `js:"subtree"`
	AttributeOldValue     bool     `js:"attriuteOldValue"`
	CharacterDataOldValue bool     `js:"characterDataOldValue"`
	AttributeFilter       []string `js:"attributeFilter"`
}

type MutationRecord struct {
	*js.Object
}

func wrapRecords(arr *js.Object) []MutationRecord {
	records := make([]MutationRecord, arr.Length())
	for i := range records {
		records[i].Object = arr.Index(i)
	}
	return records
}

func (rec MutationRecord) Type() string {
	return rec.Get("type").String()
}

func (rec MutationRecord) Target() dom.Node {
	return dom.WrapNode(rec.Get("target"))
}

func wrapNodeList(arr *js.Object) []dom.Node {
	nodes := make([]dom.Node, arr.Length())
	for i := range nodes {
		nodes[i] = dom.WrapNode(arr.Index(i))
	}
	return nodes
}

func (rec MutationRecord) AddedNodes() []dom.Node {
	return wrapNodeList(rec.Get("addedNodes"))
}

func (rec MutationRecord) RemovedNodes() []dom.Node {
	return wrapNodeList(rec.Get("removedNodes"))
}

func (rec MutationRecord) PreviousSibling() dom.Node {
	return dom.WrapNode(rec.Get("previousSibling"))
}

func (rec MutationRecord) NextSibling() dom.Node {
	return dom.WrapNode(rec.Get("nextSibling"))
}

func (rec MutationRecord) AttributeName() string {
	return rec.Get("attributeName").String()
}

func (rec MutationRecord) AttributeNamespace() string {
	return rec.Get("attributeNamespace").String()
}

func (rec MutationRecord) OldValue() string {
	return rec.Get("oldValue").String()
}
