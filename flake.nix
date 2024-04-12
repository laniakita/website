{
  description = "Dev environment for Lani's Dev Blog";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  
  outputs = inputs@{self, nixpkgs, ... }: let
    forAllSystems = function:
      nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
      ] (system: function nixpkgs.legacyPackages.${system});
  
  in {
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          nodePackages_latest.nodejs
          corepack_latest
          turbo
          bun
          zsh
        ];
        shellHook = ''
          exec zsh
        '';
      };
    });
  };
}
