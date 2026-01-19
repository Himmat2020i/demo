package com.in8it.uktsa

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import android.content.Context
import java.io.File
import android.content.SharedPreferences
import com.facebook.reactnative.androidsdk.FBSDKPackage;

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              add(LivePatchPackage())
              add(FBSDKPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        // Custom JS bundle renderer
        override fun getJSBundleFile(): String? {
          val sharedPreferences: SharedPreferences = getSharedPreferences("LivePatchPrefs", Context.MODE_PRIVATE)
          val url: String? = sharedPreferences.getString("url", null)
          val file = File(url ?: "")

          return if (file.exists()) {
              url
          } else {
              "assets://index.android.bundle"
          }
        }

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
