package com.buttonbox.ble

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.view.View
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.atomic.AtomicReference

/**
 * Clean, standalone wrapper for the exact EpicDash UX dashboard asset.
 *
 * This is an exploratory source reconstruction. It intentionally does not contain the
 * compiled APK's full native USB/BLE/diagnostics implementation. The JavaScript layout,
 * demo animation, page navigation, INI picker, clipboard bridge and settings bridge are
 * provided so the layout can be edited and rebuilt independently.
 */
class DashboardLabActivity : Activity() {
    private lateinit var webView: WebView
    private val importedIni = AtomicReference<ImportedIni?>(null)
    private val requiredChannels = AtomicReference<List<String>>(emptyList())

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
            addJavascriptInterface(EpicDashAndroidBridge(), "EpicDashAndroid")
            loadUrl("file:///android_asset/dashboard_lab.html")
        }
        setContentView(webView)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.removeJavascriptInterface("EpicDashAndroid")
        webView.destroy()
        super.onDestroy()
    }

    @Deprecated("Uses the platform result API to keep this source project dependency-light.")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode != REQUEST_IMPORT_INI || resultCode != RESULT_OK) return
        val uri = data?.data ?: return
        contentResolver.takePersistableUriPermission(
            uri,
            data.flags and (Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
        )
        importedIni.set(readIniMetadata(uri))
        sendNotice("INI selected: ${importedIni.get()?.name ?: "unknown"}")
    }

    private fun readIniMetadata(uri: Uri): ImportedIni {
        var name = "selected.ini"
        var size = -1L
        contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE), null, null, null)
            ?.use { cursor ->
                if (cursor.moveToFirst()) {
                    cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME).takeIf { it >= 0 }?.let { name = cursor.getString(it) }
                    cursor.getColumnIndex(OpenableColumns.SIZE).takeIf { it >= 0 }?.let { size = cursor.getLong(it) }
                }
            }
        return ImportedIni(uri.toString(), name, size)
    }

    private fun sendNotice(message: String) {
        if (!::webView.isInitialized) return
        val quoted = JSONObject.quote(message)
        runOnUiThread { webView.evaluateJavascript("window.EpicDashNativeNotice?.($quoted)", null) }
    }

    private inner class EpicDashAndroidBridge {
        @JavascriptInterface
        fun setKeepScreenAwake(enabled: Boolean) {
            runOnUiThread {
                if (enabled) window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                else window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            }
        }

        @JavascriptInterface
        fun copyText(label: String, text: String) {
            runOnUiThread {
                val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                clipboard.setPrimaryClip(ClipData.newPlainText(label.take(80), text.take(1_000_000)))
                sendNotice("$label copied")
            }
        }

        @JavascriptInterface
        fun importUsbIni() {
            runOnUiThread {
                val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
                }
                @Suppress("DEPRECATION")
                startActivityForResult(intent, REQUEST_IMPORT_INI)
            }
        }

        @JavascriptInterface
        fun setLiveTransport(mode: String): Boolean = mode.equals("usb", ignoreCase = true)

        @JavascriptInterface
        fun setUsbPollHz(hz: Int): Boolean = hz in 1..100

        @JavascriptInterface
        fun setUsbRequiredChannels(json: String): Boolean = try {
            val array = JSONArray(json)
            requiredChannels.set((0 until array.length()).mapNotNull { array.optString(it).takeIf(String::isNotBlank) })
            true
        } catch (_: Exception) {
            false
        }

        @JavascriptInterface
        fun usbReconnect(): Boolean {
            sendNotice("Native ECU transport is not included in this clean UX source wrapper")
            return false
        }

        @JavascriptInterface
        fun getUsbChannelCatalogJson(): String = "[]"

        @JavascriptInterface
        fun getDiagnosticsJson(): String = JSONObject()
            .put("app", JSONObject()
                .put("name", "EpicDash UX")
                .put("package", packageName)
                .put("versionName", BuildConfig.VERSION_NAME)
                .put("versionCode", BuildConfig.VERSION_CODE))
            .put("sourceReconstruction", true)
            .put("nativeTransportIncluded", false)
            .put("importedIni", importedIni.get()?.toJson() ?: JSONObject.NULL)
            .put("requiredChannels", JSONArray(requiredChannels.get()))
            .put("dashboardAsset", "dashboard_lab.html")
            .toString()
    }

    private data class ImportedIni(val uri: String, val name: String, val size: Long) {
        fun toJson(): JSONObject = JSONObject().put("uri", uri).put("name", name).put("size", size)
    }

    companion object {
        private const val REQUEST_IMPORT_INI = 1001
    }
}
