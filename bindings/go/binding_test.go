package tree_sitter_chimera_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_chimera "github.com/tree-sitter/tree-sitter-chimera/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_chimera.Language())
	if language == nil {
		t.Errorf("Error loading Chimera Lang grammar")
	}
}
