package expo.modules.p3

import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class P3Module : Module() {
  private fun isWideGamutAvailable(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return false
    }
    return appContext.reactContext?.resources?.configuration?.isScreenWideColorGamut == true
  }

  private fun isWideGamutActive(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return false
    }
    return appContext.currentActivity?.window?.isWideColorGamut == true
  }

  override fun definition() = ModuleDefinition {
    Name("P3")

    Constant("PI") {
      Math.PI
    }

    Constant("isWideGamutAvailable") {
      isWideGamutAvailable()
    }

    Constant("isWideGamutActive") {
      isWideGamutActive()
    }

    Events("onChange")

    Function("hello") {
      "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    View(P3View::class) {
      Prop("p3BackgroundColor") { view: P3View, value: List<Double>? ->
        view.setBackgroundColorValue(value)
      }

      Prop("p3BorderColor") { view: P3View, value: List<Double>? ->
        view.setBorderColorValue(value)
      }

      Prop("p3ShadowColor") { view: P3View, value: List<Double>? ->
        view.setShadowColorValue(value)
      }
    }
  }
}
