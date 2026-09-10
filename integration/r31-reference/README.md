# r31 reference copies

Files under `integration/r31-reference/` are exact Git-blob copies from `source/r31/app/src/main/assets/` at the Stage A base commit. They exist only as porting/reference material and are not loaded by `integration/web/index.html`.

They preserve the accepted r31 UX implementation while making the transfer boundary explicit. Runtime ownership, Android transport calls, reconnect logic, global `demo/liveSeen/phase` authority and direct native callbacks in those historical files are not integration authority.

`source/r31/` remains immutable evidence and is not modified by Stage A.
