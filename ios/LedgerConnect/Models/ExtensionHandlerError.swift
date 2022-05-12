//
//  ExtensionHandlerError.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 4/6/22.
//

import Foundation

enum ExtensionHandlerError: LocalizedError {
    case unexpectedData
    case unsupportedMethod(String)
    case unknown

    var errorDescription: String? {
        switch self {
        case .unexpectedData:
            return NSLocalizedString("Unexpected message data sent to native", comment: "")

        case .unsupportedMethod(let method):
            return NSLocalizedString("Unsupported method sent to native: \(method)", comment: "")

        case .unknown:
            return NSLocalizedString("An unknown error occurred.", comment: "")
        }
    }
}
