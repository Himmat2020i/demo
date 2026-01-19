package com.in8it.uktsa

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactContextBaseJavaModule
import android.content.Context
import android.content.SharedPreferences
import android.widget.Toast
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Callback

class LivePatchModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val sharedPreferences: SharedPreferences =
    reactContext.getSharedPreferences("LivePatchPrefs", Context.MODE_PRIVATE)

    override fun getName(): String {
        return "LivePatchModule"
    }

    @ReactMethod
    fun saveData(key: String, value: String) {
        sharedPreferences.edit().putString(key, value).apply()
    }
}
