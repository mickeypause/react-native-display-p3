require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'CgColorSpaces'
  s.version        = package['version']
  s.summary        = 'Example-only helpers: CGColor space tuples for sRGB and Display P3'
  s.description    = s.summary
  s.license        = 'MIT'
  s.author         = 'example'
  s.homepage       = 'https://github.com/mickeypause/react-native-p3'
  s.platforms      = { ios: '15.1' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/mickeypause/react-native-p3' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  s.source_files = '**/*.{swift}'
end
