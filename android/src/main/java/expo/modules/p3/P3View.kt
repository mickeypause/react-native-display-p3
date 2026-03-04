package expo.modules.p3

import android.content.Context
import android.graphics.Color
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class P3View(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private fun parseColor(value: List<Double>?): Int? {
    if (value == null || value.size < 3) {
      return null
    }

    val r = ((value[0].coerceIn(0.0, 1.0)) * 255).toInt()
    val g = ((value[1].coerceIn(0.0, 1.0)) * 255).toInt()
    val b = ((value[2].coerceIn(0.0, 1.0)) * 255).toInt()
    val a = (((value.getOrElse(3) { 1.0 }).coerceIn(0.0, 1.0)) * 255).toInt()
    return Color.argb(a, r, g, b)
  }

  fun setBackgroundColorValue(value: List<Double>?) {
    val color = parseColor(value)
    if (color == null) {
      background = null
      return
    }
    setBackgroundColor(color)
  }

  fun setBorderColorValue(value: List<Double>?) {
    parseColor(value)
  }

  fun setShadowColorValue(value: List<Double>?) {
    parseColor(value)
  }
}
