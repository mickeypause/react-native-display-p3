import ExpoModulesCore
import SwiftUI
import UIKit

// MARK: - SwiftUI + model (matches @expo/ui ColorPicker hex contract)

private final class InlineWheelPickerModel: ObservableObject {
  @Published var selection: Color = .clear
  @Published var supportsOpacity: Bool = true
  @Published var labelText: String = "Pick a color"

  /// Last hex emitted or applied from props (same semantics as ExpoUI `ColorPickerView`).
  private var previousHex: String = ""

  var onHexChange: ((String) -> Void)?

  func applyExternalHex(_ hex: String) {
#if !os(tvOS)
    guard let ui = Self.uiColorFromHex(hex) else {
      return
    }
    let newSelection = Color(ui)
    let newHex = Self.colorToHex(newSelection, supportsOpacity: supportsOpacity)
    previousHex = newHex
    selection = newSelection
#endif
  }

  func handleSelectionChange(_ newValue: Color) {
#if !os(tvOS)
    let newHex = Self.colorToHex(newValue, supportsOpacity: supportsOpacity)
    if newHex != previousHex {
      previousHex = newHex
      onHexChange?(newHex)
    }
#endif
  }

  /// Mirrors `ColorPickerView.swift` in `@expo/ui`.
  private static func colorToHex(_ color: Color, supportsOpacity: Bool) -> String {
    let newColor = UIColor(color)
    guard let components = newColor.cgColor.components else {
      return ""
    }

    let rgba = [
      components[0],
      components.count > 1 ? components[1] : components[0],
      components.count > 2 ? components[2] : components[0],
      newColor.cgColor.alpha
    ].map { Int(max(0, min(255, $0 * 255))) }

    let format = supportsOpacity ? "#%02X%02X%02X%02X" : "#%02X%02X%02X"
    return String(format: format, rgba[0], rgba[1], rgba[2], supportsOpacity ? rgba[3] : 255)
  }

  /// Mirrors `CgColorSpacesModule.uiColorFromHex` / common Expo hex parsing.
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

private struct InlineWheelPickerSwiftUIView: View {
  @ObservedObject var model: InlineWheelPickerModel

  var body: some View {
#if !os(tvOS)
    ColorPicker(model.labelText, selection: $model.selection, supportsOpacity: model.supportsOpacity)
      .colorPickerStyle(.wheel)
      .onChange(of: model.selection) { newValue in
        model.handleSelectionChange(newValue)
      }
#else
    EmptyView()
#endif
  }
}

// MARK: - UIView bridge

final class InlineWheelColorPickerView: ExpoView {
  let onSelectionChange = EventDispatcher()

  private let model: InlineWheelPickerModel
  private let hostingController: UIHostingController<InlineWheelPickerSwiftUIView>

  private var selectionHexFromProps: String = ""

  required init(appContext: AppContext?) {
    let model = InlineWheelPickerModel()
    let hostingController = UIHostingController(rootView: InlineWheelPickerSwiftUIView(model: model))
    self.model = model
    self.hostingController = hostingController
    super.init(appContext: appContext)

    clipsToBounds = true
    hostingController.view.backgroundColor = .clear
    hostingController.view.translatesAutoresizingMaskIntoConstraints = false

    model.onHexChange = { [weak self] hex in
      self?.onSelectionChange(["value": hex])
    }

    addSubview(hostingController.view)
    NSLayoutConstraint.activate([
      hostingController.view.leadingAnchor.constraint(equalTo: leadingAnchor),
      hostingController.view.trailingAnchor.constraint(equalTo: trailingAnchor),
      hostingController.view.topAnchor.constraint(equalTo: topAnchor),
      hostingController.view.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])
  }

  func setSelectionHex(_ hex: String) {
    selectionHexFromProps = hex
    model.applyExternalHex(hex)
  }

  func setSupportsOpacity(_ value: Bool) {
    model.supportsOpacity = value
    model.applyExternalHex(selectionHexFromProps)
  }

  func setLabel(_ value: String) {
    model.labelText = value
  }
}
