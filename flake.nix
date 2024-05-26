{
  description = "Dev environment for Lani's Dev Blog";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/1266f3820e6a279bbf15294557c166237b45c10d";
  };
  
  outputs = inputs@{nixpkgs, ... }: let
    forAllSystems = function:
      nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
      ] (system: function nixpkgs.legacyPackages.${system});
  
  in {
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
        packages = with pkgs; [
          turbo
          bun
          zsh
          turso-cli
        ];
        shellHook = ''
          exec zsh
        '';
      };
    });
  };
}
