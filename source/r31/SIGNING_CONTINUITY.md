# EpicDash UX signing continuity from r8

The private key used for r3–r7 was not present in the supplied source archives or current build workspace. It cannot be recovered from a signed APK.

The r8 APK therefore starts a new standalone experimental signing line with certificate SHA-256:

```text
cc09e34e407d8ff8416fbdf48f208bb5c58483af8fcd427201a6b59f588c6142
```

Subject:

```text
CN=EpicDash UX Unofficial Development r8+, OU=Standalone Layout Lab, O=EpicDash UX, C=SE
```

The private PKCS#12 key is distributed separately from this source archive as:

```text
EpicDash-UX-r8-plus-signing-key.p12
```

Keep that file and its password secure. Future r8+ APKs must use this same key to install with `adb install -r` over r8. The key is for the unofficial `com.buttonbox.ble.ul` experiment only and must never be used for the official `com.buttonbox.ble.jz` application.

Because r7 uses a different certificate, moving from r7 to r8 requires one uninstall of only `com.buttonbox.ble.ul`. This clears only the experimental app's local data. Export any local draft needed before uninstalling.
