import Foundation
import UIKit

@objc(LivePatchModule)
class LivePatchModule: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func saveData(_ key: String, url: String) {
      UserDefaults.standard.set(url, forKey: key)
  }
}
