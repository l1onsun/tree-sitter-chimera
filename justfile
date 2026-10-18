highlights_symlink:
    mkdir -p ~/.config/helix/runtime/queries/chimera
    ln -sfn $PWD/queries/highlights.scm ~/.config/helix/runtime/queries/chimera/

helix_log:
    tail --follow ~/.cache/helix/helix.log
