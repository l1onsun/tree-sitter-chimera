{
  description = "Tree-sitter parser for Chimera Lang";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    inputs:
    let
      forSystem = inputs.nixpkgs.lib.genAttrs [
        "x86_64-linux"
      ];
      pkgsFor = forSystem (system: import inputs.nixpkgs { inherit system; });
    in
    {
      devShells = forSystem (
        system:
        let
          pkgs = pkgsFor."${system}";
        in
        {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.tree-sitter
              pkgs.nodejs-slim_23
            ];
            # SOME_ENV_VAR = "";
          };
        }
      );
    };
}
