//
//  MethodRequest.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 3/4/22.
//

import Foundation

struct MethodRequest {
    let id: Int
    let type: String
    let chain : String
    let method: String
    let payload: Any?

    init?(extensionMessage: [String: Any]) {
        guard let id = extensionMessage[ExtensionMessageKey.id] as? Int,
              let type = extensionMessage[ExtensionMessageKey.type] as? String,
              let chain = extensionMessage[ExtensionMessageKey.chain] as? String,
              let method = extensionMessage[ExtensionMessageKey.method] as? String else {
            return nil
        }

        self.id = id
        self.type = type
        self.chain = chain
        self.method = method
        self.payload = extensionMessage[ExtensionMessageKey.payload]
    }
}
