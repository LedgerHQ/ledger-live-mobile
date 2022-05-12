//
//  Logger+Extensions.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 2/19/22.
//

import OSLog

extension Logger {
    private static var subsystem = "LedgerConnect Extension"

    static let extensionHandler = Logger(subsystem: subsystem, category: "ExtensionHandler")
    static let eventEmitter = Logger(subsystem: subsystem, category: "EventEmitter")
}
