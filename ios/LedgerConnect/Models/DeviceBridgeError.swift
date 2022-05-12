//
//  DeviceBridgeError.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 4/6/22.
//

import Foundation

struct DeviceBridgeError: Error, Codable {
    let name: String?
    let message: String
    let stack: String?
    let statusCode: Int?
    let statusText: String?

    var asDictionary: [String: Any] {
        [
            "name": name ?? "",
            "message": message ,
            "stack": stack ?? "",
            "statusCode": statusCode ?? "",
            "statusText": statusText ?? ""
        ]
    }

    init(message: String) {
        self.name = nil
        self.message = message
        self.stack = nil
        self.statusCode = nil
        self.statusText = nil
    }
}

extension DeviceBridgeError: LocalizedError {
    var errorDescription: String? {
        return message
    }

    var failureReason: String? {
        return message
    }

    var recoverySuggestion: String? {
        return nil
    }
}
