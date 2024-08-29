{
  description = "Dev environment for Lani's Dev Blog";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs @ {nixpkgs, ...}: let
    forAllSystems = function:
      nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
      ] (system: function nixpkgs.legacyPackages.${system});
  in {
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        NIX_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
          pkgs.stdenv.cc.cc
          pkgs.openssl
          pkgs.zlib
          pkgs.fuse3
          pkgs.icu
          pkgs.nss
          pkgs.openssl
          pkgs.curl
          pkgs.expat
        ];
        NIX_LD = pkgs.lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker";
        NIX_LD_x86_64-linux = pkgs.lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker";
        packages = with pkgs; [
          turbo
          bun
          nodejs_20
          zsh
          turso-cli
        ];
        shellHook = ''
          exec zsh
          export NIX_LD
          export NIX_LD_x86_64-linux
        '';
      };
    });
  };
}
