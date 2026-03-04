import ExpoModulesCore
import UIKit

public class P3Module: Module {
  private func isWideGamutAvailable() -> Bool {
    return UIScreen.main.traitCollection.displayGamut == .P3
  }

  private func isWideGamutActive() -> Bool {
    return UIScreen.main.traitCollection.displayGamut == .P3
  }

  public func definition() -> ModuleDefinition {
    Name("P3")

    Constant("PI") {
      Double.pi
    }

    Constant("isWideGamutAvailable") {
      self.isWideGamutAvailable()
    }

    Constant("isWideGamutActive") {
      self.isWideGamutActive()
    }

    Events("onChange")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    View(P3View.self) {
      Prop("p3BackgroundColor") { (view: P3View, value: [Double]?) in
        view.setBackgroundColor(value)
      }

      Prop("p3BorderColor") { (view: P3View, value: [Double]?) in
        view.setBorderColor(value)
      }

      Prop("p3ShadowColor") { (view: P3View, value: [Double]?) in
        view.setShadowColor(value)
      }
    }
  }
}
