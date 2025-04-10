import XCTest
import SwiftTreeSitter
import TreeSitterChimera

final class TreeSitterChimeraTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_chimera())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Chimera Lang grammar")
    }
}
