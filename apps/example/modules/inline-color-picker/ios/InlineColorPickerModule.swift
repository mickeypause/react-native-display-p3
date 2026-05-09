import ExpoModulesCore

public final class InlineColorPickerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("InlineColorPicker")

    View(InlineWheelColorPickerView.self) {
      Events("onSelectionChange")

      Prop("selection") { (view: InlineWheelColorPickerView, value: String?) in
        view.setSelectionHex(value ?? "")
      }

      Prop("supportsOpacity") { (view: InlineWheelColorPickerView, value: Bool) in
        view.setSupportsOpacity(value)
      }

      Prop("label") { (view: InlineWheelColorPickerView, value: String?) in
        view.setLabel(value ?? "Pick a color")
      }
    }
  }
}
