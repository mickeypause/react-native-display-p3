import ExpoModulesCore
import ObjectiveC
import UIKit

/**
 Example app only:
 - **sRGB tuple**: from `CGColor.converted(to: sRGB)` + components (no `getRed`).
 - **Display P3 tuple for P3View**: uses `-getDisplayP3Red:green:blue:alpha:` (Objective‑C) when available so values
   match `UIColor(displayP3Red:green:blue:alpha:)`. Some SDKs omit this from the Swift overlay; we invoke the IMP
   directly. Otherwise falls back to `CGColor` conversion with `.relativeColorimetric` intent.
 */
public class CgColorSpacesModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CgColorSpaces")

    AsyncFunction("colorSpacesFromHex") { (hex: String) -> [String: Any] in
      guard let ui = Self.uiColorFromHex(hex) else {
        return Self.emptyPayload(message: "Invalid hex string")
      }

      return Self.payload(from: ui)
    }
  }

  private static func emptyPayload(message: String) -> [String: Any] {
    return [
      "error": message,
      "nativeColorSpaceName": NSNull(),
      "nativeComponents": [],
      "srgb": [0.0, 0.0, 0.0, 1.0] as [Double],
      "displayP3": [0.0, 0.0, 0.0, 1.0] as [Double],
    ]
  }

  private static func payload(from ui: UIColor) -> [String: Any] {
    let cg = ui.cgColor

    let nativeSpaceName: String = {
      guard let cs = cg.colorSpace, let n = cs.name else {
        return "unknown"
      }
      return (n as String?) ?? String(describing: n)
    }()

    let nativeComponents = cg.components?.map { Double($0) } ?? []

    guard let srgbCS = CGColorSpace(name: CGColorSpace.sRGB) else {
      return [
        "error": NSNull(),
        "nativeColorSpaceName": nativeSpaceName,
        "nativeComponents": nativeComponents,
        "srgb": rgba01(from: cg),
        "displayP3": displayP301(from: ui),
      ]
    }

    let srgbCG = cg.converted(to: srgbCS, intent: .defaultIntent, options: nil) ?? cg

    return [
      "error": NSNull(),
      "nativeColorSpaceName": nativeSpaceName,
      "nativeComponents": nativeComponents,
      "srgb": rgba01(from: srgbCG),
      "displayP3": displayP301(from: ui),
    ]
  }

  /// Components suitable for `UIColor(displayP3Red:green:blue:alpha:)` / `P3View` props.
  private static func displayP301(from ui: UIColor) -> [Double] {
    if let fromObjc = displayP3ComponentsViaObjC(from: ui) {
      return fromObjc
    }
    return displayP3Fallback(from: ui)
  }

  /// Calls `-getDisplayP3Red:green:blue:alpha:` when the selector exists (not always exposed to Swift).
  private static func displayP3ComponentsViaObjC(from ui: UIColor) -> [Double]? {
    let sel = NSSelectorFromString("getDisplayP3Red:green:blue:alpha:")
    guard ui.responds(to: sel) else {
      return nil
    }

    let cls: AnyClass = object_getClass(ui) ?? UIColor.self
    guard let method = class_getInstanceMethod(cls, sel) ?? class_getInstanceMethod(UIColor.self, sel) else {
      return nil
    }

    var r: CGFloat = 0
    var g: CGFloat = 0
    var b: CGFloat = 0
    var a: CGFloat = 0

    typealias ImpType = @convention(c) (
      AnyObject, Selector,
      UnsafeMutablePointer<CGFloat>,
      UnsafeMutablePointer<CGFloat>,
      UnsafeMutablePointer<CGFloat>,
      UnsafeMutablePointer<CGFloat>
    ) -> Bool

    let imp = method_getImplementation(method)
    let call = unsafeBitCast(imp, to: ImpType.self)
    guard call(ui, sel, &r, &g, &b, &a) else {
      return nil
    }

    return [Double(r), Double(g), Double(b), Double(a)]
  }

  private static func displayP3Fallback(from ui: UIColor) -> [Double] {
    guard let p3 = CGColorSpace(name: CGColorSpace.displayP3) else {
      return [0.0, 0.0, 0.0, 1.0]
    }
    let converted = ui.cgColor.converted(to: p3, intent: .relativeColorimetric, options: nil) ?? ui.cgColor
    return rgba01(from: converted)
  }

  private static func rgba01(from cg: CGColor?) -> [Double] {
    guard let cg = cg, let c = cg.components else {
      return [0.0, 0.0, 0.0, 1.0]
    }
    let n = cg.numberOfComponents
    if n == 4 {
      return [Double(c[0]), Double(c[1]), Double(c[2]), Double(c[3])]
    }
    if n == 3 {
      return [Double(c[0]), Double(c[1]), Double(c[2]), 1.0]
    }
    if n == 2 {
      let g = Double(c[0])
      return [g, g, g, Double(c[1])]
    }
    if n == 1 {
      let g = Double(c[0])
      return [g, g, g, 1.0]
    }
    return [0.0, 0.0, 0.0, 1.0]
  }

  private static func uiColorFromHex(_ raw: String) -> UIColor? {
    var h = raw.trimmingCharacters(in: .whitespacesAndNewlines)
    if h.hasPrefix("#") {
      h.removeFirst()
    }

    guard let value = UInt64(h, radix: 16) else {
      return nil
    }

    let r: CGFloat
    let g: CGFloat
    let b: CGFloat
    let a: CGFloat

    switch h.count {
    case 3:
      r = CGFloat((value >> 8) & 0xf) / 15.0
      g = CGFloat((value >> 4) & 0xf) / 15.0
      b = CGFloat(value & 0xf) / 15.0
      a = 1.0
    case 6:
      r = CGFloat((value >> 16) & 0xff) / 255.0
      g = CGFloat((value >> 8) & 0xff) / 255.0
      b = CGFloat(value & 0xff) / 255.0
      a = 1.0
    case 8:
      r = CGFloat((value >> 24) & 0xff) / 255.0
      g = CGFloat((value >> 16) & 0xff) / 255.0
      b = CGFloat((value >> 8) & 0xff) / 255.0
      a = CGFloat(value & 0xff) / 255.0
    default:
      return nil
    }

    return UIColor(red: r, green: g, blue: b, alpha: a)
  }
}
