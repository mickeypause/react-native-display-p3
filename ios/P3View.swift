import ExpoModulesCore

class P3View: ExpoView {
  private func parseColor(_ value: [Double]?) -> UIColor? {
    guard let channels = value, channels.count >= 3 else {
      return nil
    }

    let r = CGFloat(min(max(channels[0], 0), 1))
    let g = CGFloat(min(max(channels[1], 0), 1))
    let b = CGFloat(min(max(channels[2], 0), 1))
    let a = CGFloat(min(max(channels.count > 3 ? channels[3] : 1, 0), 1))
    return UIColor(displayP3Red: r, green: g, blue: b, alpha: a)
  }

  func setBackgroundColor(_ value: [Double]?) {
    backgroundColor = parseColor(value)
  }

  func setBorderColor(_ value: [Double]?) {
    layer.borderColor = parseColor(value)?.cgColor
  }

  func setShadowColor(_ value: [Double]?) {
    layer.shadowColor = parseColor(value)?.cgColor
  }
}
