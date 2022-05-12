//
//  NSExtensionContext+Extensions.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 4/4/22.
//

import SafariServices

extension NSExtensionContext {
    var methodRequest: MethodRequest? {
        guard let item = self.inputItems[0] as? NSExtensionItem,
              let message = item.userInfo?[SFExtensionMessageKey],
              let messageDictionary = message as? [String: Any],
              let methodRequest = MethodRequest(extensionMessage: messageDictionary) else {
            return nil
        }

        return methodRequest
    }
}
